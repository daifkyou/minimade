/*
NOTE
I really suck at building things, if you can figure out a better way/know a better build system please open an issue.
*/

const ktw = require('ktw');
const custom = require('./custom');

ktw.Cache.Load("./cache.json");
custom.Config.Load();



new custom.RenderGraphicTask("./src/graphics/gameplay/osu/approachcircle.svg", "./build", "approachcircle").run().then(ktw.Cache.Save);