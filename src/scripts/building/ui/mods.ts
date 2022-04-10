import { Task } from "ktw";
import { DefaultImageTask, config, depended } from "../classes.js";

export default new Task<void>(async (depend) => {
    const mods = await depended(config.get("mods"), depend) as string[];
    depend(...mods.map(mod => new DefaultImageTask(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`, `mods-${mod}`)));
}, "mods");
