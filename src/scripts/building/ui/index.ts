
import modes from "./modes.js";
import fonts from "./fonts.js"
import cursor from "./cursor.js";
import button from "./button.js";
import mods from "./mods.js";
import offsetTick from "./offsetTick.js";
import pause from "./pause.js";
import { TaskGroup } from "ktw";

export default new TaskGroup("ui", [cursor, button, modes, mods, fonts, pause, offsetTick]);

