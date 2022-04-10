import { TaskGroup } from "ktw";
import { DefaultImageTask } from "../classes.js";

export default new TaskGroup("pause", [
    new DefaultImageTask("src/graphics/interface/pause/focus.svg", "arrow-pause"),
    new DefaultImageTask("src/graphics/interface/pause/back.svg", "pause-back"),
    new DefaultImageTask("src/graphics/interface/pause/continue.svg", "pause-continue"),
    new DefaultImageTask("src/graphics/interface/pause/replay.svg", "pause-replay"), // TODO: move to ranking when doing that
    new DefaultImageTask("src/graphics/interface/pause/retry.svg", "pause-retry")
]);
