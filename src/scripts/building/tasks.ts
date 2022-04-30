import type EventEmitter from "events";

export interface TaskEvents<T> {
    "update": (value: T) => void;
}

export default interface Task<T> extends EventEmitter {
    value?: T;

    on<E extends keyof TaskEvents<T>>(
        event: E, listener: TaskEvents<T>[E]
    ): this;

    emit<E extends keyof TaskEvents<T>>(
        event: E, ...args: Parameters<TaskEvents<T>[E]>
    ): boolean;
}
