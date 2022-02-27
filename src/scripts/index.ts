/*
NOTE
I really suck at building things, if you can figure out a better way/know a better build system please open an issue.
*/

import { Task, Cache } from "ktw";
import * as custom from "./custom.js";

Cache.Load("./cache/cache.json");
custom.Config.Load();



const ini = new custom.CopyTask("src/meta/skin.ini", "skin.ini");
const license = new custom.CopyTask("LICENSE", "LICENSE", "license");



const cursor = new Task<void>(async depend => {
    depend(
        new custom.DefaultImageTask("src/graphics/interface/cursor/cursor.svg", "cursor"),
        new custom.NoneImageTask("cursortrail.png"),
        new custom.NoneImageTask("star2.png")
    );
}, "cursor")



const hit300 = new Task<void>(depend => {
    depend(new custom.NoneImageTask("hit300.png"), new custom.NoneImageTask("hit300k.png"), new custom.NoneImageTask("hit300g.png"));
}, "hit300s");

const hit100 = new Task<void>(depend => {
    depend(
        new custom.DefaultImageTask("src/graphics/gameplay/osu/hit100.svg", ["hit100-0", "hit100k-0"], "gameplay_hit100"),
        new custom.NoneImageTask("hit100.png", "ranking_hit100"),
        new custom.NoneImageTask("hit100k.png", "ranking_hit100k")
    );
}, "hit100s");

const hit50 = new Task<void>(depend => {
    depend(
        new custom.DefaultImageTask("src/graphics/gameplay/osu/hit50.svg", ["hit50-0", "hit50k-0"], "gameplay_hit50"),
        new custom.NoneImageTask("hit50.png", "ranking_hit100"),
        new custom.NoneImageTask("hit50k.png", "ranking_hit100k")
    );
}, "hit100s");

const hit0 = new custom.DefaultImageTask("src/graphics/gameplay/osu/hit0.svg", "hit0");



const hitbursts = new Task<void>(depend => {
    depend(hit300, hit100, hit50, hit0);
}, "hitbursts");

const circle = new Task<void>(depend => {
    depend(
        new custom.DefaultImageTask("src/graphics/gameplay/osu/approachcircle.svg", "approachcircle"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/hitcircle.svg", "hitcircle"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/hitcircleoverlay.svg", "hitcircleoverlay")
    );
}, "circle");

const slider = new Task<void>(depend => {
    depend(
        new custom.DefaultImageTask("src/graphics/gameplay/osu/sliderb.svg", "sliderb"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/sliderfollowcircle.svg", "sliderfollowcircle"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/sliderscorepoint.svg", "sliderscorepoint"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/reversearrow.svg", "reversearrow"),
        new custom.NoneImageTask("sliderendcircle.png")
    );
}, "slider");

const scorebar = new Task<void>(depend => {
    depend(
        new custom.DefaultImageTask("src/graphics/interface/hud/scorebar-bg.svg", "scorebar-bg"),
        new custom.DefaultImageTask("src/graphics/interface/hud/scorebar-colour.svg", "scorebar-colour") // the king's english
    );
}, "slider");

const hud = new Task<void>(depend => {
    depend(
        scorebar,
        new custom.DefaultImageTask("src/graphics/interface/hud/play-skip.svg", "sliderb"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/sliderfollowcircle.svg", "sliderfollowcircle"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/hitcircleoverlay.svg", "sliderscorepoint"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/reversearrow.svg", "reversearrow"),
        new custom.NoneImageTask("sliderendcircle.png")
    );
}, "slider");



const pause = new Task<void>(depend => {
    depend(
        new custom.DefaultImageTask("src/graphics/gameplay/osu/sliderb.svg", "sliderb"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/sliderfollowcircle.svg", "sliderfollowcircle"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/hitcircleoverlay.svg", "sliderscorepoint"),
        new custom.DefaultImageTask("src/graphics/gameplay/osu/reversearrow.svg", "reversearrow"),
        new custom.NoneImageTask("sliderendcircle.png")
    );
}, "slider");



const mods = new Task<void>(async depend => {
    const mods = (await depend(custom.Config.get("mods")))[0] as string[];
    depend(...mods.map(mod => new custom.DefaultImageTask(`src/graphics/interface/mods/${mod}.svg`, `selection-mod-${mod}`, `mods-${mod}`)));
}, "mods");

const fonts = new Task<void>(async depend => {
    const fonts = (await depend(custom.Config.get("fonts")))[0] as { [key: string]: { size: number, glyphs: string[] } };

    for (const name in fonts) {
        const font = fonts[name];
        depend(...font.glyphs.map(glyph => new custom.FontTask(name, glyph, font.size)));
    }
}, "fonts");

const osu = new Task<void>(async depend => {
    depend(circle, slider);
}, "fonts");



const ui = new Task<void>(depend => {
    depend(cursor, mods, fonts);
}, "ui");

const gameplay = new Task<void>(depend => {
    depend(hitbursts);
}, "ui");



const main = new Task<void>(depend => {
    depend(license, ini, ui, gameplay, osu);
}, "");



main.run().then(() => Cache.Save());
