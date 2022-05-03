import EventEmitter from "events";
import { Compile1xTask, Compile2xTask, CompileTask } from "../classes.js";
import Config from "../config.js";

export function Mod(Base: typeof CompileTask) {
    return class Mod extends Base {
        constructor(public mod: string) {
            super(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`);
        }
        update() {
            if ((Config.config.get("mods").value as string[]).includes(this.mod)) super.update();
        }
    };
}

export class CompileMod1xTask extends Mod(Compile1xTask) { }
export class CompileMod2xTask extends Mod(Compile2xTask) { }

export function CompileMod(mod: string): [CompileMod1xTask, CompileMod2xTask] {
    return [
        new CompileMod1xTask(mod),
        new CompileMod2xTask(mod)
    ];
}

const tasks: { [mod: string]: [CompileMod1xTask, CompileMod2xTask] } = {};

Config.config.get("mods").on("update", (mods: string[]) => {
    mods.forEach(mod => {
        if (!tasks[mod]) tasks[mod] = CompileMod(mod);
    });
});

export default tasks;
