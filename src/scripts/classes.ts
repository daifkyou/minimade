import { DependCallback, Task, Cache, StaticTask } from "ktw";
import fs from "fs";
import child_process from "child_process";
import { parse } from 'jsonc-parser';
import type { ParseError } from "jsonc-parser";
import path from "path";

const compiler = "rsvg-convert";


let resolveDefaultCache: (value: Cache | PromiseLike<Cache>) => void;
Cache.default = new Promise<Cache>(res => { resolveDefaultCache = res });

export async function Load(cachePath: string) {
    let old;
    try {
        old = JSON.parse(await fs.promises.readFile(cachePath, "utf8"));
    } catch (e) {
        if ((e as any)?.code === 'ENOENT') {
            old = {};
        } else throw e;
    }

    resolveDefaultCache(new Cache(old));
}

export async function Save(cachePath: string) {
    await fs.promises.mkdir(path.dirname(cachePath), { recursive: true })
    await fs.promises.writeFile(cachePath, JSON.stringify((await Cache.default)!.current));
}

export async function Init(main: Task<unknown>, cachePath: string, configPath: string) {
    config.path = configPath;
    await main.run();
    await Save(cachePath);
}



export async function depended<T>(task: Task<T>, depend: DependCallback) {
    return (await depend(task))[0];
}



class ConfigOption extends Task<any> { // woah look at my insane cleverness
    protected tasks: { [key: string]: ConfigOption } = {};
    protected object?: { [key: string]: any };

    /**
     * Get the task to a configuration option
     */
    get(key: string) {
        if (this.tasks[key]) return this.tasks[key];
        else return this.tasks[key] = new ConfigOption(this, key, `${this.provides}_${key}`);
    }

    protected constructor(parent: Task<{ [key: string]: any }>, key: string, provides: string) {
        super(depend => {
            depend(parent);
            return deps => this.object = deps[parent.provides][key]
        }, provides);
    }
}

export class Config extends ConfigOption { // cleverness (cont.)
    path?: string;
    constructor() {
        super(new StaticTask(async () => {
            const errors: ParseError[] = [];
            const c = parse(await fs.promises.readFile(this.path!, "utf8"), errors);
            if (errors.length > 0) console.warn(errors);

            return { "": c };
        }, "configparent"), "", "config");
    }
}

export const config = new Config();

export const outputDirectory = new StaticTask(async deps => {
    await fs.promises.mkdir(deps.config_outputDirectory, { recursive: true });
    return deps.config_outputDirectory;
}, "outputDirectory", [config.get("outputDirectory")]);



export class Resources {
    protected static tasks: { [key: string]: Task<number> } = {};

    static get(resource: string) {
        return this.tasks[resource] ?? (this.tasks[resource] = new Task(() => async () => (await fs.promises.stat(resource)).ctimeMs, resource));
    }
}



export function Compile(options: child_process.SpawnOptions, out?: WritableStream, ...args: string[]) {
    return new Promise<void>((res, rej) => {
        const cp = child_process.spawn(compiler, args, options);

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
    console.log(`compiling ${source} to ${out} with args: ${args}`);
    return Compile({}, undefined, "-o", out, ...args, source);
}

export class ConditionalCompileTask extends Task<void> {
    constructor(source: string, out: string, condition: Task<boolean>, args: string[] = [], provides = out) {
        super(async depend => {
            if (await depended(condition, depend)) {
                await depend(Resources.get(source), outputDirectory);
                return deps => CompileImage(source, path.join(deps.outputDirectory, out), ...args);
            }
            return () => { };
        }, provides);
    }
}

export class CompileTask extends ConditionalCompileTask {
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
                ...(<string[]>basenames).map(basename => new CompileTask(source, basename + ".png")),
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
            if (dependOnSource) depend(Resources.get(source));

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
}
