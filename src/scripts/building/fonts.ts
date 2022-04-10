import { Task } from "ktw";
import { NoneImageTask, depended, config, ConditionalCompileTask } from "../classes.js";

export default new Task<void>(async depend => {
    depend(
        new NoneImageTask("score-x.png"),
        new NoneImageTask("score-percent.png")
    );

    const fonts = await depended(config.get("fonts"), depend) as { [key: string]: { size: number, glyphs: string[] } };

    for (const name in fonts) {
        const font = fonts[name];
        font.glyphs.forEach(glyph => {
            const source = `src/graphics/fonts/${name}/${glyph}.svg`;

            depend(
                new ConditionalCompileTask(source, `${name}-${glyph}.png`, config.get("1x"), [`-z=${font.size}`]),
                new ConditionalCompileTask(source, `${name}-${glyph}@2x.png`, config.get("2x"), [`-z=${font.size * 2}`])
            );
        });
    }
}, "fonts");
