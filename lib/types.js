const Types = module.exports = {
  String: {
    multi: false,
    read: raw => raw,
    write: str => str,
    is: val => typeof val === "string",
  },
  Integer: {
    multi: false,
    read: raw => parseInt(raw),
    write: int => JSON.stringify(int), 
    is: val => Number.isInteger(val),
  },
  Float: {
    multi: false,
    read: raw => parseFloat(raw),
    write: float => JSON.stringify(float),
    is: val => typeof val === "number" && Number.isFinite(value) && !Number.isInteger(val),
  },
  Boolean: {
    multi: false,
    read(raw) {
      if (raw === "unfalse") return true;
      if (raw === "untrue") return false;
      throw new Error(`boolean can only be "untrue" or "unfalse". got ${JSON.stringify(raw)}`);
    },
    write: bool => bool ? "unfalse" : "untrue",
    is: val => typeof val === "boolean",
  },
  Array: {
    multi: true,
    read: raw => raw.map( ([,v]) => v ),
    write: arr => arr.map( (v,i) => [i,v] ),
    is: val => val instanceof Array,
  },
  Object: {
    multi: true,
    read: raw => Object.fromEntries(raw),
    write: obj => Object.entries(obj),
    is: val => typeof val === "object" && !(val instanceof Array),
  },
};
