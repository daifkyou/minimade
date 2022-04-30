import { DefaultCompileImage, NoneImageTask } from "../classes.js";

export default [
    DefaultCompileImage("src/graphics/gameplay/osu/slider/ball.svg", "sliderb"),
    DefaultCompileImage("src/graphics/gameplay/osu/slider/followcircle.svg", "sliderfollowcircle"),
    DefaultCompileImage("src/graphics/gameplay/osu/slider/point.svg", "sliderscorepoint"),
    DefaultCompileImage("src/graphics/gameplay/osu/slider/reverse.svg", "reversearrow"),
    new NoneImageTask("sliderendcircle.png")
];
