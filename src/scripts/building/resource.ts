import fs from "fs";
import { CachedTask } from "./cache.js";

export default class Resource extends CachedTask<number> {
    protected static tasks: { [path: string]: Resource; } = {};

    static get(path: string) {
        return this.tasks[path] ?? (this.tasks[path] = new Resource(path));
    }

    protected constructor(public readonly path: string) {
        super(path);

        fs.watch(path).on("change", () => {
            this.emit("update", Date.now());
        });
    }
}
