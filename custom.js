const ktw = require('ktw');
const ktwPath = require('ktw/path');
const fs = require('fs');
const child_process = require('child_process');
const path = require('path');



class ConfigError extends Error {
    /**
     * @param {string} message the message woah
     */
    constructor(message) {
        super(message);
    }
}

class Config { // woah look at my insane cleverness
    static #configTasks = {};
    static #config = null;
    static Load(path = "./config.json") {
        this.#config = JSON.parse(fs.readFileSync(path, "utf8"));
    }

    /**
     * Get a configuration option
     * @param {string} key 
     * @returns {ktw.Task}
     */
    static get(key) {
        if (this.#configTasks[key]) return this.#configTasks[key]
        else if (this.#config[key]) return this.#configTasks[key] = new ktw.Task(() => () => this.#config[key], `config_${key}`);
        else throw new ConfigError(`configuration file did not contain ${key}`);
    }
}

/**
 * @type {ktw.Task<("1x"|"2x"|"sd"|"hd"|"both")>}
 */

class Resources {
    static #tasks = {};

    /**
     * Get a file task
     * @param {fs.PathLike} path
     */
    static get(path) {
        return this.#tasks[path] ?? (this.#tasks[path] = new ktwPath(path));
    }
}



/**
 * Render a graphic (an SVG) using rsvg
 */
class CompileTask extends ktw.Task {
    /**
     * @type {string}
     */
    static compiler = "rsvg-convert";
    /**
     * @callback compileTaskPayload
     * @param dependencies
     * @param {child_process.ChildProcess} childProcess
     */

    /**
     * @callback compileTaskSetArgs a callback to set arguments
     * @param {string[]} args
     */

    /**
     * @callback compileTD
     * @param {ktw.depend} depend
     * @param {compileTaskSetArgs} setArgs
     * @param {string} compiler
     * @returns {compileTaskPayload | Promise<compileTaskPayload>} The payload of the compile task
     */

    /**
     * @param {compileTD} td The task definition
     * @param {string} provides 
     * @param {child_process.SpawnOptions} options
     */
    constructor(td, provides, options = {}) {
        super(async depend => {
            let args = [];
            const payload = await td(depend, newArgs => args = newArgs, CompileTask.compiler);
            return dependencies => new Promise((res, rej) => {
                const cp = child_process.spawn(CompileTask.compiler, args, options);
                const r = (async () => await payload(dependencies, cp))();
                let errorOutput = "";
                cp.on("error", err => {
                    rej(err);
                });
                cp.stderr.on("data", chunk => errorOutput += chunk);
                cp.once("close", async (code, signal) => {
                    if (code) rej(`compile task ${provides} exited with exit code ${code}:\n${errorOutput}`);
                    else if (signal) rej(`compile task ${provides} exited due to signal ${signal}:\n${errorOutput}`);
                    else res(await r);
                });
            });
        }, provides);
    }
}

class RenderTaskBase extends CompileTask {
    /**
     * 
     * @param {string} source The path to the source svg
     * @param {string} out The path to the output
     * @param {string} provides
     * @param {string[]} args Command-line arguments
     */
    constructor(source, out, provides, args = []) {
        super(async (depend, setArgs) => {
            await depend(Resources.get(source));
            setArgs(["-o", out, ...args, source]);
            return (_dependencies, cp) => new Promise(res => {
                cp.once("close", () => { res(ktw.Cache.get(source)) });
            });
        }, provides);
    }
}

/**
 * Render in SD
 */
class RenderTask1x extends RenderTaskBase {
    /**
     * @param {string} source
     * @param {string} outDir The output directory
     * @param {string} basename The base name of the file
     * @param {string} provides 
     */
    constructor(source, outDir, basename, provides = basename) {
        super(source, path.join(outDir, basename + ".png"), provides);
    }
}

/**
 * Render in HD
 */
class RenderTask2x extends RenderTaskBase {
    /**
     * @param {string} source
     * @param {string} outDir The output directory
     * @param {string} basename The base name of the file
     * @param {string} provides 
     */
    constructor(source, outDir, basename, provides = basename) {
        super(source, path.join(outDir, basename + "@2x.png"), provides, ["-z", "2"]);
    }
}

/**
 * Render a normal file with 1x and 2x options
 */
class RenderGraphicTask extends ktw.Task {
    /**
     * 
     * @param {string} source The source file for the graphic (path to an svg)
     * @param {string} basename The base name of the file
     * @param {string} outDir The path of the output directory
     * @param {string} provides The key of the task for 1x
     * @param {string} provides2x The key of the task for 2x
     */
    constructor(source, outDir, basename, provides = basename, provides2x = provides + "@2x") {
        super(async depend => {
            const resolution = (await depend(Config.get("resolution")))[0];
            let signature = "";

            if (resolution == "1x" || resolution == "SD" || resolution == "both") signature += "@1x" + (await depend(new RenderTask1x(source, outDir, basename, provides)))[0];
            if (resolution == "2x" || resolution == "HD" || resolution == "both") signature += "@2x" + (await depend(new RenderTask2x(source, outDir, basename, provides)))[0];

            return dependencies => signature;
        }, provides);
    }
}



module.exports = {
    Config: Config,
    ConfigError: ConfigError,
    Resources: Resources,
    CompileTask: CompileTask,
    RenderTaskBase: RenderTaskBase,
    RenderTask1x: RenderTask1x,
    RenderTask2x: RenderTask2x,
    RenderGraphicTask: RenderGraphicTask
};