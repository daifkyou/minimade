import fs from "fs";
import path from "path";
import EventEmitter from "events";
import { Task } from "./task.js";

export interface CacheEvents {
    "load": () => void,
    "save": () => void
}

export interface CacheEventEmitter {
    on<E extends keyof CacheEvents>(
        event: E, listener: CacheEvents[E]
    ): this;

    emit<E extends keyof CacheEvents>(
        event: E, ...args: Parameters<CacheEvents[E]>
    ): boolean;
}

export class Cache {
    static events: CacheEventEmitter = new EventEmitter();

    static old: { [provides: string]: unknown };
    static new: { [provides: string]: unknown };

    static loaded = false;

    static async load(cachePath: string) {
        let old;
        try {
            old = JSON.parse(await fs.promises.readFile(cachePath, "utf8"));
        } catch (e) {
            if ((e as any)?.code === "ENOENT") {
                old = {};
            } else throw e;
        }

        this.new = structuredClone(this.old = old);

        this.events.emit("load");

        this.loaded = true;
    }

    static async save(cachePath: string) {
        await fs.promises.mkdir(path.dirname(cachePath), { recursive: true });
        await fs.promises.writeFile(cachePath, JSON.stringify(await this.new));

        this.events.emit("save");
    }
}

export class CachedTask<T> extends EventEmitter implements Task<T> {
    value?: T;
    oldValue?: T;
    updated = false;

    constructor(public key: string) {
        super({ captureRejections: true });

        if (Cache.loaded) this.load();
        else Cache.events.on("load", this.load);

        this.prependListener("update", value => {
            this.value = value;
            this.updated = true;

            this.on("newListener", (event: string, listener: (...args: unknown[]) => unknown) => { // automatically "emit" update event to listeners added after the cache was updated
                if (event === "update") listener(this.value);
            });
        });
    }

    load() {
        this.oldValue = Cache.old[this.key] as T;
        if (this.value === undefined) this.value = this.oldValue;
        // this.emit("load");
    }
}
