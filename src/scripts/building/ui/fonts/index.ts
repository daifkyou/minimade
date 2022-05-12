import { CompileTask, Compile1xTask, Compile2xTask } from "../../classes.js";
import Config, { ConfigRoot } from "../../config.js";

export const fonts = new ConfigRoot("src/fonts.jsonc");

export function Glyph(Base: typeof CompileTask) {
    return class Glyph extends Base {
        constructor(public glyph: string, public name: string) {
            super(`src/graphics/interface/fonts/${name}/${glyph}.svg`, `${name}-${glyph}`);
            Config.config.get("fonts").get(name).get("glyphs").on("update", this.update);
        }

        update() {
            if ((fonts.get(this.name).get("glyphs").value as string[]).includes(this.glyph)) super.update(); // race condition?
        }
    };
}

export class CompileGlyph1xTask extends Glyph(Compile1xTask) { }
export class CompileGlyph2xTask extends Glyph(Compile2xTask) { }

export function CompileGlyph(glyph: string, name: string): [CompileGlyph1xTask, CompileGlyph2xTask] {
    return [
        new CompileGlyph1xTask(glyph, name),
        new CompileGlyph2xTask(glyph, name)
    ];
}

export const glyphs = {} as Record<string, Record<string, [CompileGlyph1xTask, CompileGlyph2xTask]>>;

fonts.on("update", fonts => {
    for (const name in fonts) {
        fonts[name].glyphs.forEach((glyph: string) => {
            if (glyphs[name] === undefined) { // if not defined define
                glyphs[name] = {};
            } else {
                if (glyphs[name][glyph] !== undefined) return glyphs[name][glyph]; // if already defined return defined
            }
            // will only run if not defined
            return glyphs[name][glyph] = CompileGlyph(glyph, name);
        });
    }
});
    
export default glyphs;
