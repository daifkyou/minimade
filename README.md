**maybe won't be active after finished release** (infrequent or maybe no updates/maintenance if i don't feel like it)
# minimade
A minimaler skin for osu!standard, because - YUGEN - was *more* than enough.

Most icons are from mdi (https://materialdesignicons.com/).
Text is in osifont.

## Compatibility
### Skin
Tested on stable (wine on Arch Linux, all 16:9) and works on McOsu (steam on Arch Linux, Linux) with some differences, and the newly added mode and options buttons don't support custom song selection.
~~also when peppy finishes lazer they should add support for hurd~~

### Building
Tested on Arch Linux (node v16.13.2, npm 8.5.4)

## Building
### Dependencies
 - git
 - node and npm
 - rsvg (needs `rsvg-convert` in path)
 - osifont (https://github.com/hikikomori82/osifont/blob/master/osifont.ttf) (must be installed)

### Steps
 1. `git clone https://github.com/awful-coder/minimade.git`
 2. `cd minimade`
 3. `npm i`
 4. `npm run build` (the `buildscripts` script compiles the build scripts and the `skin` script build the skin, assuming the build scripts were already compiled)

## Contributing
Very open to contributions (including suggestions/issues) of any kind but I'm really not that active and I'm not very experienced.
Especially, if there are any unnecessary details or inefficiencies, please open an issue or PR.
I encourage forking as "minimaid" and replacing things with maid waifus. (i admire people who sacrifice their search history to make weeb skins)

### Details
All SVGs are in SD since they can be upscaled.

## License
Please read LICENSE (and the note i left at the top), but this project is basically under the MIT license.
