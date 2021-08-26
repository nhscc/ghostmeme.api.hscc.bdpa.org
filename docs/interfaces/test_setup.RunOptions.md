[ghostmeme.api.hscc.bdpa.org][1] / [test/setup][2] / RunOptions

# Interface: RunOptions

[test/setup][2].RunOptions

## Hierarchy

- `Options`

  ↳ **`RunOptions`**

## Table of contents

### Properties

- [all][3]
- [argv0][4]
- [buffer][5]
- [cleanup][6]
- [cwd][7]
- [detached][8]
- [encoding][9]
- [env][10]
- [execPath][11]
- [extendEnv][12]
- [gid][13]
- [input][14]
- [killSignal][15]
- [localDir][16]
- [maxBuffer][17]
- [preferLocal][18]
- [reject][19]
- [serialization][20]
- [shell][21]
- [stderr][22]
- [stdin][23]
- [stdio][24]
- [stdout][25]
- [stripFinalNewline][26]
- [timeout][27]
- [uid][28]
- [windowsHide][29]
- [windowsVerbatimArguments][30]

## Properties

### all

• `Optional` `Readonly` **all**: `boolean`

Add an `.all` property on the promise and the resolved value. The property
contains the output of the process with `stdout` and `stderr` interleaved.

**`default`** false

#### Inherited from

execa.Options.all

#### Defined in

node_modules/execa/index.d.ts:96

---

### argv0

• `Optional` `Readonly` **argv0**: `string`

Explicitly set the value of `argv[0]` sent to the child process. This will be
set to `command` or `file` if not specified.

#### Inherited from

execa.Options.argv0

#### Defined in

node_modules/execa/index.d.ts:129

---

### buffer

• `Optional` `Readonly` **buffer**: `boolean`

Buffer the output from the spawned process. When set to `false`, you must read
the output of `stdout` and `stderr` (or `all` if the `all` option is `true`).
Otherwise the returned promise will not be resolved/rejected.

If the spawned process fails, `error.stdout`, `error.stderr`, and `error.all`
will contain the buffered data.

**`default`** true

#### Inherited from

execa.Options.buffer

#### Defined in

node_modules/execa/index.d.ts:61

---

### cleanup

• `Optional` `Readonly` **cleanup**: `boolean`

Kill the spawned process when the parent process exits unless either:

- the spawned process is [`detached`][31]
- the parent process is terminated abruptly, for example, with `SIGKILL` as
  opposed to `SIGTERM` or a normal exit

**`default`** true

#### Inherited from

execa.Options.cleanup

#### Defined in

node_modules/execa/index.d.ts:23

---

### cwd

• `Optional` `Readonly` **cwd**: `string`

Current working directory of the child process.

**`default`** process.cwd()

#### Inherited from

execa.Options.cwd

#### Defined in

node_modules/execa/index.d.ts:117

---

### detached

• `Optional` `Readonly` **detached**: `boolean`

Prepare child to run independently of its parent process. Specific behavior
[depends on the platform][31].

**`default`** false

#### Inherited from

execa.Options.detached

#### Defined in

node_modules/execa/index.d.ts:156

---

### encoding

• `Optional` `Readonly` **encoding**: `string`

Specify the character encoding used to decode the `stdout` and `stderr` output.
If set to `null`, then `stdout` and `stderr` will be a `Buffer` instead of a
string.

**`default`** 'utf8'

#### Inherited from

execa.Options.encoding

#### Defined in

node_modules/execa/index.d.ts:185

---

### env

• `Optional` `Readonly` **env**: `ProcessEnv`

Environment key-value pairs. Extends automatically from `process.env`. Set
`extendEnv` to `false` if you don't want this.

**`default`** process.env

#### Inherited from

execa.Options.env

#### Defined in

node_modules/execa/index.d.ts:124

---

### execPath

• `Optional` `Readonly` **execPath**: `string`

Path to the Node.js executable to use in child processes.

This can be either an absolute path or a path relative to the `cwd` option.

Requires `preferLocal` to be `true`.

For example, this can be used together with [`get-node`][32] to run a specific
Node.js version in a child process.

