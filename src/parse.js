const { tokenize, tokenTypes } = require("./tokenize.js");
const substring = require("./substring.js");
const location = require("./location.js");

const defaultSettings = {
  loc: true,
  source: null
};

function parse(input, settings) {
  settings = Object.assign({}, defaultSettings, settings);

  const tokenList = tokenize(input, settings);

  if (tokenList.length === 0) {
    throw new Error(`Unable to parse: ${settings.source}`);
  }

  console.log(tokenList);
  process.exit(0);
  //const value = parseValue(input, tokenList, 0, settings);

  if (value.index === tokenList.length) {
    return value.value;
  }

  const token = tokenList[value.index];

  throw new Error(`Unexpected token: ${substring(input, token.loc.start.offset, token.loc.end.offset)} ${settings.source}-${token.loc.start.line}:${token.loc.start.column}`);
}

module.exports = parse;
