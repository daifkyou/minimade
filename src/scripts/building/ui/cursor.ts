import { DefaultCompile, NoneImageTask } from "../classes.js";

export default [
    DefaultCompile("src/graphics/interface/cursor/cursor.svg", "cursor"),
    new NoneImageTask("cursortrail.png"),
    new NoneImageTask("star2.png")
];
