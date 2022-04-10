import { TaskGroup } from "ktw";
import { DefaultImageTask } from "../../classes.js";

export default new TaskGroup("scorebar", [
    new DefaultImageTask("src/graphics/interface/hud/scorebar/bg.svg", "scorebar-bg"),
    new DefaultImageTask("src/graphics/interface/hud/scorebar/colour.svg", "scorebar-colour")
]);
