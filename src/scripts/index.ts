#!/usr/bin/env -S node --enable-source-maps

/*
NOTE
I really suck at building things, if you can figure out a better way/know a better build system please open an issue.
maybe we can do a json-based thing where there is like a json for input and output to cut down on boilerplate
honestly im really uncomfortable with the current build thing and i feel like im going to be judged for making it this bad
*/

import arg from "arg";

const flags = arg({
    "--help": Boolean,
    "--version": Boolean,
    "--config": String,
    "--cache": String,
    "--clean": Boolean,

    "-h": "--help",
    "-v": "--version",
    "-o": "--config",
    "-a": "--cache",
    "-c": "--clean"
});

if (flags["--help"]) {
    console.log(`minimade build script (it builds minimade ._.)

Usage: [script, usually npm run skin --] [options]

Accepted Options:
  --help    or -h: displays this help message
  --version or -v: does nothing because it's kinda hard to have a "version", if you really wanted you could check the repo
  --config  or -o: path to config file (config/config.jsonc by default)
  --cache   or -a: path to cache file (cache/cache.json by default)
  --clean   or -c: delete the cache and build`);
} else if (flags["--version"]) {
    import("./version.js");
} else {
    const configPath = flags["--config"] as string ?? "config/config.jsonc";
    const cachePath = flags["--cache"] as string ?? "cache/cache.json";

    if (flags["--clean"]) {
        (await import("./clean.js")).default(cachePath, configPath);
    } else {
        (await import("./building/index.js")).default(cachePath, configPath);
    }
}
