import fs from "fs";
import { SpawnOptions, spawn } from "child_process";
import EventEmitter from "events";
import { Updateable, Task } from "./task.js";
import Config from "./config.js";
import Resource from "./resource.js";
import shit from "../shit.js";
import path from "path";

type Constructor<T = any> = new (...args: any[]) => T;
type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

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

export function Compile(options: SpawnOptions, out?: NodeJS.WritableStream, args: string[] = []) { // TODO: make cleaner
    return new Promise<void>((res, rej) => {
        const cp = spawn(compiler, args, options);

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

export function Dependent<T extends Constructor<Updateable> | AbstractConstructor<Updateable>>(Base: T, task: Task<unknown>) {
    abstract class Dependent extends Base implements Updateable {
        constructor(...args: any[]) {
            super(...args);

            task.on("update", this.update);
        }

        abstract update(): void;
    }

    return Dependent;
}

export function Conditional<T extends Constructor<Updateable> | AbstractConstructor<Updateable>>(Base: T, predicate: Task<boolean>) {
    abstract class Conditional extends Dependent(Base, predicate) {
        update() {
            if (predicate.value) super.update();
        }
    }

    return Conditional;
}



export abstract class CompileTaskBase extends EventEmitter implements Task<void>, Updateable { // best naming
    abstract args: string[];
    abstract source: string;
    abstract out: string;

    constructor() {
        super({ captureRejections: true });

        outputDirectory.on("update", this.update);
    }

    update() {
        //console.log(outputDirectory.value, this);
        CompileImage(path.join(outputDirectory.value!, this.source), this.out, this.args);
        this.emit("update");
    }
}

export class CompileTask extends CompileTaskBase {
    constructor(public source: string, public out: string, public args: string[] = []) {
        super();

        Resource.get(source).on("update", this.update);
    }
}

export class Compile1xTask extends Conditional(CompileTask, Config.config.get("1x")) { }
export class Compile2xTask extends Conditional(CompileTask, Config.config.get("2x")) {
    constructor(public source: string, public out: string, args = ["-z=2"]) {
        super(source, out, args);
    }
}

export function DefaultCompile(source: string, names: string[] | string) {
    if (typeof names === "string") names = [names];
    return names.map(name => [
        new Compile1xTask(source, name + ".png"),
        new Compile2xTask(source, name + "@2x.png")
    ]);
}

export function ResolutionDependentSource<T extends CompileTaskBase>(Base: Constructor<T> | AbstractConstructor<T>) {
    return class ResolutionDependentSource extends Base {
        source = shit("stuff ran out of order");
        constructor(public sourceCallback: (resolution: string) => string, public out: string, public args: string[] = []) {
            super();

            Config.config.get("resolution").on("update", this.updateResolution);
        }

        updateResolution(resolution: string) {
            Resource.get(this.source).removeListener("update", this.update);

            Resource.get(this.source = this.sourceCallback(resolution)).on("update", this.update);

            this.update();
        }

        update() {
            super.update();
        }
    };
}

export class ResolutionDependentSourceCompile1xTask extends ResolutionDependentSource(Conditional(CompileTaskBase, Config.config.get("1x"))) { }
export class ResolutionDependentSourceCompile2xTask extends ResolutionDependentSource(Conditional(CompileTaskBase, Config.config.get("2x"))) {
    constructor(sourceCallback: (resolution: string) => string, public out: string, args = ["-z=2"]) {
        super(sourceCallback, out, args);
    }
}

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
