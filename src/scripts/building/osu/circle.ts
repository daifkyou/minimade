import { TaskGroup } from "ktw";
import { DefaultImageTask } from "../classes.js";

export default new TaskGroup("circle", [
    new DefaultImageTask("src/graphics/gameplay/osu/approachcircle.svg", "approachcircle"),
    new DefaultImageTask("src/graphics/gameplay/osu/circle.svg", "hitcircle"),
    new DefaultImageTask("src/graphics/gameplay/osu/overlay.svg", "hitcircleoverlay")
]);
