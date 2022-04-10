import { TaskGroup } from "ktw";
import { DefaultImageTask, ResolutionDependentSourceImageTask } from "../classes.js";

export const selectionSong = new TaskGroup("selectionsong", [
    new DefaultImageTask("src/graphics/interface/selection/song/background.svg", "menu-button-background"),
    new DefaultImageTask("src/graphics/interface/selection/song/star.svg", "star")
]);

export const selectionFrame = new TaskGroup("selectionbuttons", [
    new DefaultImageTask("src/graphics/interface/selection/frame/menu-back.svg", "menu-back"),

    new ResolutionDependentSourceImageTask(resolution => `src/graphics/interface/selection/frame/${resolution}/mode.svg`, "selection-mode"),
    new DefaultImageTask("src/graphics/interface/selection/frame/mods.svg", "selection-mods"),
    new DefaultImageTask("src/graphics/interface/selection/frame/random.svg", "selection-random"),
    new ResolutionDependentSourceImageTask(resolution => `src/graphics/interface/selection/frame/${resolution}/options.svg`, "selection-options"),

    new DefaultImageTask("src/graphics/interface/selection/frame/mode-over.svg", "selection-mode-over"),
    new DefaultImageTask("src/graphics/interface/selection/frame/mods-over.svg", "selection-mods-over"),
    new DefaultImageTask("src/graphics/interface/selection/frame/random-over.svg", "selection-random-over"),
    new DefaultImageTask("src/graphics/interface/selection/frame/options-over.svg", "selection-options-over")
]);

export const selectionTab = new DefaultImageTask("src/graphics/interface/selection/tab.svg", "selection-tab");

export default new TaskGroup("selection", [selectionSong, selectionFrame, selectionTab]);
