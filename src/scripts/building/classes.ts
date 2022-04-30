import fs from "fs";
import child_process from "child_process";
import path from "path";
import EventEmitter from "events";
import Task from "./tasks.js";
import Config from "./config.js";



export class Cache {
    private static resolve: (value: {
        [provides: string]: any;
    } | PromiseLike<{
        [provides: string]: any;
    }>) => void;
    static current: Promise<{ [provides: string]: any }> = new Promise(res => this.resolve = res);

    static async Load(cachePath: string) {
        let old;
        try {
            old = JSON.parse(await fs.promises.readFile(cachePath, "utf8"));
        } catch (e) {
            if ((e as any)?.code === 'ENOENT') {
                old = {};
            } else throw e;
        }

        this.resolve(old);
    }

    static async Save(cachePath: string) {
        await fs.promises.mkdir(path.dirname(cachePath), { recursive: true })
        await fs.promises.writeFile(cachePath, JSON.stringify(await this.current));
    }
}

export class Resource extends EventEmitter implements Task<number> {
    protected static tasks: { [path: string]: Resource } = {};

    static get(path: string) {
        return this.tasks[path] ?? (this.tasks[path] = new Resource(path));
    }

    readonly path;

    protected constructor(path: string) {
        super({ captureRejections: true });
        this.path = path;

        fs.watch(path).on("change", () => {
            this.emit("update", Date.now());
        });
    }
}

export async function Init(main: () => unknown, cachePath: string, configPath: string) {
    await Cache.Load(cachePath);
    Config.Load(configPath);
    await main();
    await Cache.Save(cachePath);
}

class OutputDirectory extends EventEmitter implements Task<string> {
    constructor() {
        super({ "captureRejections": true });

        Config.Config.get("outputDirectory").on("update", async value => {
            await fs.promises.mkdir(value, { recursive: true });
            this.emit("update", value);
        });
    }
}

export const outputDirectory = new OutputDirectory();



const compiler = "rsvg-convert";

export function Compile(options: child_process.SpawnOptions, out?: NodeJS.WritableStream, ...args: string[]) {
    return new Promise<void>((res, rej) => {
        const cp = child_process.spawn(compiler, args, options);

        if (out && cp.stdout) cp.stdout.pipe(out);

        let errorOutput = "";
        cp.on("error", err => {
            rej(err);
        });

        if (cp.stderr) cp.stderr.on("data", chunk => errorOutput += chunk);

        cp.once("close", async (code, signal) => {
            if (code) rej(`${compiler} with arguments ${args} and options ${JSON.stringify(options)} exited with exit code ${code}:\n${errorOutput}`);
            else if (signal) rej(`${compiler} with arguments ${args} and options ${JSON.stringify(options)} exited due to signal ${signal}:\n${errorOutput}`);
            else res();
        });
    });
}

export function CompileImage(source: string, out: string, ...args: string[]) {
    return Compile({}, undefined, "-o", out, ...args, source);
}

/*
export class ConditionalTask<X> extends Task<X | null> {
    constructor(td: TaskDefinition<X | null>, condition: Task<any>, provides: string, cache?: Cache | Promise<Cache>) {
        super(async depend => {
            if (await depended(condition, depend)) {
                return await td(depend);
            }
            // return async () => null;
        }, provides, cache);
    }
}

export class ConditionalCompileTask extends Task<void> {
    constructor(source: string, out: string, condition: Task<boolean>, args: string[] = [], provides = out) {
        super(async depend => {
            if (await depended(condition, depend)) {
                await depend(Resource.get(source), outputDirectory);
                return deps => CompileImage(source, path.join(deps.outputDirectory, out), ...args);
            }
            return () => { };
        }, provides);
    }
}

export class Compile1xTask extends ConditionalCompileTask {
    constructor(source: string, out: string, args: string[] = [], provides = out) {
        super(source, out, config.get("1x"), args, provides);
    }
}

export class Compile2xTask extends ConditionalCompileTask {
    constructor(source: string, out: string, args: string[] = [], provides = out) {
        super(source, out, config.get("2x"), ["-z=2", ...args], provides);
    }
}

export class DefaultImageTask extends Task<void> {
    constructor(source: string, basenames: string[] | string, provides = "" + basenames) {
        if (typeof basenames == "string") basenames = [basenames] as string[];
        super(depend => {
            depend(
                ...(<string[]>basenames).map(basename => new Compile1xTask(source, basename + ".png")),
                ...(<string[]>basenames).map(basename => new Compile2xTask(source, basename + "@2x.png"))
            );
            return () => { };
        }, provides);
    }
}

export class CopyTask extends Task<void> {
    constructor(source: string, out: string, provides = out, dependOnSource = true) {
        super(depend => {
            depend(outputDirectory);
            if (dependOnSource) depend(Resource.get(source));

            return deps => new Promise(
                (res, rej) => fs.copyFile(source, path.join(deps.outputDirectory, out), err => {
                    if (err) rej(err);
                    res();
                })
            )
        }, provides);
    }
}

export class NoneImageTask extends CopyTask {
    constructor(out: string, provides = out) {
        super("src/graphics/special/none.png", out, provides, false);
    }
}

export class ResolutionDependentSourceImageTask extends Task<void> {
    constructor(source: (resolution: string) => string, basenames: string | string[], provides: string = "" + basenames) {
        super(async depend => {
            const resolution = await depended(config.get("resolution"), depend) as string;
            depend(new DefaultImageTask(source(resolution), basenames));
        }, provides);
    }
}*/
