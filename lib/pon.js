const parser = require("./pon-parser.js");
const create = require("./write.js");

module.exports = {
  read: str => parser.parse(str),
  write: obj => create(obj),
};
