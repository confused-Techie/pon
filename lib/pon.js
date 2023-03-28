const fs = require("fs");
const tokenize = require("./tokenize.js");
const normalize = require("./normalize.js");
const create = require("./write.js");

// Valid values of opts:
//  * path - Means a path is being passed, rather than raw data
//  * ast - Means to return only the AST
function read(data, opts) {
  opts ??= {};

  let contents = data;

  if (opts.path) {
    // We are supposed to read from the filesystem ourselves
    if (data.split(".")[data.split(".").length-1] !== "pon") {
      throw new Error("This file does not seem to be a valid PON filetype.");
    }

    contents = fs.readFileSync(data, { encoding: "utf8" });
  }

  let tokens = tokenize(contents);

  if (opts.ast) {
    return tokens;
  }

  let normalized = normalize(tokens);

  return normalized;
}

function write(obj, opts) {
  // Takes a JSON object, and returns string PON
  let file = create(obj);

  return file;
}

module.exports = {
  read,
  write,
};
