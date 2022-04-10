import { TaskGroup } from "ktw";
import { DefaultImageTask } from "../classes.js";

export default new TaskGroup("button", [
    new DefaultImageTask("src/graphics/interface/button/left.svg", "button-left"),
    new DefaultImageTask("src/graphics/interface/button/middle.svg", "button-middle"),
    new DefaultImageTask("src/graphics/interface/button/right.svg", "button-right"),
]);
