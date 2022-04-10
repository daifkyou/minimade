import { TaskGroup } from "ktw";
import { Init, DefaultImageTask, CopyTask, NoneImageTask, ResolutionDependentSourceImageTask } from "./classes.js";

import modes from "./ui/modes.js";
import fonts from "./ui/fonts.js"
import cursor from "./ui/cursor.js";
import button from "./ui/button.js";
import osu from "./osu/index.js";
import mods from "./ui/mods.js";
import offsetTick from "./ui/offsetTick.js";
import pause from "./ui/pause.js";
import background from "./ui/background.js";
import editor from "./ui/editor.js";
import selection from "./ui/selection.js";
import ranking from "./ui/ranking.js";

const ini = new CopyTask("src/meta/skin.ini", "skin.ini");
const license = new CopyTask("LICENSE", "LICENSE", "license");



const ui = new TaskGroup("ui", [cursor, button, modes, mods, fonts, pause, offsetTick]);



const main = new TaskGroup("main", [license, ini, background, ui, selection, osu, ranking, editor]);

export default (cachePath: string, configPath: string) => Init(main, cachePath, configPath);
