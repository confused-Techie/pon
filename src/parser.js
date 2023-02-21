const { tokenize, tokenTypes } = require("./tokenize.js");
const substring = require("./substring.js");
const location = require("./location.js");

const defaultSettings = {
  loc: true,
  source: null
};

function parseLiteral(input, tokenList, index, settings) {
  // literal: STRING | NUMBER | TRUE | FALSE | NULL
  const token = tokenList[index];
  let value = null;

  switch(token.type) {
    case tokenTypes.STRING: {
      value = parseString(input.slice(token.loc.start.offset + 1, token.loc.end.offset - 1));
      break;
    }
    case tokenTypes.NUMBER: {
      value = Number(token.value);
      break;
    }
    case tokenTypes.TRUE: {
      value = true;
      break;
    }
    case tokenTypes.FALSE: {
      value = false;
      break;
    }
    case tokenTypes.NULL: {
      value = null;
      break;
    }
    default: {
      return null;
    }
  }

  const literal = {
    type: 'Literal',
    value,
    raw: token.value
  };
  if (settings.loc) {
    literal.loc = token.loc;
  }
  return {
    value: literal,
    index: index + 1
  };
}

function parseObject() {
  return null;
}

function parseComment(input, tokenList, index, settings) {
  // comment: LESS_THAN -> INVERTED_QUESTION_MARK -> DASH -> DASH ->
  // STRING -> DASH -> DASH -> QUESTION_MARK -> GREATER_THAN
  let value = null;

  if (
    tokenList[index] === tokenTypes.LESS_THAN &&
    tokenList[index + 1] === tokenTypes.INVERTED_QUESTION_MARK &&
    tokenList[index + 2] === tokenTypes.DASH &&
    tokenList[index + 3] === tokenTypes.DASH &&
    tokenList[index + 4] === tokenTypes.STRING &&
    tokenList[index + 5] === tokenTypes.DASH &&
    tokenList[index + 6] === tokenTypes.DASH &&
    tokenList[index + 7] === tokenTypes.QUESTION_MARK &&
    tokenList[index + 8] === tokenTypes.GREATER_THAN
  ) {
    value = parseString(input.slice(tokenList[index+4].loc.start.offset + 1, tokenList[index+4].loc.end.offset -1));
  } else {
    return null;
  }

  const comment = {
    type: 'Comment',
    value,
    //raw: token.value
  };
  if (settings.loc) {
    comment.loc = token.loc;
  }

  return {
    value: comment,
    index: index + 9
  };
}

function parseDefinition(input, tokenList, index, settings) {
  // definition: TYPE_DEFINITION -> STRING -> TYPE_ASSIGNMENT -> TYPE_X
  let kind = null;
  let key = null;

  if (
    tokenList[index].type === tokenTypes.TYPE_DEFINITION &&
    tokenList[index + 1].type === tokenTypes.STRING &&
    tokenList[index + 2].type === tokenTypes.TYPE_ASSIGNMENT
  ) {
    key = tokenList[index + 1].value;
    kind = tokenList[index + 3].value;
  } else {
    return null;
  }

  const definition = {
    type: 'Definition',
    key,
    kind,
    //raw: token.value
  };

  return {
    value: definition,
    index: index + 4
  };
}

function parser(input, settings) {
  settings = Object.assign({}, defaultSettings, settings);

  const tokenList = tokenize(input, settings);

  if (tokenList.length === 0) {
    throw new Error(`Unable to parse: ${settings.source}`);
  }

  let parsed = [];
  let index = 0;
  console.log(tokenList);
  while (index < tokenList.length) {
    console.log(`While Calling with: ${index} - ${tokenList[index].type}`);
    const value = (
      parseLiteral(input, tokenList, index, settings) ||
      parseObject(input, tokenList, index, settings) ||
      parseComment(input, tokenList, index, settings) ||
      parseDefinition(input, tokenList, index, settings)
    );

    if (value) {
      parsed.push(value);
      index = value.index;
    } else {
      console.log(parsed);
      throw new Error(`Appease the true god Pulsy!`);
    }
  }

  return parsed;
}

module.exports = parser;
