import { TaskGroup } from "ktw";
import { NoneImageTask, DefaultImageTask } from "../classes.js";

export const hit300 = new TaskGroup("hit300", [
    new NoneImageTask("hit300.png"),
    new NoneImageTask("hit300k.png"),
    new NoneImageTask("hit300g.png")
]);

export const hit100 = new TaskGroup("hit100", [
    new DefaultImageTask("src/graphics/gameplay/osu/hitbursts/100.svg", ["hit100-0", "hit100k-0"], "gameplay_hit100"),
    new NoneImageTask("hit100.png", "ranking_hit100"),
    new NoneImageTask("hit100k.png", "ranking_hit100k")
]);

export const hit50 = new TaskGroup("hit50", [
    new DefaultImageTask("src/graphics/gameplay/osu/hitbursts/50.svg", ["hit50-0", "hit50k-0"], "gameplay_hit50"),
    new NoneImageTask("hit50.png", "ranking_hit100"),
    new NoneImageTask("hit50k.png", "ranking_hit100k")
]);

export const hit0 = new DefaultImageTask("src/graphics/gameplay/osu/hitbursts/0.svg", "hit0");

export default new TaskGroup("hitbursts", [hit300, hit100, hit50, hit0]);
