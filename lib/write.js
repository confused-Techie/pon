const Types = require("./types.js");

function write(input) {
  const declarations = [];
  let gimme = undefined;
  
  if (!Types.Object.is(input)) {
    input = { root: input };
    gimme = "root";
  }
  
  const definitions = prepare(input, [], declarations);
  return writePrepared({definitions, declarations, gimme});
}

function prepare(input, path, declarations) {
  const type = getTypeFor(input);
  declarations.push([ path, type ]);
  
  let value = Types[type].write(input);
  if (Types[type].multi) {
    value = value.map( ([k,v]) => [k, prepare(v, [...path,k], declarations)] );
  }
  return value;
}

function getTypeFor(val) {
  for (const type in Types) {
    if (!Types[type].is(val)) continue;
    return type;
  }
  throw new Error(`could not find type for ${JSON.stringify(val)}`);
}

function writePrepared({definitions, declarations, gimme}) {
  const segments = [];
  
  if (declarations.length) segments.push(
    declarations
      .filter( ([path]) => path.length )
      .map( ([ path, type ]) => `Dim ${encodePath(path)} As ${encodeType(type)}` )
      .join("\n")
  );
  
  if (definitions.length) segments.push(
    definitions.map( (entry, i) => writeDefinition(entry, [i+1]) ).flat(1).join("\n")
  );
  
  if (gimme) segments.push(`Gimme ${encodeKey(gimme)}`);
  
  return segments.length ? segments.join("\n\n") : "";
}

function writeDefinition([key, value], index) {
  const start = `${index.map( v => `${v}0` ).join(".")} ${"#".repeat(index.length)} ${encodeKey(key)}`;
  return typeof value === "string" ?
    [`${start} := ${encodeString(value)}`] :
    [
      `${start} [`,
      ...value.map( (entry, i) => writeDefinition(entry, [...index, i+1]).map( line => "\t   " + line ) ).flat(1),
      "];"
    ];
}

function encodePath(path) {
  return path.map( key => encodeKey(key) ).join(".");
}

function encodeKey(key) {
  return needsQuotes(key) ? encodeString(key) : key;
}

function encodeType(type) {
  return needsQuotes(type) ? encodeString(type) : type;
}

function needsQuotes(str) {
  return !/^[a-zA-Z_\-0-9]+$/.test(str);
}

function encodeString(str) {
  return `<<${str.replace(/[^\x20-\x7e]+/g, str => escapeString(str) )}>>`; // TODO
}

function escapeString(str) {
  return `<${str.split("").map( char => char.charCodeAt(0).toString(2) ).join(" ")}>`
}

module.exports = write;
