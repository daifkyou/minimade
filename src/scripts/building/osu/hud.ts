import { DefaultCompileImage } from "../classes.js";
import scorebar from "../ui/hud/scorebar.js";
import keys from "../ui/hud/keys.js";

export default [
    scorebar,
    keys,
    DefaultCompileImage("src/graphics/interface/hud/skip.svg", "play-skip"),
    DefaultCompileImage("src/graphics/interface/hud/unranked.svg", "play-unranked"),
    DefaultCompileImage("src/graphics/interface/hud/warning.svg", "arrow-warning"),
    DefaultCompileImage("src/graphics/interface/hud/fail.svg", "section-fail"),
    DefaultCompileImage("src/graphics/interface/hud/pass.svg", "section-pass")
];
