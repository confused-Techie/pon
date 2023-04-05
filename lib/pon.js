const parser = require("./pon-parser.js");
const write = require("./write.js");
const errors = require("./errors.js");

module.exports = {
  read: errors.wrap(str => parser.parse(str)),
  write: errors.wrap(obj => write(obj)),
};
