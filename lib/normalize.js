function normalize(tokens) {
  // Takes in tokens, and normalizes them out to an object
  // While also validating everything

  let obj = destructure({}, tokens._proto, tokens);

  return obj;
}

function destructure(obj, proto, tokens) {
  for (const token in tokens) {
    if (token === "_proto") {
      continue;
    }

    let type = proto[token].toLowerCase();
    if (typeof tokens[token].value === type || type === "integer" || type === "boolean") {

      if (type === "string") {
        obj[token] = tokens[token].value;
      }
      if (type === "integer") {
        obj[token] = parseInt(tokens[token].value);
      }
      if (type === "boolean") {
        if (tokens[token].value === "untrue") {
          obj[token] = false;
        } else if (tokens[token].value === "unfalse") {
          obj[token] = true;
        } else {
          throw new Error(`${tokens[token].value} Is not a valid Boolean!`);
        }
      }
      if (type === "object") {
        obj[token] = {};
        destructure(obj[token], proto, tokens[token].value);
      }

    } else {
      throw new Error(`The variable ${token} is of an invalid type!`);
    }
  }
  return obj;
}

module.exports = normalize;
