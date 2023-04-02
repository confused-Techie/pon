// Simple dumb way to manager in memory fixtures

const flat_object = {
  pon:
`Dim core As Integer
Dim projectHome As String

10 # core := <<20>>
20 # projectHome := <</home/>>`,
  obj: {
    core: 20,
    projectHome: "/home/"
  }
};

const example_object = {
  pon:
`Dim core As Object
Dim projectHome As String
Dim reopenProjectMenuCount As Integer
Dim editor As Object
Dim fontFamily As String
Dim showInvisibles As Boolean
Dim welcome As Object
Dim showChangeLog As Boolean
Dim showOnStartup As Boolean

10 # <<core>> [
<¿--<<This is a single line comment>>--?>
  10.10 ## projectHome := <</home/dae/pulsar>>
  10.20 ## reopenProjectMenuCount := <<20>>
  10.30 ## <<editor>> [
    10.30.10 ### fontFamily := <<Cascadia Code, monospace>>
    10.30.20 ### showInvisibles := <<unfalse>>
  ];
<¡--<<This is a multi
line comment>>--!>
  10.40 ## <<welcome>> [
    10.40.10 ### showChangeLog := <<untrue>>
    10.40.20 ### showOnStartup := <<unfalse>>
  ];
];`,
  obj: {
    core: {
      projectHome: "/home/dae/pulsar",
      reopenProjectMenuCount: 20,
      editor: {
        fontFamily: "Cascadia Code, monospace",
        showInvisibles: true,
      },
      welcome: {
        showChangeLog: false,
        showOnStartup: true
      }
    }
  }
};

const comment_chars = {
  pon:
`Dim core As String

<¿--<<Comment with > in it>>--?>
10 # core := <<A string>>`,
  obj: {
    core: "A string"
  },
};

module.exports = {
  flat_object,
  example_object,
  comment_chars,
};
