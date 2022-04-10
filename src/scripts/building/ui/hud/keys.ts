import { TaskGroup } from "ktw";
import { DefaultImageTask, NoneImageTask } from "../../classes.js";


export default new TaskGroup("keys", [
    new DefaultImageTask("src/graphics/interface/hud/inputoverlay/key.svg", "inputoverlay-key"),
    new NoneImageTask("inputoverlay-background.png")
]);
