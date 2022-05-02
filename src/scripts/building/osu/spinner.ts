import { DefaultCompile, NoneImageTask } from "../classes.js";

export default [
    DefaultCompile("src/graphics/gameplay/spinner/approachcircle.svg", "spinner-approachcircle"),
    DefaultCompile("src/graphics/gameplay/spinner/circle.svg", "spinner-circle"),
    DefaultCompile("src/graphics/gameplay/spinner/metre.svg", "spinner-metre"), // the king's english
    DefaultCompile("src/graphics/interface/hud/rpm.svg", "spinner-rpm"),
    new NoneImageTask("spinner-background.png"),
    new NoneImageTask("spinner-spin.png"),
    new NoneImageTask("spinner-clear.png")
];
