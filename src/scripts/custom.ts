import { DependCallback, Task, Cache } from "ktw";
import { Path } from "ktw/lib/path";
import * as fs from "fs";
import * as child_process from "child_process";
import stripJsonComments from 'strip-json-comments';
import * as path from "path";

const compiler = "rsvg-convert";

class ConfigError extends Error {
    constructor(message: any) {
        super(message);
    }
}



class ConfigOption extends Task<any> { // woah look at my insane cleverness
    protected tasks: { [key: string]: ConfigOption } = {};
    protected object;

    /**
     * Get the task to a configuration option
     */
    get(key: string) {
        if (this.tasks[key]) return this.tasks[key];
        else if (this.object[key]) return this.tasks[key] = new ConfigOption(this.object[key], `${this.provides}_${key}`);
        else throw new ConfigError(`configuration file did not contain ${this.provides}_${key}`);
    }

    async depended(key: string, depend: DependCallback) {
        return (await depend(this.get(key)))[0];
    }

    protected constructor(object: { [key: string]: any }, provides: string) {
        super(() => () => object, provides);

        this.object = object;
    }
}

export class Config extends ConfigOption {
    protected static Config: ConfigOption;

    static async load(configPath = "./config.jsonc") {
        const object = JSON.parse(stripJsonComments(await fs.promises.readFile(configPath, "utf8")));

        this.Config = new ConfigOption(object, "config");
    }

    static get(key: string): any {
        return this.Config.get(key);
    }

    static depended(key: string, depend: DependCallback): any {
        return this.Config.depended(key, depend);
    }
}



export class Resources {
    protected static tasks: { [key: string]: Path } = {};

    static get(resource: string) {
        return this.tasks[resource] ?? (this.tasks[resource] = new Path(resource));
    }
}

export class InternalConfig {
    static OutDir = Task.static(async deps => {
        await fs.promises.mkdir(deps.config_outDir, { recursive: true });
        return deps.config_outDir;
    }, "outDir", () => Config.get("outDir"));

    static Compile1x = Task.static(
        deps => deps.config_definition == "1x" || deps.config_definition.toLowerCase() == "both" || deps.config_definition.toLowerCase() == "sd",
        "Compile1x",
        () => Config.get("definition")
    );

    static Compile2x = Task.static(
        deps => deps.config_definition == "2x" || deps.config_definition.toLowerCase() == "both" || deps.config_definition.toLowerCase() == "hd",
        "Compile2x",
        () => Config.get("definition")
    );
}



export function Compile(options: child_process.SpawnOptions, ...args: string[]) {
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
    return Compile({}, "-o", out, ...args, source);
}

export class ConditionalCompileTask extends Task<void> {
    constructor(source: string, out: string, condition: Task<any>, args: string[] = [], provides = out) {
        super(async depend => {
            if (await depend(condition)) {
                depend(Resources.get(source), InternalConfig.OutDir)
                ;
                return deps => CompileImage(source, path.join(deps.outDir, out), ...args);
            }
            return () => { };
        }, provides);
    }
}

export class CompileTask extends ConditionalCompileTask {
    constructor(source: string, out: string, args: string[] = [], provides = out) {
        super(source, out, InternalConfig.Compile1x, args, provides);
    }
}

export class Compile2xTask extends ConditionalCompileTask {
    constructor(source: string, out: string, args: string[] = [], provides = out) {
        super(source, out, InternalConfig.Compile2x, ["-z=2", ...args], provides);
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

export class FontTask extends Task<void> {
    constructor(name: string, glyph: string, size: number, provides = `fonts-${name}-${glyph}`) {
        const source = `src/graphics/fonts/${name}/${glyph}.svg`;

        super(depend => {
            depend(
                new ConditionalCompileTask(source, `${name}-${glyph}.png`, InternalConfig.Compile1x, [`-z=${size}`]),
                new ConditionalCompileTask(source, `${name}-${glyph}@2x.png`, InternalConfig.Compile2x, [`-z=${size * 2}`])
            );
        }, provides);
    }
}

export class CopyTask extends Task<void> {
    constructor(source: string, out: string, provides = out, dependOnSource = true) {
        super(depend => {
            depend(InternalConfig.OutDir);
            if (dependOnSource) depend(Resources.get(source));

            return deps => new Promise(
                (res, rej) => fs.copyFile(source, path.join(deps.outDir, out), err => {
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



export async function Init(main: Task<void>, cache: string, config?: string) {
    await Cache.Load(cache);
    await Config.load(config);
    await main.run();
    await Cache.Save();
}