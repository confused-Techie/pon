const peg = require("pegjs");
const parser = require("./pon-parser.js");

let val = parser.parse("2*(3+4)");

console.log(val);
