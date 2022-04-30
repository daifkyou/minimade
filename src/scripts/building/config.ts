import fs from "fs";
import EventEmitter from "events";
import { parse, ParseError } from "jsonc-parser";
import Task from "./tasks.js";

export default class Config extends EventEmitter implements Task<any> { // woah look at my insane cleverness (or possible lack thereof)
    static Config: Config;
    
    static Load(path: string) {
        this.Config = new ConfigRoot(path);
    }

    protected keys: { [key: string]: Config } = {};

    get(key: string) {
        return this.keys[key] ?? new ConfigProperty(this, key);
    }

    constructor() {
        super({ captureRejections: true });
    }
}

class ConfigRoot extends Config {
    value: any;

    protected async update(_type: string, value: string) {
        const errors: ParseError[] = [];
        const c = parse(value, errors);
        if (errors.length > 0) console.warn(errors);

        this.emit("update", this.value = c);
    }

    constructor(path: string) {
        super();

        fs.promises.readFile(path, "utf8").then(value => this.update("", value)); // possible rare race condition?
        fs.watch(path, "utf8").on("change", this.update);
    }
}

class ConfigProperty extends Config {

    value: any;

    constructor(parent: Task<any>, key: string) {
        super();

        this.value = parent.value[key];

        parent.on("update", parentValue => {
            this.emit("update", this.value = parentValue[key]);
        });
    }
}
