# PON (Pulsar Object Notation)

Here lies PON, the solution to the problem of what file types to support.

One day during discussions amoung the Pulsar dev team, we came to the topic of what file types to support for users config files. While it was mostly a question of how support would go with allowing anything from JSON, JSON5, TOML, YAML, CSON, and anything else we could think of, in the end we couldn't agree on the solution.

So with that, we all could decide on PON!

Pulsar Object Notation has the best of all worlds!

* Easy to determine the types of keys
* Human Readable object structure
* Incredibly clear object nesting
* Comments & Multiline Comments are supported!

PON is easy to learn, and easy to use!

Take this quick example JSON:

```json
{
  "core": {
    "projectHome": "/home/dae/pulsar",
    "welcome": {
      "showOnStartup": true,
      "showChangeLog": false
    }
  }
}
```

Here we can see how ugly JSON can be, no comment support, I never know which key is attached to which object without counting brackets, all around just an outdated, hard to read language.

But the same in PON is simple, easy, and incredibly intutive!

```pon
Dim core As Object
Dim projectHome As String
Dim welcome As Object
Dim showOnStartup As Boolean
Dim showChangeLog As Boolean

10 # <<core>> [
  10.10 ## projectHome:= <</home/dae/pulsar>>
  10.20 ## <<welcome>> [
    <¿--<<An easy to type comment!>>--?>
    10.20.10 ### showOnStartup:= <<unfalse>>
    10.20.20 ### showChangeLog:= <<untrue>>
  ]
]
```

Look at that! As you can see anyone can pick it up without even reading a manual! But if you do need one, make sure to read the full [Specification 1.0.0](spec/1.0.0-specification.md)!

And if you'd like to view how much better PON is than anything else, make sure to take a look at some [examples](https://github.com/confused-Techie/pon/tree/main/spec).
