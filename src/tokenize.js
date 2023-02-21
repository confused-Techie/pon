const location = require("./location.js");
const substring = require("./substring.js");

const tokenTypes = {
  TYPE_DEFINITION: 0,   // Dim
  TYPE_ASSIGNMENT: 1,   // As
  TRUE: 2,              // unfalse
  FALSE: 3,             // untrue
  NULL: 4,              // null
  TYPE_OBJECT: 5,       // Object
  TYPE_STRING: 6,       // String
  TYPE_INTEGER: 7,      // Integer
  TYPE_BOOLEAN: 8,      // Boolean
  TYPE_FLOAT: 9,        // Float
  LEFT_BRACKET: 10,     // [
  RIGHT_BRACKET: 11,    // ]
  POUND: 12,            // #
  QUESTION_MARK: 13,    // ?
  INVERTED_QUESTION_MARK: 14,   // ¿
  EXCLAMATION: 15,      // !
  INVERTED_EXCLAMATION: 16,     // ¡
  PERIOD: 17,           // .
  DASH: 18,             // -
  SEMICOLON: 19,        // ;
  COLON: 20,            // :
  EQUALS: 21,           // =
  STRING: 22,           //
  NUMBER: 23,           //
  LESS_THAN: 24,        // <
  GREATER_THAN: 25,     // >
};

const punctuatorTokensMap = { // Lexeme: Token
  '[': tokenTypes.LEFT_BRACKET,
  ']': tokenTypes.RIGHT_BRACKET,
  '#': tokenTypes.POUND,
  '?': tokenTypes.QUESTION_MARK,
  '¿': tokenTypes.INVERTED_QUESTION_MARK,
  '!': tokenTypes.EXCLAMATION,
  '¡': tokenTypes.INVERTED_EXCLAMATION,
  '.': tokenTypes.PERIOD,
  '-': tokenTypes.DASH,
  ';': tokenTypes.SEMICOLON,
  ':': tokenTypes.COLON,
  '=': tokenTypes.EQUALS,
  '<': tokenTypes.LESS_THAN,
  '>': tokenTypes.GREATER_THAN,
};

const keywordTokensMap = { // Lexeme: Token
  "Dim": tokenTypes.TYPE_DEFINITION,
  "As": tokenTypes.TYPE_ASSIGNMENT,
  "unfalse": tokenTypes.TRUE,
  "untrue": tokenTypes.FALSE,
  "null": tokenTypes.NULL,
  "Object": tokenTypes.TYPE_OBJECT,
  "String": tokenTypes.TYPE_STRING,
  "Integer": tokenTypes.TYPE_INTEGER,
  "Boolean": tokenTypes.TYPE_BOOLEAN,
  "Float": tokenTypes.TYPE_FLOAT
};

const stringStates = {
  _START_: 0,
  START_QUOTE_OR_CHAR: 1,
  ESCAPE: 2
};

const escapes = {
  '"': 0,       // Quotation mask
  '\\': 1,      // Reverse solidus
  '/': 2,       // Solidus
  'b': 3,       // Backspace
  'f': 4,       // Form Feed
  'n': 5,       // New line
  'r': 6,       // Carriage return
  't': 7,       // Horizontal tab
  'u': 8        // 4 hexadecimal digits
};

const numberStates = {
  _START_: 0,
  MINUS: 1,
  ZERO: 2,
  DIGIT: 3,
  POINT: 4,
  DIGIT_FRACTION: 5,
  EXP: 6,
  EXP_DIGIT_OR_SIGN: 7
};

// HELPERS

function isDigit1to9(char) {
  return char >= '1' && char <= '9';
}

function isDigit(char) {
  return char >= '0' && char <= '9';
}

function isHex(char) {
  return (
    isDigit(char) ||
    (char >= 'a' && char <= 'f') ||
    (char >= 'A' && char <= 'F')
  );
}

function isExp(char) {
  return char === 'e' || char === 'E';
}

// PARSERS

function parseWhitespace(input, index, line, column) {
  const char = input.charAt(index);

  if (char === '\r') { // CRLF (Windows)
    index ++;
    line ++;
    column = 1;
    if (input.charAt(index) === '\n') { // CRLF (Windows)
      index ++;
    }
  } else if (char === '\n') { // LF (MacOS)
    index ++;
    line ++;
    column = 1;
  } else if (char === '\t' || char === ' ') {
    index ++;
    column ++;
  } else {
    return null;
  }

  return {
    index,
    line,
    column
  };
}

function parseChar(input, index, line, column) {
  const char = input.charAt(index);

  if (char in punctuatorTokensMap) {
    return {
      type: punctuatorTokensMap[char],
      line,
      column: column + 1,
      index: index + 1,
      value: null
    };
  }

  return null;
}

function parseKeyword(input, index, line, column) {
  for (const name in keywordTokensMap) {
    if (keywordTokensMap.hasOwnProperty(name) && input.substr(index, name.length) === name) {
      return {
        type: keywordTokensMap[name],
        line,
        column: column + name.length,
        index: index + name.length,
        value: name
      };
    }
  }

  return null;
}

