{
  const Types = require("./types.js");
  
  function pathToString(path) {
    return path.map( key => JSON.stringify(key) ).join(".");
  }

  function pathToString(path) {
    return path.map( key => JSON.stringify(key) ).join(".");
  }
  
  function prepareDefinitions(defs) {
    const types = {};
    for (const [path, type] of defs) {
      let subType = types;
      for (const key of path.slice(0,-1)) {
        if (!subType[key]) throw new Error(`could not find parent for path ${pathToString(path)}`);
        if (!Types[subType[key].type].multi) throw new Error(`${subType[key].type} is not a multi type`);
        subType = (subType[key].childs ||= {});
      }
      subType[path[path.length-1]] = {type};
    }
    return types;
  }
}

start
  = _ defs:definition* decs:declaration* gimme:gimme? _ {
    defs = prepareDefinitions(defs);
    const obj = Object.fromEntries(decs.map( (dec, i) => dec(defs,[i+1]) ));
    if (gimme != null) return obj[gimme];
    return obj;
  }

definition
  = "Dim" path:path _ "As" type:type _ {
    if (!Types[type]) throw new Error(`unknown type ${JSON.stringify(type)}`);
    return [path,type];
  }

declaration
  = parsedIndex:index _ depth:"#"+ _ dec:( valueDeclaration / objDeclaration ) _ { return (defs, index) => {
    if (depth.length !== index.length) throw new Error(`expected depth ${"#".repeat(index.length)} but got ${depth}`);
    if (index.length !== parsedIndex.length || !index.every( (v,i) => parsedIndex[i] === v )) throw new Error(`expected index ${indexToString(index)} but got ${indexToString(parsedIndex)}`);
    return dec(defs, index);
  };}

valueDeclaration
  = key:key _ ":=" _ value:string { return defs => {
    return [key, Types[defs[key].type].read(value)];
  };}

objDeclaration
  = key:key _ "[" _ decs:declaration* "]" _ ";" { return (defs, index) => {
    // Types[defs[key].type].read(decs.map( (dec, i) => dec(defs[key].childs,[index,i+1]) ))
    return [key, Types[defs[key].type].read(decs.map( (dec, i) => dec(defs[key].childs,[...index,i+1]) ))];
  };}

gimme
  = "Gimme" key:_key { return key }

// --- index ---

index
  = head:indexPart tail:("." i:indexPart {return i})* { return [head,...tail]; }

indexPart
  = head:[1-9] tail:(digit:[1-9] / digit:"0" &[0-9] {return digit})* "0" { return parseInt([head,...tail].join("")); }

// --- path & key & type ---

path
  = head:_key tail:("." key:key {return key})* { return [head,...tail]; }

key
  = string / unquotedKey

_key
  = key:string / __ key:key {return key}

unquotedKey "unquoted key"
  = chars:unquotedChar* { return chars.join(""); }

type
  = type:string / __ type:(unquotedType / string) { return type; }

unquotedType "unquoted type"
  = chars:unquotedChar+ { return chars.join(""); }

unquotedChar
  = [a-zA-Z_\-0-9]

// --- string ---

string
  = "<<" chars:stringCharacter* ">>" { return chars.join("") }

stringCharacter
  = [^><] / escapeString

escapeString
  = "<" _ bins:(bin:bin (__ / &">") {return bin})* _ ">" { return bins.join(""); }

bin
  = bin:[01]+ { return String.fromCharCode(parseInt(bin.join(""), 2)); }

// --- non code tokens ---

_ = oneSpace*
__ = oneSpace+

oneSpace
  = whitespace / lineTerminator / comment

whitespace "whitespace"
  = [\t\v\f ]

lineTerminator "end of line"
  = [\n\r]

comment
  = singleLineComment
  / multiLineComment

singleLineComment
  = "<¿--<<" ([^>\n\r] / ">"!">--?>")* ">>--?>"

multiLineComment
  = "<¡--<<" ([^>] / ">"!">--!>")* ">>--!>"
