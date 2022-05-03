import { DefaultCompile, NoneImageTask } from "../../classes.js";

export default [
    DefaultCompile("src/graphics/interface/hud/inputoverlay/key.svg", "inputoverlay-key"),
    new NoneImageTask("inputoverlay-background.png")
];
