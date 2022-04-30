import EventEmitter from "events";
import { DefaultCompileImage } from "../classes.js";
import Config from "../config.js";
import { Task } from "../tasks.js";

/*export default new Task<void>(async (depend) => {
    const mods = await depended(config.get("mods"), depend) as string[];
    depend(...mods.map(mod => new DefaultCompileImage(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`, `mods-${mod}`)));
}, "mods");*/

const tasks {[mod: string]: []} = {}

const mods = new EventEmitter({ captureRejections: true });
Config.config.get("mods").on("update", value => {
    
})

export default mods;

