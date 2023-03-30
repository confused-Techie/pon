function create(input) {
  // Converts a JavaScript Object into PON

  let declarations = [];
  let obj = destructure({}, declarations, input);

  let main = encodeValues(obj, [], '', '0', 0);

  let decs = declarations.join("\n");
  let mains = main.join("\n");

  let file = decs + "\n\n" + mains;

  return file;
}

function destructure(obj, declarations, input) {
  for (const node in input) {

    if (typeof input[node] === "string") {
      declarations.push(`Dim ${node} As String`);
      obj[node] = `${node} := <<${input[node]}>>`;
    }
    if (typeof input[node] === "boolean") {
      declarations.push(`Dim ${node} As Boolean`);
      if (input[node]) {
        obj[node] = `${node} := <<unfalse>>`;
      } else {
        obj[node] = `${node} := <<untrue>>`;
      }
    }
    if (typeof input[node] === "number") {
      declarations.push(`Dim ${node} As Integer`);
      obj[node] = `${node} := <<${input[node]}>>`;
    }
    if (typeof input[node] === "object") {
      declarations.push(`Dim ${node} As Object`);
      obj[node] = {};
      destructure(obj[node], declarations, input[node]);
    }

  }
  return obj;
}

function encodeValues(val, res, parentNode, siblingNode, depth) {
  for (const node in val) {
    if (typeof val[node] !== "object") {
      res.push(`${getDepthIndent(depth)}${parentNode}${parseInt(siblingNode.replace(".", "")) + 10} ${getDepthMarker(depth)} ${val[node]}`);
      siblingNode = `${parseInt(siblingNode.replace(".", "")) + 10}`;
    } else {
      // We've got an object
      res.push(`${getDepthIndent(depth)}${parentNode}${parseInt(siblingNode.replace(".", "")) + 10} ${getDepthMarker(depth)} <<${node}>> [`);
      encodeValues(val[node], res, `${parseInt(siblingNode.replace(".", "")) + 10}.`, '0', depth + 1);
      res.push(`${getDepthIndent(depth)}];`);
    }
  }
  return res;
}

function getDepthMarker(depth) {
  let marker = "#";
  for (let i = 0; i < depth; i++) {
    marker += "#";
  }
  return marker;
}

function getDepthIndent(depth) {
  let indent = "";
  for (let i = 0; i < depth; i++) {
    indent += "  ";
  }
  return indent;
}

module.exports = create;