**`default`** process.execPath

#### Inherited from

execa.Options.execPath

#### Defined in

node_modules/execa/index.d.ts:52

---

### extendEnv

• `Optional` `Readonly` **extendEnv**: `boolean`

Set to `false` if you don't want to extend the environment variables when
providing the `env` property.

**`default`** true

#### Inherited from

execa.Options.extendEnv

#### Defined in

node_modules/execa/index.d.ts:110

---

### gid

• `Optional` `Readonly` **gid**: `number`

Sets the group identity of the process.

#### Inherited from

execa.Options.gid

#### Defined in

node_modules/execa/index.d.ts:166

---

### input

• `Optional` `Readonly` **input**: `string` | `Readable` | `Buffer`

Write some input to the `stdin` of your binary.

#### Inherited from

execa.Options.input

#### Defined in

node_modules/execa/index.d.ts:227

---

### killSignal

• `Optional` `Readonly` **killSignal**: `string` | `number`

Signal value to be used when the spawned process will be killed.

**`default`** 'SIGTERM'

#### Inherited from

execa.Options.killSignal

#### Defined in

node_modules/execa/index.d.ts:206

---

### localDir

• `Optional` `Readonly` **localDir**: `string`

Preferred path to find locally installed binaries in (use with `preferLocal`).

**`default`** process.cwd()

#### Inherited from

execa.Options.localDir

#### Defined in

node_modules/execa/index.d.ts:39

---

### maxBuffer

• `Optional` `Readonly` **maxBuffer**: `number`

Largest amount of data in bytes allowed on `stdout` or `stderr`. Default: 100
MB.

**`default`** 100_000_000

#### Inherited from

execa.Options.maxBuffer

#### Defined in

node_modules/execa/index.d.ts:199

---

### preferLocal

• `Optional` `Readonly` **preferLocal**: `boolean`

Prefer locally installed binaries when looking for a binary to execute.

If you `$ npm install foo`, you can then `execa('foo')`.

**`default`** false

#### Inherited from

execa.Options.preferLocal

#### Defined in

node_modules/execa/index.d.ts:32

---

### reject

• `Optional` **reject**: `boolean`

Setting this to `true` rejects the promise instead of resolving it with the
error.

**`default`** false

#### Overrides

execa.Options.reject

#### Defined in

[test/setup.ts:373][33]

---

### serialization

• `Optional` `Readonly` **serialization**: `"json"` | `"advanced"`

Specify the kind of serialization used for sending messages between processes
when using the `stdio: 'ipc'` option or `execa.node()`:

- `json`: Uses `JSON.stringify()` and `JSON.parse()`.
- `advanced`: Uses [`v8.serialize()`][34]

Requires Node.js `13.2.0` or later.

[More info.][35]

**`default`** 'json'

#### Inherited from

execa.Options.serialization

#### Defined in

node_modules/execa/index.d.ts:149

---

### shell

• `Optional` `Readonly` **shell**: `string` | `boolean`

If `true`, runs `command` inside of a shell. Uses `/bin/sh` on UNIX and
`cmd.exe` on Windows. A different shell can be specified as a string. The shell
should understand the `-c` switch on UNIX or `/d /s /c` on Windows.

We recommend against using this option since it is:

- not cross-platform, encouraging shell-specific syntax.
- slower, because of the additional shell interpretation.
- unsafe, potentially allowing command injection.

**`default`** false

#### Inherited from

execa.Options.shell

#### Defined in

node_modules/execa/index.d.ts:178

---

### stderr

• `Optional` `Readonly` **stderr**: `StdioOption`

Same options as [`stdio`][36].

**`default`** 'pipe'

#### Inherited from

execa.Options.stderr

#### Defined in

node_modules/execa/index.d.ts:82

---

### stdin

• `Optional` `Readonly` **stdin**: `StdioOption`

Same options as [`stdio`][36].

**`default`** 'pipe'

#### Inherited from

execa.Options.stdin

#### Defined in

node_modules/execa/index.d.ts:68

---

### stdio

• `Optional` `Readonly` **stdio**: `"pipe"` | `"ignore"` | `"inherit"` |
readonly `StdioOption`\[]

