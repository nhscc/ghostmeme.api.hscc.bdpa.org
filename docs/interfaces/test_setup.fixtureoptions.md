[ghostmeme.api.hscc.bdpa.org][1] / [test/setup][2] / FixtureOptions

# Interface: FixtureOptions

[test/setup][2].FixtureOptions

## Hierarchy

- `Partial`<[`WebpackTestFixtureOptions`][3]>

- `Partial`<[`GitRepositoryFixtureOptions`][4]>

- `Partial`<[`DummyDirectoriesFixtureOptions`][5]>

  ↳ **`FixtureOptions`**

## Table of contents

### Properties

- [directoryPaths][6]
- [initialFileContents][7]
- [performCleanup][8]
- [setupGit][9]
- [use][10]
- [webpackVersion][11]

## Properties

### directoryPaths

• `Optional` **directoryPaths**: `string`\[]

#### Inherited from

Partial.directoryPaths

#### Defined in

[test/setup.ts:421][12]

---

### initialFileContents

• **initialFileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:406][13]

---

### performCleanup

• **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:404][14]

---

### setupGit

• `Optional` **setupGit**: (`git`: `SimpleGit`) => `AnyVoid`

#### Type declaration

▸ (`git`): `AnyVoid`

##### Parameters

| Name  | Type        |
| :---- | :---------- |
| `git` | `SimpleGit` |

##### Returns

`AnyVoid`

#### Inherited from

Partial.setupGit

#### Defined in

[test/setup.ts:416][15]

---

### use

• **use**: [`MockFixture`][16]<[`FixtureContext`][17]<`Object`>>\[]

#### Defined in

[test/setup.ts:405][18]

---

### webpackVersion

• `Optional` **webpackVersion**: `string`

#### Inherited from

Partial.webpackVersion

#### Defined in

[test/setup.ts:411][19]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.webpacktestfixtureoptions.md
[4]: test_setup.gitrepositoryfixtureoptions.md
[5]: test_setup.dummydirectoriesfixtureoptions.md
[6]: test_setup.fixtureoptions.md#directorypaths
[7]: test_setup.fixtureoptions.md#initialfilecontents
[8]: test_setup.fixtureoptions.md#performcleanup
[9]: test_setup.fixtureoptions.md#setupgit
[10]: test_setup.fixtureoptions.md#use
[11]: test_setup.fixtureoptions.md#webpackversion
[12]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/test/setup.ts#L421
[13]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/test/setup.ts#L406
[14]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/test/setup.ts#L404
[15]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/test/setup.ts#L416
[16]: test_setup.mockfixture.md
[17]: test_setup.fixturecontext.md
[18]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/test/setup.ts#L405
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/test/setup.ts#L411
