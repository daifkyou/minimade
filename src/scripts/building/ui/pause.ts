import { TaskGroup } from "ktw";
import { DefaultCompileImage } from "../classes.js";

export default new TaskGroup("pause", [
    new DefaultCompileImage("src/graphics/interface/pause/focus.svg", "arrow-pause"),
    new DefaultCompileImage("src/graphics/interface/pause/back.svg", "pause-back"),
    new DefaultCompileImage("src/graphics/interface/pause/continue.svg", "pause-continue"),
    new DefaultCompileImage("src/graphics/interface/pause/replay.svg", "pause-replay"), // TODO: move to ranking when doing that
    new DefaultCompileImage("src/graphics/interface/pause/retry.svg", "pause-retry")
]);
