import { Task } from "../task.js";
import { Compile1xTask, Compile2xTask, DefaultCompile, NoneImageTask } from "../classes.js";
import Config from "../config";

export const letterSmallWidth = 34;

export function CompileLetter(letter: string) {
    const source = `src/graphics/interface/ranking/grades/${letter}.svg`;
    const basename = `ranking-${letter}`;
    return [
        DefaultCompile(source, basename),
        [
            new Compile1xTask(source, `${basename}-small.png`, [`-w=${letterSmallWidth}`]),
            new Compile2xTask(source, `${basename}-small@2x.png`, [`-w=${letterSmallWidth * 2}`])
        ]
    ];
}

export const letters = ["A", "B", "C", "D", "S", "SH", "X", "XH"].map(l => CompileLetter(l));



export const screen = [
    DefaultCompile("src/graphics/interface/ranking/panels/panel.svg", "ranking-panel"),
    DefaultCompile("src/graphics/interface/ranking/panels/graph.svg", "ranking-graph"),
    DefaultCompile("src/graphics/interface/ranking/panels/winner.svg", "ranking-winner"),
    DefaultCompile("src/graphics/interface/ranking/status/fc.svg", "ranking-perfect"),
    DefaultCompile("src/graphics/interface/ranking/status/skipped.svg", "multi-skipped"),
    DefaultCompile("src/graphics/interface/ranking/panels/replay.svg", "pause-replay"),
    new NoneImageTask("ranking-title.png"),
    new NoneImageTask("ranking-maxcombo.png"),
    new NoneImageTask("ranking-accuracy.png")
];

export default [screen, letters];
