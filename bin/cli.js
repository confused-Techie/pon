#!/usr/bin/env node

const pon = require("../lib/pon.js");
const fs = require("fs/promises");

async function input(argv) {
  if (argv.input) {
    return await fs.readFile(argv.input, { encoding: "utf8" });
  } else {
    return await new Promise( resolve => {
      let data = "";
      process.stdin.on("data", chunk => data += chunk );
      process.stdin.on("end", () => resolve(data));
    });
  }
}

async function output(argv, data) {
  if (argv.output) {
    await fs.writeFile(argv.output, data);
  } else {
    console.log(data);
  }
}

require("yargs/yargs")(process.argv.slice(2))
.usage("Usage: $0 <command> [options]")
.command({
  command: "read",
  aliases: ["r"],
  desc: "Read a PON file.",
  async handler(argv) { await output(argv, JSON.stringify(pon.read(await input(argv)))) }
})
.command({
  command: "write",
  aliases: ["w"],
  desc: "Write a PON file.",
  async handler(argv) { await output(argv, pon.write(JSON.parse(await input(argv)))) }
})
.option("i", {
  alias: "input",
  description: "Input File.",
  type: "string"
})
.option("o", {
  alias: "output",
  description: "Output File.",
  type: "string"
})
.strict()
.demandCommand(1).parse();
