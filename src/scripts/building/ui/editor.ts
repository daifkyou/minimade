import { TaskGroup } from "ktw";
import { DefaultCompileImage } from "../classes.js";

export default new TaskGroup("editor", [
    new DefaultCompileImage("src/graphics/interface/editor/select.svg", "hitcircleselect")
]);
