import { CopyTask } from "./classes.js";

import osu from "./osu/index.js";
import ui from "./ui/index.js";

const ini = new CopyTask("src/meta/skin.ini", "skin.ini");
const license = new CopyTask("LICENSE", "LICENSE", "license");



const main = [license, ini, ui, osu];

export default async function Init(cachePath: string, configPath: string) {
    await Cache.load(cachePath);
    await Config.load(configPath);
    // await main();
    await Cache.save(cachePath);
}
