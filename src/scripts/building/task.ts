import type EventEmitter from "events";

export interface TaskEvents<T> { // maybe inspired by https://stackoverflow.com/a/61609010
    "update": (value?: T) => void;
}

export interface Task<T> extends EventEmitter {
    value?: T;

    on<E extends keyof TaskEvents<T>>(
        event: E, listener: TaskEvents<T>[E]
    ): this;

    emit<E extends keyof TaskEvents<T>>(
        event: E, ...args: Parameters<TaskEvents<T>[E]>
    ): boolean;
}

export interface Updateable { // extreme naming skills
    update(): void
}

export interface Waitable extends Updateable {
    promise: Promise<void>;
}
