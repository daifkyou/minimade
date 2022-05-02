import { DefaultCompile, NoneImageTask } from "../classes.js";

export default [
    DefaultCompile("src/graphics/gameplay/osu/slider/ball.svg", "sliderb"),
    DefaultCompile("src/graphics/gameplay/osu/slider/followcircle.svg", "sliderfollowcircle"),
    DefaultCompile("src/graphics/gameplay/osu/slider/point.svg", "sliderscorepoint"),
    DefaultCompile("src/graphics/gameplay/osu/slider/reverse.svg", "reversearrow"),
    new NoneImageTask("sliderendcircle.png")
];
