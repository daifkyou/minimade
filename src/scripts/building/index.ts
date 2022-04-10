import { TaskGroup } from "ktw";
import { Init, CopyTask } from "./classes.js";

import osu from "./osu/index.js";
import ui from "./ui/index.js";

const ini = new CopyTask("src/meta/skin.ini", "skin.ini");
const license = new CopyTask("LICENSE", "LICENSE", "license");



const main = new TaskGroup("main", [license, ini, ui, osu]);

export default (cachePath: string, configPath: string) => Init(main, cachePath, configPath);
