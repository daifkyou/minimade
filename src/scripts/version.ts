import fs from "fs";

const info = JSON.parse(await fs.promises.readFile("package.json", "utf8"));
console.log(`${info.name} written by ${info.author} version ${info.version} under license ${info.license}

${info.description}`);
