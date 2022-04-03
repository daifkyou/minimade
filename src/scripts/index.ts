/*
NOTE
I really suck at building things, if you can figure out a better way/know a better build system please open an issue.
maybe we can do a json-based thing where there is like a json for input and output to cut down on boilerplate
honestly im really uncomfortable with the current build thing and i feel like im going to be judged for making it this bad
*/

import { Task, TaskGroup } from "ktw";
import { Init, DefaultImageTask, CopyTask, NoneImageTask, LetterTask, ConditionalCompileTask, ModeTask, CompileTask, config, ResolutionDependentSourceImageTask, Load, depended } from "./custom.js";
import * as arg from "arg";

const flags = arg.default({
    "--help": Boolean,
    "--version": Boolean,
    "--config": String,
    "--cache": String,

    "-h": "--help",
    "-v": "--version",
    "-o": "--config",
    "-a": "--cache"
});

if (flags["--help"]) {
    console.log(`minimade build script (it builds minimade ._.)

Usage: [script, usually npm run skin --] [options]

Accepted Options:
  --help    or -h: displays this help message
  --version or -v: does nothing because it's kinda hard to have a "version", if you really wanted you could check the repo
  --config  or -o: path to config file (config.jsonc by default)
  --cache   or -a: path to cache file (cache/cache.json by default)`);
} else if (!flags["--version"]) {
    const configPath = flags["--config"] as string ?? "config.jsonc";
    const cachePath = flags["--cache"] as string ?? "cache/cache.json";

    Load(cachePath);



    const ini = new CopyTask("src/meta/skin.ini", "skin.ini");
    const license = new CopyTask("LICENSE", "LICENSE", "license");



    const button = new TaskGroup("button",
        new DefaultImageTask("src/graphics/interface/button/left.svg", "button-left"),
        new DefaultImageTask("src/graphics/interface/button/middle.svg", "button-middle"),
        new DefaultImageTask("src/graphics/interface/button/right.svg", "button-right"),
    );

    const cursor = new TaskGroup("cursor",
        new DefaultImageTask("src/graphics/interface/cursor/cursor.svg", "cursor"),
        new NoneImageTask("cursortrail.png"),
        new NoneImageTask("star2.png")
    );

    const menuBack = new DefaultImageTask("src/graphics/interface/menu-back.svg", "menu-back");



    const hit300 = new TaskGroup("hit300",
        new NoneImageTask("hit300.png"),
        new NoneImageTask("hit300k.png"),
        new NoneImageTask("hit300g.png")
    );

    const hit100 = new TaskGroup("hit100",
        new DefaultImageTask("src/graphics/gameplay/osu/hit100.svg", ["hit100-0", "hit100k-0"], "gameplay_hit100"),
        new NoneImageTask("hit100.png", "ranking_hit100"),
        new NoneImageTask("hit100k.png", "ranking_hit100k")
    );

    const hit50 = new TaskGroup("hit50",
        new DefaultImageTask("src/graphics/gameplay/osu/hit50.svg", ["hit50-0", "hit50k-0"], "gameplay_hit50"),
        new NoneImageTask("hit50.png", "ranking_hit100"),
        new NoneImageTask("hit50k.png", "ranking_hit100k")
    );

    const hit0 = new DefaultImageTask("src/graphics/gameplay/osu/hit0.svg", "hit0");

    const hitbursts = new TaskGroup("hitbursts", hit300, hit100, hit50, hit0);



    const circle = new TaskGroup("circle",
        new DefaultImageTask("src/graphics/gameplay/osu/approachcircle.svg", "approachcircle"),
        new DefaultImageTask("src/graphics/gameplay/osu/hitcircle.svg", "hitcircle"),
        new DefaultImageTask("src/graphics/gameplay/osu/hitcircleoverlay.svg", "hitcircleoverlay")
    );

    const slider = new TaskGroup("slider",
        new DefaultImageTask("src/graphics/gameplay/osu/sliderb.svg", "sliderb"),
        new DefaultImageTask("src/graphics/gameplay/osu/sliderfollowcircle.svg", "sliderfollowcircle"),
        new DefaultImageTask("src/graphics/gameplay/osu/sliderscorepoint.svg", "sliderscorepoint"),
        new DefaultImageTask("src/graphics/gameplay/osu/reversearrow.svg", "reversearrow"),
        new NoneImageTask("sliderendcircle.png")
    );

    const spinner = new TaskGroup("spinner",
        new DefaultImageTask("src/graphics/gameplay/spinner/approachcircle.svg", "spinner-approachcircle"),
        new DefaultImageTask("src/graphics/gameplay/spinner/circle.svg", "spinner-circle"),
        new DefaultImageTask("src/graphics/gameplay/spinner/metre.svg", "spinner-metre"), // the king's english
        new DefaultImageTask("src/graphics/interface/hud/rpm.svg", "spinner-rpm"),
        new NoneImageTask("spinner-background.png"),
        new NoneImageTask("spinner-spin.png"),
        new NoneImageTask("spinner-clear.png")
    );

    const followpoint = new DefaultImageTask("src/graphics/gameplay/osu/followpoint.svg", "followpoint");



    const scorebar = new TaskGroup("scorebar",
        new DefaultImageTask("src/graphics/interface/hud/scorebar/bg.svg", "scorebar-bg"),
        new DefaultImageTask("src/graphics/interface/hud/scorebar/colour.svg", "scorebar-colour")
    );

    const keys = new TaskGroup("keys",
        new DefaultImageTask("src/graphics/interface/hud/inputoverlay/key.svg", "inputoverlay-key"),
        new NoneImageTask("inputoverlay-background.png")
    );

    const osuHud = new TaskGroup("hud",
        scorebar,
        keys,
        new DefaultImageTask("src/graphics/interface/hud/skip.svg", "play-skip"),
        new DefaultImageTask("src/graphics/interface/hud/unranked.svg", "play-unranked"),
        new DefaultImageTask("src/graphics/interface/hud/warning.svg", "arrow-warning"),
        new DefaultImageTask("src/graphics/interface/hud/fail.svg", "section-fail"),
        new DefaultImageTask("src/graphics/interface/hud/pass.svg", "section-pass")
    );



    const selectionSong = new TaskGroup("selectionsong",
        new DefaultImageTask("src/graphics/interface/selection/song/background.svg", "menu-button-background"),
        new DefaultImageTask("src/graphics/interface/selection/song/star.svg", "star")
    );

    const selectionFrame = new TaskGroup("selectionbuttons",
        new ResolutionDependentSourceImageTask(resolution => `src/graphics/interface/selection/frame/${resolution}/mode.svg`, "selection-mode"),
        new DefaultImageTask("src/graphics/interface/selection/frame/mods.svg", "selection-mods"),
        new DefaultImageTask("src/graphics/interface/selection/frame/random.svg", "selection-random"),
        new DefaultImageTask("src/graphics/interface/selection/frame/options.svg", "selection-options"),
        new DefaultImageTask("src/graphics/interface/selection/frame/mode-over.svg", "selection-mode-over"),
        new DefaultImageTask("src/graphics/interface/selection/frame/mods-over.svg", "selection-mods-over"),
        new DefaultImageTask("src/graphics/interface/selection/frame/random-over.svg", "selection-random-over"),
        new DefaultImageTask("src/graphics/interface/selection/frame/options-over.svg", "selection-options-over"),
        new ResolutionDependentSourceImageTask(resolution => `src/graphics/interface/selection/frame/modes/${resolution === "any" ? "safe" : "hacky"}/osu.svg`, "mode-osu-small")
    );

    const selectionTab = new DefaultImageTask("src/graphics/interface/selection/tab.svg", "selection-tab");



    const rankingScreen = new TaskGroup("rankingscreen",
        new DefaultImageTask("src/graphics/interface/ranking/panels/panel.svg", "ranking-panel"),
        new DefaultImageTask("src/graphics/interface/ranking/panels/graph.svg", "ranking-graph"),
        new DefaultImageTask("src/graphics/interface/ranking/panels/winner.svg", "ranking-winner"),
        new DefaultImageTask("src/graphics/interface/ranking/status/fc.svg", "ranking-perfect"),
        new DefaultImageTask("src/graphics/interface/ranking/status/skipped.svg", "multi-skipped"),
        new NoneImageTask("ranking-title.png"),
        new NoneImageTask("ranking-maxcombo.png"),
        new NoneImageTask("ranking-accuracy.png")
    );

    const letters = new TaskGroup("letters", ...["A", "B", "C", "D", "S", "SH", "X", "XH"].map(l => new LetterTask(l)));



    const pause = new TaskGroup("pause",
        new DefaultImageTask("src/graphics/interface/pause/focus.svg", "arrow-pause"),
        new DefaultImageTask("src/graphics/interface/pause/back.svg", "pause-back"),
        new DefaultImageTask("src/graphics/interface/pause/continue.svg", "pause-continue"),
        new DefaultImageTask("src/graphics/interface/pause/replay.svg", "pause-replay"), // TODO: move to ranking when doing that
        new DefaultImageTask("src/graphics/interface/pause/retry.svg", "pause-retry")
    );



    const editor = new TaskGroup("editor",
        new DefaultImageTask("src/graphics/interface/editor/select.svg", "hitcircleselect")
    );



    const offsetTick = new DefaultImageTask("src/graphics/interface/offset/tick.svg", "options-offset-tick");



    const modes = new TaskGroup("modes",
        new ModeTask("osu")
    );



    const mods = new Task<void>(async depend => {
        const mods = await depended(config.get("mods"), depend) as string[];
        depend(...mods.map(mod => new DefaultImageTask(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`, `mods-${mod}`)));
    }, "mods");



    const fonts = new Task<void>(async depend => {
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



    const background = new CompileTask("src/graphics/interface/home/background.svg", "menu-background.jpg", ["-b=black"]);



    const osu = new TaskGroup("osu", circle, slider, spinner, followpoint, hitbursts, osuHud);

    const ui = new TaskGroup("ui", cursor, button, menuBack, modes, mods, fonts, pause, offsetTick);

    const selection = new TaskGroup("selection", selectionSong, selectionFrame, selectionTab);

    const ranking = new TaskGroup("ranking", rankingScreen, letters);



    const main = new TaskGroup("main", license, ini, background, ui, selection, osu, ranking, editor);

    Init(main, cachePath, configPath);
}
