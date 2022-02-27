// a really ugly job
// maybe i should make this look nicer later

import * as fs from "fs";
import * as path from "path";

fs.readdir("cache", (err, files) => { // this isnt copyright infringement of stack overflow because its so common i wrote it myself first before checking the answer
    if (err) throw err;

    files.forEach(file => fs.rm(path.join("cache", file), err => {
        if (err) throw err;
    }));
});

fs.rm("build", {
    recursive: true
}, err => {
    if (err) throw err;
});
