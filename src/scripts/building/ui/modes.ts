import { DefaultCompileImage, Compile1xTask, Compile2xTask } from "../classes.js";

function ModeTask(name: string) {
    const source = `src/graphics/interface/modes/${name}.svg`;

    return [
        DefaultCompileImage(source, `mode-${name}-med`),
        new Compile1xTask(source, `mode-${name}.png`, ["-z=2"]),
        new Compile2xTask(source, `mode-${name}@2x.png`, ["-z=4"])
    ];
}

export default [
    ModeTask("osu")
];
