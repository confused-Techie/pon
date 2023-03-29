# PON (Pulsar Object Notation)

> Syntax created by [@Daeraxa](https://github.com/Daeraxa)
>
> Code written by [@confused-Techie](https://github.com/confused-Techie)

Here lies PON, the solution to the problem of what file types to support.

* Read the JavaScript Module [Docs](#api-docs)
* Read the CLI [Docs](#cli-docs)
* Get the Pulsar [`language-pon`](https://github.com/confused-Techie/language-pon) package.

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
  ];
];
```

Look at that! As you can see anyone can pick it up without even reading a manual! But if you do need one, make sure to read the full [Specification 1.0.0](spec/1.0.0-specification.md)!

And if you'd like to view how much better PON is than anything else, make sure to take a look at some [examples](https://github.com/confused-Techie/pon/tree/main/spec).


## API Docs

### `pon.read(data, <opts>)`

Will read PON data, and return an JSON Object.

Returns a JSON Object.

* `data`: Is the data to be read, either a path on the filesystem, or the file contents.
* `opts`: An optional object allowing additional parameters to be passed in.
* `opts.path`: A boolean, that indicates if your `data` is a path. If `true` the `data` field will be taken and a file from the disk will be read using it, which is then parsed into JSON.
* `opts.ast`: Returns the AST of the PON file, rather than the JSON data.

### `pon.write(data, <opts>)`

Will write PON data, from a JSON object.

Returns a PON string.

* `data`: Is the JSON data to stringify or the path to a PON file on disk.
* `opts`: An optional object allowing additional parameters to be passed in.
* `opts.path`: A boolean, that indicates if your `data` is a path. If `true` the `data` is passed to `fs` to read data from the disk. Which will accept a JSON file, and turn it into PON.

## CLI Docs

Invoked via `pon` on the terminal, the following options are supported:

* `--read`: Aliased as `-r`. Indicates you intend to read a native PON file.
* `--write`: Aliased as `-w`. Indicates you intend to write a PON file from JSON.
* `--input`: Aliased as `-i`. The input file path for your action.
* `--output`: Aliased as `-o`. The path of which to save your file.
* `--time`: Aliased as `-t`. Logs the time in milliseconds your action took.
* `--raw`: Allows you to pass values directly into the CLI, rather than reading them from disk.

### Example:

```bash
> pon --read --input path/to/config.pon --output oath/to/config.json --time
```
