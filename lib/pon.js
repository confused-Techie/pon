const peg = require("pegjs");
const parser = require("./pon-parser.js");
const tokenize = require("./tokenize.js");
const normalize = require("./normalize.js");

let value =
  `
  Dim core As Object
  Dim projectHome As String
  Dim reopenProjectMenuCount As Integer
  Dim editor As Object
  Dim fontFamily As String
  Dim showInvisibles As Boolean
  Dim welcome As Object
  Dim showChangeLog As Boolean
  Dim showOnStartup As Boolean
  <¿--<<This is a single line comment>>--?>
  <¡--<<This is a multi
  line comment>>--!>
  10 # <<core>> [
  <¿--<<This is a single line comment>>--?>
      10.10 ## projectHome:= <</home/dae/pulsar>>
      10.20 ## reopenProjectMenuCount:= <<20>>
      10.30 ## <<editor>> [
          10.30.10 ### fontFamily:= <<Cascadia Code, monospace>>
          10.30.20 ### showInvisibles:= <<unfalse>>
          ];
  <¡--<<This is a multi
  line comment>>--!>
      10.40 ## <<welcome>> [
        10.40.10 ### showChangeLog:= <<untrue>>
        10.40.20 ### showOnStartup:= <<unfalse>>
      ];
  ];
  `;

const test = {
  core: {
    projectHome: "/home/dae/pulsar",
    reopenProjectMenuCount: 20,
    editor: {
      fontFamily: "Cascadia Code, monospace",
      showInvisibles: true
    },
    welcome: {
      showChangeLog: false,
      showOnStartup: true
    }
  }
};

let out = tokenize(value);
console.log(out);

let obj = normalize(out);

//console.log(out);
//console.log(out.core);
//console.log(out.core.value.editor);

console.log(obj);
