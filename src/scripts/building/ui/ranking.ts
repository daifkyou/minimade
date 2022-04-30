import { Task, TaskGroup } from "ktw";
import { DefaultCompileImage, ConditionalCompileTask, config, NoneImageTask } from "../classes.js";

export const letterSmallWidth = 34;

export class LetterTask extends Task<void> {
    constructor(letter: string, provides = `letter-${letter}`) {
        super(depend => {
            const source = `src/graphics/interface/ranking/grades/${letter}.svg`;
            const basename = `ranking-${letter}`;
            depend(
                new DefaultCompileImage(source, basename),
                new ConditionalCompileTask(source, `${basename}-small.png`, config.get("1x"), [`-w=${letterSmallWidth}`]),
                new ConditionalCompileTask(source, `${basename}-small@2x.png`, config.get("2x"), [`-w=${letterSmallWidth * 2}`])
            );
        }, provides);
    }
}

export const letters = new TaskGroup("letters", ["A", "B", "C", "D", "S", "SH", "X", "XH"].map(l => new LetterTask(l)));



export const screen = new TaskGroup("rankingscreen", [
    new DefaultCompileImage("src/graphics/interface/ranking/panels/panel.svg", "ranking-panel"),
    new DefaultCompileImage("src/graphics/interface/ranking/panels/graph.svg", "ranking-graph"),
    new DefaultCompileImage("src/graphics/interface/ranking/panels/winner.svg", "ranking-winner"),
    new DefaultCompileImage("src/graphics/interface/ranking/status/fc.svg", "ranking-perfect"),
    new DefaultCompileImage("src/graphics/interface/ranking/status/skipped.svg", "multi-skipped"),
    new NoneImageTask("ranking-title.png"),
    new NoneImageTask("ranking-maxcombo.png"),
    new NoneImageTask("ranking-accuracy.png")
]);

export default new TaskGroup("ranking", [screen, letters]);
