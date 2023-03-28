const parser = require("./pon-parser.js");

function tokenize(input) {
  // Takes text based input to tokenize

  try {
    let ast = parser.parse(input);

    // Now we have to convert the AST into an actual object
    let obj = convert(ast);

    return obj;

  } catch(err) {
    throw err;
  }
}

function convert(ast) {
  // The AST we get from PegJS is ugly, so this might be ugly

  let obj = { _proto: {} };

  while(ast.length > 0) {
    let node = ast[0];

    //console.log(`AST: ${node.kind}`);

    if (node.kind === "whitespace") {
      ast.shift();
      continue;
    }
    if (node.kind === "definition") {
      obj._proto[node.key] = node.type;
    }
    if (node.kind === "singleLineComment") {
      ast.shift();
      continue;
    }
    if (node.kind === "multiLineComment") {
      ast.shift();
      continue;
    }
    if (node.kind === "objectEnd") {
      ast.shift();
      continue;
    }
    if (node.kind === "declaration") {

      if (node.depth.length === 1) {
        obj[node.key] = {
          _index: node.index,
          _depth: node.depth,
        };

        if (node.declaration.kind === "valueDefinition") {
          obj[node.key].value = node.declaration.value;
        }
        if (node.declaration.kind === "objectStart") {
          obj[node.key].value = {};
        }

      } else {
        descendObj(node, obj);
      }

    }

    ast.shift();
  }

  return obj;
}

function descendObj(node, obj) {
  // Used for finding the right object to append new data into
  for (const n in obj) {
    if (
      node.index.startsWith(obj[n]._index) &&
      node.depth.length === obj[n]._depth.length + 1
    ) {
      // This ensures that this object should in fact be a descendent of this object,
      // but does not tell use which descendent that is.
      if (parseInt(node.index.split('.')[node.index.split('.').length-1]) === 10) {
        // This is the first index

        if (node.declaration.kind === "valueDefinition") {
          obj[n].value[node.key] = {
            value: node.declaration.value,
            _index: node.index,
            _depth: node.depth,
          }
        }
        if (node.declaration.kind === "objectStart") {
          obj[n].value[node.key] = {
            _index: node.index,
            _depth: node.depth,
            value: {}
          };
        }

      }
      if (parseInt(node.index.split('.')[node.index.split('.').length-1]) > 10) {
        if (node.declaration.kind === "valueDefinition") {
          obj[n].value[node.key] = {
            value: node.declaration.value,
            _index: node.index,
            _depth: node.depth,
          };
        }
        if (node.declaration.kind === "objectStart") {
          obj[n].value[node.key] = {
            _index: node.index,
            _depth: node.depth,
            value: {}
          };
        }
      }
    } else if (
      node.index.startsWith(obj[n]._index) &&
      node.depth.length > obj[n]._depth.length + 1
    ) {
      descendObj(node, obj[n].value);
    }
  }
  return;
}

module.exports = tokenize;
