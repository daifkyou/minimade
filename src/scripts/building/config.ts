import fs from "fs";
import { parse, ParseError } from "jsonc-parser";
import type { Task } from "./task.js";
import { CachedTask } from "./cache.js";

export default class Config extends CachedTask<any> { // woah look at my insane cleverness (or possible lack thereof)
    static config: Config;

    static load(path: string) {
        this.config = new ConfigRoot(path);
    }

    protected keys: { [key: string]: Config } = {};

    get(key: string) {
        return this.keys[key] ?? new ConfigProperty(this, key, this.key);
    }
}

export class ConfigRoot extends Config {
    protected async update(_type: string, value: string) {
        const errors: ParseError[] = [];
        const c = parse(value, errors);
        if (errors.length > 0) console.warn(errors);

        this.emit("update", c);
    }

    constructor(path: string) {
        super("configRoot");

        fs.promises.readFile(path, "utf8").then(value => this.update("", value)); // possible rare race condition?
        fs.watch(path, "utf8").on("change", this.update);
    }
}

class ConfigProperty extends Config {
    constructor(parent: Task<any>, parentKey: string, key: string) {
        super(key + "_" + parentKey);

        parent.on("update", parentValue => {
            this.emit("update", parentValue[parentKey]);
        });
    }
}
