**probably won't be active after finished release** (infrequent or maybe no updates/maintenance if i don't feel like it)
# minimade glow
A minimaler skin for osu!standard, because - YUGEN - was more than enough.

glows still look nice so i added those

Most icons are from mdi (https://materialdesignicons.com/).
Text is in osifont.

## Compatibility
### Skin
Tested on stable (wine on Arch Linux, all 16:9) and works on McOsu (steam on Arch Linux, Linux) with some differences, and the newly added mode and options buttons don't support custom song selection

### Building
Tested on Arch Linux (bash, gmake)

## Building
All svgs are in SD size since they can be upscaled.

### Dependencies
 - git
 - make (e.g. gmake)
 - rsvg (needs `rsvg-convert` in path)
 - osifont.ttf (https://github.com/hikikomori82/osifont/blob/master/osifont.ttf) must be installed
 - `zip`
 - `expr`

### Steps
 1. `git clone https://github.com/awful-coder/minimade-glow.git`
 2. `cd minimade-glow`
 3. `make` (target `1x` for SD, `2x` for HD, `both` for both resolutions (default))
 4. `make export` (set SKINNAME to the base filename of your osz, default "minimade-glow")

## Contributing
Open to contributions of any kind but I'm really not that active and I'm not very experienced.
I suggest forking it as "minimaid" and replacing things with maid waifus (this is outside my field of "expertise")

## License
See LICENSE.
