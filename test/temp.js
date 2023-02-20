//const pon = require("../src/main.js");
const path = require("path");
const fs = require("fs");
const parse = require("../src/parse.js");

(async () => {
  //const obj = await pon.read(path.resolve("./test/fixtures/temp.pon"));

  //console.log(obj);
  //console.log(obj.core.value);

  const file = fs.readFileSync(path.resolve("./test/fixtures/temp.pon"), { encoding: "utf8" });

  parse(file, { source: "./test/fixtures/temp.pon" });

  console.log(tokenList);

})();
