import { DefaultCompileImage, NoneImageTask } from "../classes.js";

export default [
    DefaultCompileImage("src/graphics/interface/cursor/cursor.svg", "cursor"),
    new NoneImageTask("cursortrail.png"),
    new NoneImageTask("star2.png")
];
