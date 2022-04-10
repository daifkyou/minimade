import { Task, TaskGroup } from "ktw";
import { DefaultImageTask, ConditionalCompileTask, config } from "../classes.js";

const letterSmallWidth = 34;

class LetterTask extends Task<void> {
    constructor(letter: string, provides = `letter-${letter}`) {
        super(depend => {
            const source = `src/graphics/interface/ranking/grades/${letter}.svg`;
            const basename = `ranking-${letter}`;
            depend(
                new DefaultImageTask(source, basename),
                new ConditionalCompileTask(source, `${basename}-small.png`, config.get("1x"), [`-w=${letterSmallWidth}`]),
                new ConditionalCompileTask(source, `${basename}-small@2x.png`, config.get("2x"), [`-w=${letterSmallWidth * 2}`])
            );
        }, provides);
    }
}

export default new TaskGroup("letters", ["A", "B", "C", "D", "S", "SH", "X", "XH"].map(l => new LetterTask(l)));