Child's [stdio][37] configuration.

**`default`** 'pipe'

#### Inherited from

execa.Options.stdio

#### Defined in

node_modules/execa/index.d.ts:136

---

### stdout

• `Optional` `Readonly` **stdout**: `StdioOption`

Same options as [`stdio`][36].

**`default`** 'pipe'

#### Inherited from

execa.Options.stdout

#### Defined in

node_modules/execa/index.d.ts:75

---

### stripFinalNewline

• `Optional` `Readonly` **stripFinalNewline**: `boolean`

Strip the final [newline character][38] from the output.

**`default`** true

#### Inherited from

execa.Options.stripFinalNewline

#### Defined in

node_modules/execa/index.d.ts:103

---

### timeout

• `Optional` `Readonly` **timeout**: `number`

If `timeout` is greater than `0`, the parent will send the signal identified by
the `killSignal` property (the default is `SIGTERM`) if the child runs longer
than `timeout` milliseconds.

**`default`** 0

#### Inherited from

execa.Options.timeout

#### Defined in

node_modules/execa/index.d.ts:192

---

### uid

• `Optional` `Readonly` **uid**: `number`

Sets the user identity of the process.

#### Inherited from

execa.Options.uid

#### Defined in

node_modules/execa/index.d.ts:161

---

### windowsHide

• `Optional` `Readonly` **windowsHide**: `boolean`

On Windows, do not create a new console window. Please note this also prevents
`CTRL-C` [from working][39] on Windows.

**`default`** true

#### Inherited from

execa.Options.windowsHide

#### Defined in

node_modules/execa/index.d.ts:220

---

### windowsVerbatimArguments

• `Optional` `Readonly` **windowsVerbatimArguments**: `boolean`

If `true`, no quoting or escaping of arguments is done on Windows. Ignored on
other platforms. This is set to `true` automatically when the `shell` option is
`true`.

**`default`** false

#### Inherited from

execa.Options.windowsVerbatimArguments

#### Defined in

node_modules/execa/index.d.ts:213

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.RunOptions.md#all
[4]: test_setup.RunOptions.md#argv0
[5]: test_setup.RunOptions.md#buffer
[6]: test_setup.RunOptions.md#cleanup
[7]: test_setup.RunOptions.md#cwd
[8]: test_setup.RunOptions.md#detached
[9]: test_setup.RunOptions.md#encoding
[10]: test_setup.RunOptions.md#env
[11]: test_setup.RunOptions.md#execpath
[12]: test_setup.RunOptions.md#extendenv
[13]: test_setup.RunOptions.md#gid
[14]: test_setup.RunOptions.md#input
[15]: test_setup.RunOptions.md#killsignal
[16]: test_setup.RunOptions.md#localdir
[17]: test_setup.RunOptions.md#maxbuffer
[18]: test_setup.RunOptions.md#preferlocal
[19]: test_setup.RunOptions.md#reject
[20]: test_setup.RunOptions.md#serialization
[21]: test_setup.RunOptions.md#shell
[22]: test_setup.RunOptions.md#stderr
[23]: test_setup.RunOptions.md#stdin
[24]: test_setup.RunOptions.md#stdio
[25]: test_setup.RunOptions.md#stdout
[26]: test_setup.RunOptions.md#stripfinalnewline
[27]: test_setup.RunOptions.md#timeout
[28]: test_setup.RunOptions.md#uid
[29]: test_setup.RunOptions.md#windowshide
[30]: test_setup.RunOptions.md#windowsverbatimarguments
[31]: https://nodejs.org/api/child_process.html#child_process_options_detached
[32]: https://github.com/ehmicky/get-node
[33]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L373
[34]: https://nodejs.org/api/v8.html#v8_v8_serialize_value
[35]:
  https://nodejs.org/api/child_process.html#child_process_advanced_serialization
[36]:
  https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_options_stdio
[37]: https://nodejs.org/api/child_process.html#child_process_options_stdio
[38]: https://en.wikipedia.org/wiki/Newline
[39]: https://github.com/nodejs/node/issues/29837
