start
  = token:(
      definition /
      ignore /
      singleComment /
      multiComment /
      declaration /
      objEnd
    )*

definition
  = "Dim" ignore key:[a-zA-Z]+ ignore "As" ignore type:[a-zA-z]+ ignore { return { kind: "definition", key: key.join(''), type: type.join('') }; }

ignore
  = [\r\n ]+ { return { kind: "whitespace"}; }

singleComment
  = "<¿--<<" text:[^>\n\r]* ">>--?>" { return { kind: "singleLineComment", singleLineComment: text.join('') }; }

multiComment
  = "<¡--<<" text:[^>]* ">>--!>" { return { kind: "multiLineComment", multiLineComment: text.join('').replace('\n', '').replace('\r', '') }; }

declaration
  = index:[0-9.]+ ignore depth:[#]+ ignore "<<"? key:[a-zA-Z]+ ">>"? ignore? dec:( valueDefinition / objStart ) { return { kind: "declaration", index: index.join(''), depth: depth.join(''), key: key.join(''), declaration: dec }; }

valueDefinition
  = equal:":=" ignore "<<" val:[^>]+ ">>" ignore? { return { kind: "valueDefinition", equal: equal, value: val.join('') }; }

objStart
  = "[" { return { kind: "objectStart", objectStart: true }; }

objEnd
  = "];" ignore? { return { kind: "objectEnd", objectEnd: true }; }
