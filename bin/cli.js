#!/usr/bin/env node

const pon = require("../lib/pon.js");
const fs = require("fs");
const path = require("path");

const argv = require("yargs/yargs")(process.argv.slice(2))
.usage("Usage: $0 <command> [options]")
.command(
  "pon",
  "Read or Write Pulsar Object Notation Files"
)
.option("r", {
  alias: "read",
  description: "Read a PON file.",
  type: "boolean"
})
.option("w", {
  alias: "write",
  description: "Write a PON file.",
  type: "boolean"
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
.options("t", {
  alias: "time",
  description: "Output how long the request takes.",
  type: "boolean"
})
.options("raw", {
  description: "Pass raw values via the CLI rather, than providing a path to a file.",
  type: "boolean"
}).argv;

let returnData = false;
let start = performance.now();

if (argv.write) {
  if (argv.raw) {
    returnData = pon.write(argv.input);
  } else if (argv.input) {
    returnData = pon.write(path.resolve(argv.input), { path: true });
  }

} else if (argv.read) {

  if (argv.raw) {
    returnData = pon.read(argv.input);
  } else if (argv.input) {
    returnData = pon.read(path.resolve(argv.input), { path: true });
  }
} else {
  throw new Error("Unknown operation requested.");
}

if (typeof argv.output === "string") {
  if (!returnData) {
    throw new Error("Unable to process command");
  }

  fs.writeFileSync(path.resolve(argv.output), returnData);

  if (argv.time) {
    console.log(`Total Time: ${performance.now() - start}ms`);
  }
  process.exit(0);

} else {
  if (!returnData) {
    // Return data never got set.
    throw new Error("Unable to process command.");
  }
  if (argv.time) {
    console.log(`Total Time: ${performance.now() - start}ms`);
  }
  console.log(returnData);
  process.exit(0);
}
