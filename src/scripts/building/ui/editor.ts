import { TaskGroup } from "ktw";
import { DefaultImageTask } from "../classes.js";

export default new TaskGroup("editor", [
    new DefaultImageTask("src/graphics/interface/editor/select.svg", "hitcircleselect")
]);
