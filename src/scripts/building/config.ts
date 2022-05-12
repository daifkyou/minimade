import fs from "fs";
import { parse, ParseError } from "jsonc-parser";
import type { Task } from "./task.js";
import { CachedTask } from "./cache.js";

export class ConfigBase extends CachedTask<any> { // woah look at my insane cleverness (or possible lack thereof)
    protected keys: { [key: string]: ConfigBase } = {};

    get(key: string) {
        return this.keys[key] ?? new ConfigProperty(this, key, this.key);
    }
}

export class ConfigRoot extends ConfigBase {
    protected async update(_type: string, value: string) {
        const errors: ParseError[] = [];
        const c = parse(value, errors);
        if (errors.length > 0) console.warn(errors);

        this.emit("update", c);
    }

    constructor(path: Promise<string>) {
        super("configRoot");

        path.then(path => {
            fs.promises.readFile(path, "utf8").then(value => this.update("", value)); // possible rare race condition?
            fs.watch(path, "utf8").on("change", this.update);
        });
    }
}

class ConfigProperty extends ConfigBase {
    constructor(parent: Task<any>, parentKey: string, key: string) {
        super(key + "_" + parentKey);

        parent.on("update", parentValue => {
            this.emit("update", parentValue[parentKey]);
        });
    }
}

export default class Config {
    private static pathResolve: (path: string) => void;

    static config = new ConfigRoot(new Promise(res => {
        this.pathResolve = res;
    }));

    static load(path: string) {
        this.pathResolve(path);
    }
}
