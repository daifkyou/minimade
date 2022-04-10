import { TaskGroup } from "ktw";
import { DefaultImageTask, NoneImageTask } from "../classes.js";

export default new TaskGroup("slider", [
    new DefaultImageTask("src/graphics/gameplay/osu/sliderb.svg", "sliderb"),
    new DefaultImageTask("src/graphics/gameplay/osu/sliderfollowcircle.svg", "sliderfollowcircle"),
    new DefaultImageTask("src/graphics/gameplay/osu/sliderscorepoint.svg", "sliderscorepoint"),
    new DefaultImageTask("src/graphics/gameplay/osu/reversearrow.svg", "reversearrow"),
    new NoneImageTask("sliderendcircle.png"),
    new DefaultImageTask("src/graphics/gameplay/osu/followpoint.svg", "followpoint")
]);
