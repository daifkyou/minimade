import { DefaultCompile } from "../classes.js";
import scorebar from "../ui/hud/scorebar.js";
import keys from "../ui/hud/keys.js";

export default [
    scorebar,
    keys,
    DefaultCompile("src/graphics/interface/hud/skip.svg", "play-skip"),
    DefaultCompile("src/graphics/interface/hud/unranked.svg", "play-unranked"),
    DefaultCompile("src/graphics/interface/hud/warning.svg", "arrow-warning"),
    DefaultCompile("src/graphics/interface/hud/fail.svg", "section-fail"),
    DefaultCompile("src/graphics/interface/hud/pass.svg", "section-pass")
];
