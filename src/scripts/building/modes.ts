import { Task, TaskGroup } from "ktw";
import { DefaultImageTask, ConditionalCompileTask, config } from "../classes.js";

class ModeTask extends Task<void> {
    constructor(name: string, provides = `${name}mode`) {
        super(depend => {
            const source = `src/graphics/interface/modes/${name}.svg`;
            depend(
                new DefaultImageTask(source, `mode-${name}-med`),
                new ConditionalCompileTask(source, `mode-${name}.png`, config.get("1x"), [`-z=${2}`]),
                new ConditionalCompileTask(source, `mode-${name}@2x.png`, config.get("2x"), [`-z=${4}`])
            );
        }, provides);
    }
}

export default new TaskGroup("modes", [
    new ModeTask("osu")
]);
