const fs = require("fs");
const Parser = require("./parser.js");

async function read(loc) {

  if (!fs.existsSync(loc)) {
    console.log(`PON file doesn't exist at ${loc}!`);
    return new Error(`PON file doesn't exist at ${loc}!`);
  }

  let file = fs.readFileSync(loc, { encoding: "utf8" });

  let parser = new Parser(file);

  let err = await parser.parse();

  console.log(parser.propertyTypes);
  console.log(parser.looseTree);

  if (typeof err !== "undefined") {
    return err;
  }

  const obj = parser.tree;

  return obj;
}

async function write(config) {

}

module.exports = {
  read,
  write,
};
