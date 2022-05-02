import EventEmitter from "events";
import { Compile1xTask, Compile2xTask, DefaultCompileImage } from "../classes.js";
import Config from "../config.js";
import { Task } from "../tasks.js";

/*export default new Task<void>(async (depend) => {
    const mods = await depended(config.get("mods"), depend) as string[];
    depend(...mods.map(mod => new DefaultCompileImage(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`, `mods-${mod}`)));
}, "mods");*/

const tasks: { [mod: string]: [Compile1xTask, Compile2xTask] } = {};

const mods = new EventEmitter({ captureRejections: true });
Config.config.get("mods").on("update", (mods: string[]) => {
    /*mods.forEach(mod => {
        if (mod in tasks) return;
        tasks.push()
    })*/
    for (const mod in tasks) {
        let modIndex;
        if ((modIndex = mods.indexOf(mod)) !== -1) {
            mods.splice(modIndex, 1);
            
        } else {

        }
    }
})

export default mods;

