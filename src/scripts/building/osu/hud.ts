import { TaskGroup } from "ktw";
import { DefaultImageTask } from "../classes.js";
import scorebar from "../ui/hud/scorebar.js"
import keys from "../ui/hud/keys.js";

export default new TaskGroup("hud", [
    scorebar,
    keys,
    new DefaultImageTask("src/graphics/interface/hud/skip.svg", "play-skip"),
    new DefaultImageTask("src/graphics/interface/hud/unranked.svg", "play-unranked"),
    new DefaultImageTask("src/graphics/interface/hud/warning.svg", "arrow-warning"),
    new DefaultImageTask("src/graphics/interface/hud/fail.svg", "section-fail"),
    new DefaultImageTask("src/graphics/interface/hud/pass.svg", "section-pass")
]);
