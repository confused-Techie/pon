//const pon = require("../src/main.js");
const path = require("path");
const fs = require("fs");
const parser = require("../src/parser.js");
const tokenize = require("../src/tokenize.js");

(async () => {
  //const obj = await pon.read(path.resolve("./test/fixtures/temp.pon"));

  //console.log(obj);
  //console.log(obj.core.value);

  const file = fs.readFileSync(path.resolve("./test/fixtures/temp.pon"), { encoding: "utf8" });

  const parsed = parser(file, { source: "./test/fixtures/temp.pon" });
  //const parsed = tokenize.tokenize(file, { source: "./test/fixutres/temp.pon" });
  console.log(parsed);

})();
