import { TaskGroup } from "ktw";
import { DefaultImageTask, NoneImageTask } from "../classes.js";

export default new TaskGroup("spinner", [
    new DefaultImageTask("src/graphics/gameplay/spinner/approachcircle.svg", "spinner-approachcircle"),
    new DefaultImageTask("src/graphics/gameplay/spinner/circle.svg", "spinner-circle"),
    new DefaultImageTask("src/graphics/gameplay/spinner/metre.svg", "spinner-metre"), // the king's english
    new DefaultImageTask("src/graphics/interface/hud/rpm.svg", "spinner-rpm"),
    new NoneImageTask("spinner-background.png"),
    new NoneImageTask("spinner-spin.png"),
    new NoneImageTask("spinner-clear.png")
]);
