**maybe won't be active after finished release** (infrequent or maybe no updates/maintenance if i don't feel like it)
# minimade
*a **consistently** minimal skin*

Most icons are from mdi (https://materialdesignicons.com/).
Text is in osifont.

## Compatibility
### Skin
Tested on stable (wine on Arch Linux, all 16:9) and works on McOsu (steam on Arch Linux, Linux) with some differences, and the newly added mode and options buttons don't support custom song selection.

### Building
Tested on Arch Linux (Python 3.10.4, pip 21.0, SCons 4.3.0, CairoSVG 2.5.2, Git 2.36.1)

## ~~Building~~ Recipe
Makes theoretically infinite servings.
### ~~Dependencies~~ Ingredients (install these)
 - Git
 - Python 3 and modules in requirements.txt
 - osifont (https://github.com/hikikomori82/osifont)

### Directions
 1. Clone the repo: `$ git clone https://github.com/awful-coder/minimade.git` then `cd minimade`
 2. Install the dependencies (usually with `pip3 install -r requirements.txt`)
 3. Run SCons (build the skin): `scons` (optionally see `scons -h` to explore flags you can use to customize the build)
 4. ~~Install~~ Enjoy the skin
    1. (The cool way) Symlink the build directory into your skins directory (i.e. plate)
    (e.g. on my Arch system on ext4 with minimade in my home directory and my osu!, using Katoumegumi's osu! wine guide, directory symlinked to ~/osufolder, this is `$ ln -s $HOME/minimade/build ~/osufolder/Skins/`)
    2. (The "I use FAT32" way) See "The cool way" but mentally replace "symlink" with "copy."
    2. (The prepackaged way) Zip the build directory and rename it to end with an .osk extension. Share with a friend :)

## Contributing
Very open to contributions (including suggestions/issues) of any kind but I'm really not that active and I'm not very experienced.
Especially open to improving non-pythonic/non-scons-ic/sucky build scripts and fixing inefficiencies.
Improvements to source directory tree would also helpful.

I would also suggest forking as "minimaid" and replacing things with maid waifus.

### Details
All SVGs are in SD since they can be upscaled.

## License
Please see LICENSE; this project is basically under the MIT license.

## Screenshots
| Subject | Image |
| --- | --- |
| Main Menu | no supporter no ss welp |
| Song Select (16-9) | ![selection](https://user-images.githubusercontent.com/62647827/174412433-09d9d51f-451c-424a-8a49-caef6beafb66.png) |
| Mod Select | ![mods](https://user-images.githubusercontent.com/62647827/174412962-36acca33-91df-4cea-9ecd-35c78e9e91f1.png) |
| Options | ![options](https://user-images.githubusercontent.com/62647827/174412778-80bfc51a-8ce4-4708-b20b-b61593e7aff1.png) |
| Skip | ![skip](https://user-images.githubusercontent.com/62647827/174412978-e4fc916d-06fe-4174-82e1-89bb39424162.png) |
| Standard | ![gameplaynt](https://user-images.githubusercontent.com/62647827/174436427-4654c6e8-cc90-4739-9fd9-d043dc977d9e.png)<br>![spinner](https://user-images.githubusercontent.com/62647827/175786390-5bb3af51-07d7-415b-a473-b9f6f3cb09a3.png) |
| Taiko | ![tkcircles](https://user-images.githubusercontent.com/62647827/175785320-1a5b27d3-0e00-4bac-8fbd-bf4212cdc4ae.png)<br>![tkspinner](https://user-images.githubusercontent.com/62647827/175785347-5b5f9c5a-a642-42ce-8a8a-1a393bbe9024.png)<br>![tkslider](https://user-images.githubusercontent.com/62647827/175785362-4c68d002-f020-4ba3-8b0c-4a2e53618eee.png) |
| Pause | ![pause](https://user-images.githubusercontent.com/62647827/174436705-8509e6a4-9d61-4a01-abf0-c4fc71cc63d9.png) |
| Fail | ![fail](https://user-images.githubusercontent.com/62647827/174436678-adf38f9b-bc34-439f-a005-5977f0460da1.png) |
| Ranking (standard-pretty version) | ![ranking](https://user-images.githubusercontent.com/62647827/174413050-370d8d01-6773-4ac9-981f-4f94f57c66d4.png)
| Results (16-9) | ![results](https://user-images.githubusercontent.com/62647827/174412920-b72d0900-06ac-41f2-8e52-b6256615906e.png) |
| Editor | ![editor](https://user-images.githubusercontent.com/62647827/174436436-1e075593-78b2-481d-a808-b7b9c1939100.png) |

## P.S.
The name of the skin is actually a misnomer because I was using make before I switched to SCons so that's a thing
