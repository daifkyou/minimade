**probably won't be active after finished release** (infrequent or maybe no updates/maintenance if i don't feel like it)
# minimade
A minimaler skin for osu!standard, because - YUGEN - was more than enough.

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
 - node and npm
 - rsvg (we need `rsvg-convert` in path)
 - osifont (https://github.com/hikikomori82/osifont/blob/master/osifont.ttf) must be installed
 - `zip`
 - `expr`

### Steps
 1. `git clone https://github.com/awful-coder/minimade.git`
 2. `cd minimade`
 3. `npm i`
 4. `npm run buildscripts`
 5. `npm run build`

## Contributing
Open to contributions of any kind but I'm really not that active and I'm not very experienced.
I suggest forking it as "minimaid" and replacing things with maid waifus (this is outside my field of "expertise")

## License
See LICENSE.
