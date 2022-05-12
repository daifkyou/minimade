import { DefaultCompile } from "../classes.js";

export default ["autoplay", "cinema", "doubletime", "easy", "flashlight", "halftime", "hardrock", "hidden", "nightcore", "nightmare", "nofail", "perfect", "relax", "relax2", "scorev2", "spunout", "suddendeath", "target", "touchdevice"]
    .map(mod => DefaultCompile(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`));
