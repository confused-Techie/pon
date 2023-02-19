const pon = require("../src/main.js");
const path = require("path");

(async () => {
  const obj = await pon.read(path.resolve("./test/fixtures/temp.pon"));

  console.log(obj);
  console.log(obj.core.value);

})();
