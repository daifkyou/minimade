import { Task } from "ktw";
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
     * Get a configuration option
     */
    get(key: string) {
        if (this.tasks[key]) return this.tasks[key];
        else if (this.object[key]) return this.tasks[key] = new ConfigOption(this.object[key], `${this.provides}_${key}`);
        else throw new ConfigError(`configuration file did not contain ${this.provides}_${key}`);
    }

    protected constructor(object: { [key: string]: any }, provides: string) {
        super(() => () => object, provides);

        this.object = object;
    }
}

export class Config extends ConfigOption {
    protected static Config: ConfigOption;

    static Load(configPath = "./config.jsonc") {
        const object = JSON.parse(stripJsonComments(fs.readFileSync(configPath, "utf8")));
        if (!fs.existsSync(object.outDir)) fs.mkdirSync(object.outDir);

        this.Config = new ConfigOption(object, "config");
    }

    static get(key: string): any {
        return this.Config.get(key);
    }
}



export class Resources {
    protected static tasks: { [key: string]: Path } = {};

    static get(resource: string) {
        return this.tasks[resource] ?? (this.tasks[resource] = new Path(resource));
    }
}

export class InternalConfig {
    static Compile1x = new Task(depend => {
        depend(Config.get("definition"));
        return deps => deps.config_definition == "1x" || deps.config_definition.toLowerCase() == "both" || deps.config_definition.toLowerCase() == "sd";
    }, "Compile1x");

    static Compile2x = new Task(depend => {
        depend(Config.get("definition"));
        return deps => deps.config_definition == "2x" || deps.config_definition.toLowerCase() == "both" || deps.config_definition.toLowerCase() == "hd";
    }, "Compile1x");
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
                depend(Resources.get(source));
                depend(Config.get("outDir"))
                return deps => CompileImage(source, path.join(deps.config_outDir, out), ...args);
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
    constructor(source: string, basenames: string[] | string, provides = ""+basenames) {
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
            depend(new ConditionalCompileTask(source, `${name}-${glyph}.png`, InternalConfig.Compile1x, [`-z=${size}`]), new ConditionalCompileTask(source, `${name}-${glyph}@2x.png`, InternalConfig.Compile2x, [`-z=${size * 2}`]));

            return () => { };
        }, provides);
    }
}

export class CopyTask extends Task<void> {
    constructor(source: string, out: string, provides = out, dependOnSource = true) {
        super(depend => {
            depend(Config.get("outDir"));
            if (dependOnSource) depend(Resources.get(source));

            return deps => new Promise(
                (res, rej) => fs.copyFile(source, path.join(deps.config_outDir, out), err => {
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
