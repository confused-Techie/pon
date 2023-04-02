{
  const types = {};
}

start
  = (_ / definition)* dec:(_ / declaration)* { return Object.fromEntries(dec.filter(v => v).map( (v,i) => v(i+1) )); }

definition
  = "Dim" _ name:definitionPath _ "As" _ type:[a-zA-z]+ _ {
    // throw new Error(name.join(","));
    type = type.join("");
    if (!["Object","String","Integer","Float","Boolean"].includes(type)) throw new Error(`unknown type ${JSON.stringify(type)} for ${JSON.stringify(name)}`);
    types[name] = type;
  }

definitionPath
  = firstId:identifier ids:("." id:identifier {return id;})* {return [firstId].concat(ids);}

_
  = ([\s\r\n ] / singleComment / multiComment)+ { return; }

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
    return (...posIndex) => {
      if (depth !== posIndex.length) throw new Error(`invalid depth. Got "${"#".repeat(depth)}" expected "${"#".repeat(posIndex.length)}"`);
      if (index.length !== posIndex.length || !index.every( (v,i) => v === posIndex[i] )) throw new Error(`invalid index. expected "${posIndex.join("0.")}0" got "${index.join("0.")}0"`);
      return dec(...posIndex);
    };
  }

valueDeclaration
  = name:identifier _? ":=" _ value:string _? {
    return (...posIndex) => {
      switch (types[name]) {
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
            throw new Error(`${JSON.stringify(name)} is a boolean but got ${JSON.stringify(value)}`);
          }
          break;
        case undefined:
          throw new Error(`type for ${JSON.stringify(name)} is not defined`);
        default:
          throw new Error(`unknown type ${JSON.stringify(types[name])} for ${JSON.stringify(name)}`);
      }
      return [ name, value ];
    }
  }

objDeclaration
  = name:identifier _? "[" values:(_ / declaration)* "]" _? ";" {
    return (...posIndex) => {
      if (types[name] !== "Object") throw new Error(
        types[name] ?
        `${JSON.stringify(name)} is of type "Object" but should be ${JSON.stringify(types[name])}` :
        `type for ${JSON.stringify(name)} is not defined`
      );
      return [ name, Object.fromEntries(values.filter(v => v).map( (v,i) => v(...posIndex,i+1) )) ];
    }
  }

identifier
  = name:(unquotedIdentifier / string) { return name; }

unquotedIdentifier
  = name:[a-zA-Z_\-0-9]+ { return name.join(""); }

string
  = "<<" content:([^><] / escapeCharacter)* ">>" { return content.join(""); }

escapeCharacter
  = "<" char:[<>] { return char; }
