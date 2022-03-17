/*
NOTE
I really suck at building things, if you can figure out a better way/know a better build system please open an issue.
*/

import { Task } from "ktw";
import { Init, Config, DefaultImageTask, CopyTask, NoneImageTask, FontTask } from "./custom.js";
import * as minimist from "minimist";

const flags = minimist.default(process.argv.slice(2));

const config = flags.config as string ?? "config.jsonc";
const cache = flags.cache as string ?? "cache/cache.json";



const ini = new CopyTask("src/meta/skin.ini", "skin.ini");
const license = new CopyTask("LICENSE", "LICENSE", "license");



const cursor = Task.group("cursor", new DefaultImageTask("src/graphics/interface/cursor/cursor.svg", "cursor"),
    new NoneImageTask("cursortrail.png"),
    new NoneImageTask("star2.png")
);



const hit300 = Task.group("hit300",
    new NoneImageTask("hit300.png"),
    new NoneImageTask("hit300k.png"),
    new NoneImageTask("hit300g.png")
);

const hit100 = Task.group("hit100",
    new DefaultImageTask("src/graphics/gameplay/osu/hit100.svg", ["hit100-0", "hit100k-0"], "gameplay_hit100"),
    new NoneImageTask("hit100.png", "ranking_hit100"),
    new NoneImageTask("hit100k.png", "ranking_hit100k")
);

const hit50 = Task.group("hit50",
    new DefaultImageTask("src/graphics/gameplay/osu/hit50.svg", ["hit50-0", "hit50k-0"], "gameplay_hit50"),
    new NoneImageTask("hit50.png", "ranking_hit100"),
    new NoneImageTask("hit50k.png", "ranking_hit100k")
);

const hit0 = new DefaultImageTask("src/graphics/gameplay/osu/hit0.svg", "hit0");

const hitbursts = Task.group("hitbursts", hit300, hit100, hit50, hit0);



const circle = Task.group("circle",
    new DefaultImageTask("src/graphics/gameplay/osu/approachcircle.svg", "approachcircle"),
    new DefaultImageTask("src/graphics/gameplay/osu/hitcircle.svg", "hitcircle"),
    new DefaultImageTask("src/graphics/gameplay/osu/hitcircleoverlay.svg", "hitcircleoverlay")
);

const slider = Task.group("slider",
    new DefaultImageTask("src/graphics/gameplay/osu/sliderb.svg", "sliderb"),
    new DefaultImageTask("src/graphics/gameplay/osu/sliderfollowcircle.svg", "sliderfollowcircle"),
    new DefaultImageTask("src/graphics/gameplay/osu/sliderscorepoint.svg", "sliderscorepoint"),
    new DefaultImageTask("src/graphics/gameplay/osu/reversearrow.svg", "reversearrow"),
    new NoneImageTask("sliderendcircle.png")
);

const spinner = Task.group("spinner",
    new DefaultImageTask("src/graphics/gameplay/spinner/approachcircle.svg", "spinner-approachcircle"),
    new DefaultImageTask("src/graphics/gameplay/spinner/circle.svg", "spinner-circle"),
    new DefaultImageTask("src/graphics/gameplay/spinner/metre.svg", "spinner-metre"), // the king's english
    new DefaultImageTask("src/graphics/interface/hud/rpm.svg", "spinner-rpm"),
    new NoneImageTask("spinner-background.png"),
    new NoneImageTask("spinner-spin.png"),
    new NoneImageTask("spinner-clear.png")
);

const followpoint = new DefaultImageTask("src/graphics/gameplay/osu/followpoint.svg", "followpoint");



const scorebar = Task.group("scorebar",
    new DefaultImageTask("src/graphics/interface/hud/scorebar/bg.svg", "scorebar-bg"),
    new DefaultImageTask("src/graphics/interface/hud/scorebar/colour.svg", "scorebar-colour")
);

const keys = Task.group("keys",
    new DefaultImageTask("src/graphics/interface/hud/inputoverlay/key.svg", "inputoverlay-key"),
    new NoneImageTask("inputoverlay-background.png")
);

const osuHud = Task.group("hud",
    scorebar,
    keys,
    new DefaultImageTask("src/graphics/interface/hud/skip.svg", "play-skip"),
    new DefaultImageTask("src/graphics/interface/hud/unranked.svg", "play-unranked"),
    new DefaultImageTask("src/graphics/interface/hud/warning.svg", "arrow-warning"),
    new DefaultImageTask("src/graphics/interface/hud/fail.svg", "section-fail"),
    new DefaultImageTask("src/graphics/interface/hud/pass.svg", "section-pass")
)



const pause = Task.group("pause",
    new DefaultImageTask("src/graphics/interface/pause/focus.svg", "arrow-pause"),
    new DefaultImageTask("src/graphics/interface/pause/back.svg", "pause-back"),
    new DefaultImageTask("src/graphics/interface/pause/continue.svg", "pause-continue"),
    new DefaultImageTask("src/graphics/interface/pause/replay.svg", "pause-replay"), // TODO: move to ranking when doing that
    new DefaultImageTask("src/graphics/interface/pause/retry.svg", "pause-retry")
);



const mods = new Task<void>(async depend => {
    const mods = await Config.depended("mods", depend) as string[];
    depend(...mods.map(mod => new DefaultImageTask(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`, `mods-${mod}`)));
}, "mods");



const fonts = new Task<void>(async depend => {
    depend(
        new NoneImageTask("score-x.png"),
        new NoneImageTask("score-percent.png")
    );

    const fonts = await Config.depended("fonts", depend) as { [key: string]: { size: number, glyphs: string[] } };

    for (const name in fonts) {
        const font = fonts[name];
        depend(...font.glyphs.map(glyph => new FontTask(name, glyph, font.size)));
    }
}, "fonts");



const osu = Task.group("osu", circle, slider, spinner, followpoint, hitbursts, osuHud);



const ui = Task.group("ui", cursor, mods, fonts, pause);



const main = Task.group("main", license, ini, ui, osu);



Init(main, cache, config);
