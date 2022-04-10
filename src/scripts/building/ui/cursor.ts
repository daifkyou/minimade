import { TaskGroup } from "ktw";
import { DefaultImageTask, NoneImageTask } from "../classes.js";

export default new TaskGroup("cursor", [
    new DefaultImageTask("src/graphics/interface/cursor/cursor.svg", "cursor"),
    new NoneImageTask("cursortrail.png"),
    new NoneImageTask("star2.png")
]);
