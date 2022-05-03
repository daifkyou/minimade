import { DefaultCompile, ResolutionDependentSourceCompile } from "../classes.js";

export const selectionSong = [
    DefaultCompile("src/graphics/interface/selection/song/background.svg", "menu-button-background"),
    DefaultCompile("src/graphics/interface/selection/song/star.svg", "star")
];

export const selectionFrame = [
    DefaultCompile("src/graphics/interface/selection/frame/menu-back.svg", "menu-back"),

    ResolutionDependentSourceCompile(resolution => `src/graphics/interface/selection/frame/${resolution}/mode.svg`, "selection-mode"),
    DefaultCompile("src/graphics/interface/selection/frame/mods.svg", "selection-mods"),
    DefaultCompile("src/graphics/interface/selection/frame/random.svg", "selection-random"),
    ResolutionDependentSourceCompile(resolution => `src/graphics/interface/selection/frame/${resolution}/options.svg`, "selection-options"),

    DefaultCompile("src/graphics/interface/selection/frame/mode-over.svg", "selection-mode-over"),
    DefaultCompile("src/graphics/interface/selection/frame/mods-over.svg", "selection-mods-over"),
    DefaultCompile("src/graphics/interface/selection/frame/random-over.svg", "selection-random-over"),
    DefaultCompile("src/graphics/interface/selection/frame/options-over.svg", "selection-options-over")
];

export const selectionTab = DefaultCompile("src/graphics/interface/selection/tab.svg", "selection-tab");

export default [selectionSong, selectionFrame, selectionTab];
