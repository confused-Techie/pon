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
Dim core.projectHome As String
Dim core.reopenProjectMenuCount As Integer
Dim core.editor As Object
Dim core.editor.fontFamily As String
Dim core.editor.showInvisibles As Boolean
Dim core.welcome As Object
Dim core.welcome.showChangeLog As Boolean
Dim core.welcome.showOnStartup As Boolean

10 # core [
<¿--<<This is a single line comment>>--?>
\t   10.10 ## projectHome := <</home/dae/pulsar>>
\t   10.20 ## reopenProjectMenuCount := <<20>>
\t   10.30 ## editor [
\t   \t   10.30.10 ### fontFamily := <<Cascadia Code, monospace>>
\t   \t   10.30.20 ### showInvisibles := <<unfalse>>
\t   ];
<¡--<<This is a multi
line comment>>--!>
\t   10.40 ## welcome [
\t   \t   10.40.10 ### showChangeLog := <<untrue>>
\t   \t   10.40.20 ### showOnStartup := <<unfalse>>
\t   ];
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
