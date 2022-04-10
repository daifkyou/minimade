// a really ugly job
// maybe i should make this look nicer later

import fs from "fs";

import { parse } from "jsonc-parser";
import type { ParseError } from "jsonc-parser";

export default async (cachePath: string, configPath: string) => {
    console.log("cleaning...");

    const errors: ParseError[] = [];
    const c = parse(await fs.promises.readFile(configPath, "utf8"), errors);
    if (errors.length > 0) console.warn(errors);

    await Promise.all([
        fs.promises.rm(c.outputDirectory, { recursive: true }),
        fs.promises.rm(cachePath)
    ].map(x => x.catch(err => console.warn(err))));
}
