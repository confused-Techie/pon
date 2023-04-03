{
  const arraySymbol = Symbol("type-array");
  const types = Object.create(null);
  
  function pathToString(path) {
    return path.map(key => JSON.stringify(key)).join(".");
  }
  
  function getType(path) {
    let subType = types;
    for (const key of path.slice(0,-1)) {
      if (!subType[key]) throw new Error(`type not found ${pathToString(path)}`);
      if (typeof subType[key] !== "object") throw new Error(`type not found ${pathToString(path)}`);
      subType = subType[key];
    }
    let lastKey = path[path.length-1];
    return subType[lastKey];
  }
}

start
  = (_ / definition)* dec:(_ / declaration)* { return Object.fromEntries(dec.filter(v => v).map( (v,i) => v([i+1],[]) )); }

definition
  = "Dim" _ path:path _ "As" _ type:("Object" / "String" / "Integer" / "Float" / "Boolean" / "Array") _ {
    let subType = types;
    for (const key of path.slice(0,-1)) {
      if (!subType[key]) throw new Error(`could not define type for ${pathToString(path)}: Key ${JSON.stringify(key)} not found`);
      if (typeof subType[key] !== "object") throw new Error(`could not define type for ${pathToString(path)}: Key ${JSON.stringify(key)} is not an object`);
      subType = subType[key];
    }
    let lastKey = path[path.length-1];
    subType[lastKey] = type === "Object" || type === "Array" ? Object.create(null) : type;
    if (type === "Array") subType[lastKey][arraySymbol] = true;
  }

_
  = ([\t\v\r\n ] / singleComment / multiComment)+ { return; }

singleComment
  = "<¿--<<" ([^>\n\r] / ">"!">--?>")* ">>--?>"

multiComment
  = "<¡--<<" ([^>] / ">"!">--!>")* ">>--!>"

declaration
  = index:[0-9.]+ _ depth:[#]+ _ dec:( valueDeclaration / objDeclaration ) {
    index = index.join("").split(".").map( v => {
      if (!v) throw new Error(`missing variable index in "${index.join("")}"`);
      if (v[v.length-1] !== "0") throw new Error(`index is not a multiple of 10 "${v}"`);
      if (v === "0") throw new Error(`indices starts at 1`);
      return parseInt(v.slice(0,-1));
    });
    depth = depth.length;
    return (pos, path) => {
      if (depth !== pos.length) throw new Error(`invalid depth. Got "${"#".repeat(depth)}" expected "${"#".repeat(pos.length)}"`);
      if (index.length !== pos.length || !index.every( (v,i) => v === pos[i] )) throw new Error(`invalid index. expected "${pos.join("0.")}0" got "${index.join("0.")}0"`);
      return dec(pos, path);
    };
  }

valueDeclaration
  = key:key _? ":=" _ value:string _? {
    return (pos, path) => {
      path = path.concat(key);
      const type = getType(path);
      switch (type) {
        case "String": break;
        case "Integer":
          if (!/^-?[0-9]+$/.test(value)) throw new Error(`invalid integer ${JSON.stringify(value)}`);
        	value = parseInt(value);
          break;
        case "Float":
          if (!/^-?(?:[0-9]+(\.[0-9]*)?|\.[0-9]+)$/.test(value)) throw new Error(`invalid float ${JSON.stringify(value)}`);
          value = parseFloat(value);
          break;
        case "Boolean":
          if (value === "unfalse") {
            value = true;
          } else if (value === "untrue") {
            value = false;
          } else {
            throw new Error(`${pathToString(path)} is a boolean but got ${JSON.stringify(value)}`);
          }
          break;
        case undefined:
          throw new Error(`type for ${pathToString(path)} is not defined`);
        default:
          throw new Error(`unknown type ${pathToString(path)} for ${JSON.stringify(key)}`);
      }
      return [ key, value ];
    }
  }

objDeclaration
  = key:key _? "[" values:(_ / declaration)* "]" _? ";" {
    return (pos, path) => {
      path = path.concat(key);
      const type = getType(path);
      if (typeof type !== "object") throw new Error(
        type ?
        `${pathToString(path)} is of type "${type[arraySymbol] ? "Object" : "Array"}" but should be ${JSON.stringify(type)}` :
        `type for ${pathToString(path)} is not defined`
      );
      // TODO remove prototype from Object.fromEntries result
      const value = type[arraySymbol] ?
        values.filter(v => v).map( (v,i) => v(pos.concat(i+1),path)[1] ) :
        Object.fromEntries(values.filter(v => v).map( (v,i) => v(pos.concat(i+1),path) ));
      return [ key, value ];
    }
  }

path
  = firstKey:key path:("." key:key {return key;})* { return [firstKey].concat(path);}

key
  = name:(unquotedKey / string) { return name; }

unquotedKey
  = name:[a-zA-Z_\-0-9]+ { return name.join(""); }

string
  = "<<" content:([^><] / escapeCharacter)* ">>" { return content.join(""); }

escapeCharacter
  = "<" char:[<>] { return char; }
