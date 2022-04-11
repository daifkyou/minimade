import { TaskGroup } from "ktw";
import { DefaultImageTask, NoneImageTask } from "../classes.js";

export default new TaskGroup("slider", [
    new DefaultImageTask("src/graphics/gameplay/osu/slider/ball.svg", "sliderb"),
    new DefaultImageTask("src/graphics/gameplay/osu/slider/followcircle.svg", "sliderfollowcircle"),
    new DefaultImageTask("src/graphics/gameplay/osu/slider/point.svg", "sliderscorepoint"),
    new DefaultImageTask("src/graphics/gameplay/osu/slider/reverse.svg", "reversearrow"),
    new NoneImageTask("sliderendcircle.png")
]);
