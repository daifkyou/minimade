import { NoneImageTask, DefaultCompileImage } from "../classes.js";

export const hit300 = [
    new NoneImageTask("hit300.png"),
    new NoneImageTask("hit300k.png"),
    new NoneImageTask("hit300g.png")
];

export const hit100 = [
    DefaultCompileImage("src/graphics/gameplay/osu/hitbursts/100.svg", ["hit100-0", "hit100k-0"], "gameplay_hit100"),
    new NoneImageTask("hit100.png", "ranking_hit100"),
    new NoneImageTask("hit100k.png", "ranking_hit100k")
];

export const hit50 = [
    DefaultCompileImage("src/graphics/gameplay/osu/hitbursts/50.svg", ["hit50-0", "hit50k-0"], "gameplay_hit50"),
    new NoneImageTask("hit50.png", "ranking_hit100"),
    new NoneImageTask("hit50k.png", "ranking_hit100k")
];

export const hit0 = DefaultCompileImage("src/graphics/gameplay/osu/hitbursts/0.svg", "hit0");

export default [hit300, hit100, hit50, hit0];
