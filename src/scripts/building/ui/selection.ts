import { DefaultCompileImage, ResolutionDependentSourceCompileTask } from "../classes.js";

export const selectionSong = new [
    DefaultCompileImage("src/graphics/interface/selection/song/background.svg", "menu-button-background"),
    DefaultCompileImage("src/graphics/interface/selection/song/star.svg", "star")
];

export const selectionFrame = [
    DefaultCompileImage("src/graphics/interface/selection/frame/menu-back.svg", "menu-back"),

    ResolutionDependentSourceCompileTask(resolution => `src/graphics/interface/selection/frame/${resolution}/mode.svg`, "selection-mode"),
    DefaultCompileImage("src/graphics/interface/selection/frame/mods.svg", "selection-mods"),
    DefaultCompileImage("src/graphics/interface/selection/frame/random.svg", "selection-random"),
    ResolutionDependentSourceCompileTask(resolution => `src/graphics/interface/selection/frame/${resolution}/options.svg`, "selection-options"),

    DefaultCompileImage("src/graphics/interface/selection/frame/mode-over.svg", "selection-mode-over"),
    DefaultCompileImage("src/graphics/interface/selection/frame/mods-over.svg", "selection-mods-over"),
    DefaultCompileImage("src/graphics/interface/selection/frame/random-over.svg", "selection-random-over"),
    DefaultCompileImage("src/graphics/interface/selection/frame/options-over.svg", "selection-options-over")
];

export const selectionTab = DefaultCompileImage("src/graphics/interface/selection/tab.svg", "selection-tab");

export default [selectionSong, selectionFrame, selectionTab];
