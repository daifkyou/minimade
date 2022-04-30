import fs from "fs";
import child_process from "child_process";
import EventEmitter from "events";
import { Task } from "./tasks.js";
import Config from "./config.js";
import { Cache } from "./cache.js";
import Resource from "./resource.js";
import shit from "../shit.js";
import path from "path";



export type Constructor<T, Args extends unknown[] = unknown[]> = new (...args: Args) => T;



export async function Init(main: () => unknown, cachePath: string, configPath: string) {
    await Cache.load(cachePath);
    await Config.load(configPath);
    await main();
    await Cache.save(cachePath);
}



class OutputDirectory extends EventEmitter implements Task<string> {
    value?: string;

    constructor() {
        super({ captureRejections: true });

        Config.config.get("outputDirectory").on("update", async value => {
            await fs.promises.mkdir(value, { recursive: true });
            this.emit("update", this.value = value);
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

export class CompileTask extends EventEmitter implements Task<void> {
    args;

    constructor(public source: string, public out: string, args: string[]) {
        super({ captureRejections: true });

        this.args = args;

        Resource.get(source).on("update", this.update);
        outputDirectory.on("update", this.update);
    }

    update() {
        CompileImage(path.join(outputDirectory.value!, this.source), this.out, ...this.args);
        this.emit("update");
    }
}

export type CompileTaskConstructor = Constructor<CompileTask, [string, string, ...string[]]>;

export class Compile1xTask extends CompileTask implements CompileTask {
    constructor(source: string, out: string, args: string[] = []) {
        super(source, out, args);

        Config.config.get("1x").on("update", this.update);
    }

    update() {
        if (Config.config.get("1x").value) super.update();
    }
}

export class Compile2xTask extends CompileTask implements CompileTask {
    constructor(source: string, out: string, args: string[] = ["-z=2"]) {
        super(source, out, args);

        Config.config.get("2x").on("update", this.update);
    }

    update() {
        if (Config.config.get("2x").value) super.update();
    }
}

export function DefaultCompileImage(source: string, names: string[] | string) {
    if (typeof names === "string") names = [names];
    return names.map(name => [
        new Compile1xTask(source, name + ".png"),
        new Compile2xTask(source, name + "@2x.png")
    ]);
}

export function resolutionDependentSource(Base: CompileTaskConstructor) {
    return class extends Base {
        constructor(public sourceCallback: (resolution: string) => string, out: string, ...args: string[]) {
            super(shit("stuff ran out of order, maybe?"), out, ...args);

            Config.config.get("resolution").on("update", this.update);
        }

        update() {
            this.source = this.sourceCallback(Config.config.get("resolution").value);
            super.update();
        }
    };
}

export const ResolutionDependentSourceCompile1xTask = resolutionDependentSource(Compile1xTask);
export const ResolutionDependentSourceCompile2xTask = resolutionDependentSource(Compile2xTask);

export function ResolutionDependentSourceCompileTask(source: (resolution: string) => string, names: string[] | string) {
    if (typeof names === "string") names = [names];
    return names.map(name => [
        new ResolutionDependentSourceCompile1xTask(source, name + ".png"),
        new ResolutionDependentSourceCompile2xTask(source, name + "@2x.png")
    ]);
}

export class CopyTask extends EventEmitter implements Task<void> {
    constructor(public source: string, public out: string, public provides = out) {
        super({ captureRejections: true });

        outputDirectory.on("update", this.update);
        Resource.get(source).on("update", this.update);
    }

    async update() {
        fs.promises.copyFile(this.source, path.join(outputDirectory.value!, this.out));
    }
}

export class NoneImageTask extends CopyTask {
    constructor(out: string, provides = out) {
        super("src/graphics/special/none.png", out, provides);
    }
}

/*
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
}*/
