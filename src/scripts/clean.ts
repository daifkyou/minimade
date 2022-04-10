#!/usr/bin/env -S node --enable-source-maps

// a really ugly job
// maybe i should make this look nicer later

import fs from "fs";

fs.rm("build", { recursive: true }, err => {
    if (err) console.error(err);
});

fs.rm("cache", { recursive: true }, err => {
    if (err) console.error(err);
});