function parseString(input, index, line, column) {
  const startIndex = index;
  let buffer = '';
  let state = stringStates._START_;

  while (index < input.length) {
    const char = input.charAt(index);
    const secondChar = input.charAt(index + 1);

    switch(state) {
      case stringStates._START_: {
        if (char === '<' && secondChar === '<') {
          index = index + 2;
          state = stringStates.START_QUOTE_OR_CHAR;
        } else {
          return null;
        }
        break;
      }

      case stringStates.START_QUOTE_OR_CHAR: {
        if (char === '\\') {
          buffer += char;
          index = index + 1;
          state = stringStates.ESCAPE;
        } else if (char === '>' && secondChar === '>') {
          index = index + 2;
          return {
            type: tokenTypes.STRING,
            line,
            column: column + index - startIndex,
            index,
            value: input.slice(startIndex, index)
          };
        } else {
          buffer += char;
          index = index + 1;
        }
        break;
      }

      case stringStates.ESCAPE: {
        if (char in escapes) {
          buffer += char;
          index ++;
          if (char === 'u') {
            for (let i = 0; i < 4; i++) {
              const curChar = input.charAt(index);
              if (curChar && isHex(curChar)) {
                buffer += curChar;
                index ++;
              } else {
                return null;
              }
            }
          }
          state = stringStates.START_QUOTE_OR_CHAR;
        } else {
          return null;
        }
        break;
      }
    }
  }
}

function parseNumber(input, index, line, column) {
  const startIndex = index;
  let passedValueIndex = index;
  let state = numberStates._START_;

  iterator: while(index < input.length) {
    const char = input.charAt(index);

    switch(state) {
      case numberStates._START_: {
        if (char === '-') {
          state = numberStates.MINUS;
        } else if (char === '0') {
          passedValueIndex = index + 1;
          state = numberStates.ZERO;
        } else if (isDigit1to9(char)) {
          passedValueIndex = index + 1;
          state = numberStates.DIGIT;
        } else {
          return null;
        }
        break;
      }

      case numberStates.MINUS: {
        if (char === '0') {
          passedValueIndex = index + 1;
          state = numberStates.ZERO;
        } else if (isDigit1to9(char)) {
          passedValueIndex = index + 1;
          state = numberStates.DIGIT;
        } else {
          return null;
        }
        break;
      }

      case numberStates.ZERO: {
        if (char === '.') {
          state = numberStates.POINT;
        } else if (isExp(char)) {
          state = numberStates.EXP;
        } else {
          break iterator;
        }
        break;
      }

      case numberStates.DIGIT: {
        if (isDigit(char)) {
          passedValueIndex = index + 1;
        } else if (char === '.') {
          state = numberStates.POINT;
        } else if (isExp(char)) {
          state = numberStates.EXP;
        } else {
          break iterator;
        }
        break;
      }

      case numberStates.POINT: {
        if (isDigit(char)) {
          passedValueIndex = index + 1;
          state = numberStates.DIGIT_FRACTION;
        } else {
          break iterator;
        }
        break;
      }

      case numberStates.DIGIT_FRACTION: {
        if (isDigit(char)) {
          passedValueIndex = index + 1;
        } else if (isExp(char)) {
          state = numberStates.EXP;
        } else {
          break iterator;
        }
        break;
      }

      case numberStates.EXP: {
        if (char === '+' || char === '-') {
          state = numberStates.EXP_DIGIT_OR_SIGN;
        } else if (isDigit(char)) {
          passedValueIndex = index + 1;
          state = numberStates.EXP_DIGIT_OR_SIGN;
        } else {
          break iterator;
        }
        break;
      }

      case numberStates.EXP_DIGIT_OR_SIGN: {
        if (isDigit(char)) {
          passedValueIndex = index + 1;
        } else {
          break iterator;
        }
        break;
      }
    }

    index ++;
  }

  if (passedValueIndex > 0) {
    return {
      type: tokenTypes.NUMBER,
      line,
      column: column + passedValueIndex - startIndex,
      index: passedValueIndex,
      value: input.slice(startIndex, passedValueIndex)
    };
  }

  return null;
}

const tokenize = (input, settings) => {
  let line = 1;
  let column = 1;
  let index = 0;
  const tokens = [];

  while (index < input.length) {
    const args = [input, index, line, column];
    const whitespace = parseWhitespace(...args);

    if (whitespace) {
      index = whitespace.index;
      line = whitespace.line;
      column = whitespace.column;
      continue;
    }

    const matched = (
      parseString(...args) || // Important to parse strings first
                              // As string << is also a keyword
      parseChar(...args) ||
      parseKeyword(...args) ||
      parseNumber(...args)
    );

    if (matched) {
      const token = {
        type: matched.type,
        value: matched.value,
        loc: location(
          line,
          column,
          index,
          matched.line,
          matched.column,
          matched.index,
          settings.source
        )
      };

      tokens.push(token);
      index = matched.index;
      line = matched.line;
      column = matched.column;

    } else {
      console.log(tokens);
      throw new Error(`Unexpected Symbol: ${substring(input, index, index + 1)} - ${line} - ${column}`);
    }
  }

  return tokens;
};

module.exports = {
  tokenize,
  tokenTypes,
};
