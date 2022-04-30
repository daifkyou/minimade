import { DefaultCompileImage, NoneImageTask } from "../classes.js";

export default [
    DefaultCompileImage("src/graphics/gameplay/spinner/approachcircle.svg", "spinner-approachcircle"),
    DefaultCompileImage("src/graphics/gameplay/spinner/circle.svg", "spinner-circle"),
    DefaultCompileImage("src/graphics/gameplay/spinner/metre.svg", "spinner-metre"), // the king's english
    DefaultCompileImage("src/graphics/interface/hud/rpm.svg", "spinner-rpm"),
    new NoneImageTask("spinner-background.png"),
    new NoneImageTask("spinner-spin.png"),
    new NoneImageTask("spinner-clear.png")
];
