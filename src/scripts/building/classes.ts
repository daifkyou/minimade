import fs from "fs";
import child_process from "child_process";
import EventEmitter from "events";
import { Updateable, Task } from "./tasks.js";
import Config from "./config.js";
import { Cache } from "./cache.js";
import Resource from "./resource.js";
import shit from "../shit.js";
import path from "path";



type Constructor<T = any> = new (...args: any[]) => T;



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

export function Compile(options: child_process.SpawnOptions, out?: NodeJS.WritableStream, args: string[] = []) {
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

export function CompileImage(source: string, out: string, args: string[] = []) {
    return Compile({}, undefined, ["-o", out, ...args, source]);
}

export class CompileTask extends EventEmitter implements Task<void>, Updateable {
    args;

    constructor(public source: string, public out: string, args?: string[]) {
        super({ captureRejections: true });

        this.args = args;

        Resource.get(source).on("update", this.update);
        outputDirectory.on("update", this.update);
    }

    update() {
        CompileImage(path.join(outputDirectory.value!, this.source), this.out, this.args);
        this.emit("update");
    }
}

export function Dependent<T extends Constructor<Updateable>>(Base: T, task: Task<unknown>) {
    return class Dependent extends Base {
        constructor(...args: any[]) {
            super(...args);

            task.on("update", this.update);
        }
    };
}

export function Conditional<T extends Constructor<Updateable>>(Base: T, predicate: Task<boolean>) {
    return class Conditional extends Dependent(Base, predicate) {
        update() {
            if (predicate.value) super.update();
        }
    };
}

export const Compile1xTask = Conditional(CompileTask, Config.config.get("1x"));
export const Compile2xTask = Conditional(CompileTask, Config.config.get("2x"));

export function DefaultCompile(source: string, names: string[] | string) {
    if (typeof names === "string") names = [names];
    return names.map(name => [
        new Compile1xTask(source, name + ".png"),
        new Compile2xTask(source, name + "@2x.png")
    ]);
}

export function ResolutionDependentSource(Base: Constructor<CompileTask>) {
    return class ResolutionDependentSource extends Dependent(Base, Config.config.get("resolution")) {
        constructor(public sourceCallback: (resolution: string) => string, out: string, ...args: string[]) {
            super(shit("stuff ran out of order, maybe?"), out, args);
        }

        update() {
            this.source = this.sourceCallback(Config.config.get("resolution").value);
            super.update();
        }
    };
}

export const ResolutionDependentSourceCompile1xTask = ResolutionDependentSource(Compile1xTask);
export const ResolutionDependentSourceCompile2xTask = ResolutionDependentSource(Compile2xTask);

export function ResolutionDependentSourceCompile(source: (resolution: string) => string, names: string[] | string) {
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
