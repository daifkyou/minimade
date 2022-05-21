**maybe won't be active after finished release** (infrequent or maybe no updates/maintenance if i don't feel like it)
# minimade
*a consistently minimal skin*

Most icons are from mdi (https://materialdesignicons.com/).
Text is in osifont.

## Compatibility
### Skin
Tested on stable (wine on Arch Linux, all 16:9) and works on McOsu (steam on Arch Linux, Linux) with some differences, and the newly added mode and options buttons don't support custom song selection.

### Building
Tested on Arch Linux (Python 3.10.4, pip 21.0, SCons 4.3.0, CairoSVG 2.5.2, Git 2.36.1)

## Building
### Ingredients (install these)
 - Git
 - Python 3 and modules in requirements.txt
 - osifont (https://github.com/hikikomori82/osifont)

### Directions
 1. Clone the repo: `$ git clone https://github.com/awful-coder/minimade.git` then `cd minimade`
 2. Install the dependencies (usually with `pip3 install -r requirements.txt`)
 3. Run SCons (build the skin): `scons` (optionally use `scons -h` to see flags you can use to customize the build)
 4. Install the skin
    1. (The cool way) Copy or symlink the build directory into your osu! Skins directory
    (e.g. on my Arch system on ext4 with minimade in my home directory and my osu!, using Katoumegumi's osu! wine guide, directory symlinked to ~/osufolder, this is `$ ln -s $HOME/minimade/build ~/osufolder/Skins/`)
    2. (The packaging way) TODO: Get SCons to give me a .osk

## Contributing
Very open to contributions (including suggestions/issues) of any kind but I'm really not that active and I'm not very experienced.
Especially open to improving non-pythonic/non-scons-ic/sucky build scripts and fixing inefficiencies.
I suggest forking as "minimaid" and replacing things with maid waifus. (i admire people who sacrifice their search history to make weeb skins)

### Details
All SVGs are in SD since they can be upscaled.

## License
Please read LICENSE (and the note i left at the top), but this project is basically under the MIT license.

## P.S.
The name of the skin is actually a misnomer because I was using make before I switched to SCons so that's a thing
