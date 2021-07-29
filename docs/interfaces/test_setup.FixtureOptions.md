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
- [use][9]
- [webpackVersion][10]

### Methods

- [setupGit][11]

## Properties

### directoryPaths

• `Optional` **directoryPaths**: `string`\[]

#### Inherited from

Partial.directoryPaths

#### Defined in

[test/setup.ts:420][12]

---

### initialFileContents

• **initialFileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:405][13]

---

### performCleanup

• **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:403][14]

---

### use

• **use**: [`MockFixture`][15]<[`FixtureContext`][16]<`Object`>>\[]

#### Defined in

[test/setup.ts:404][17]

---

### webpackVersion

• `Optional` **webpackVersion**: `string`

#### Inherited from

Partial.webpackVersion

#### Defined in

[test/setup.ts:410][18]

## Methods

### setupGit

▸ `Optional` **setupGit**(`git`): `AnyVoid`

#### Parameters

| Name  | Type        |
| :---- | :---------- |
| `git` | `SimpleGit` |

#### Returns

`AnyVoid`

#### Inherited from

Partial.setupGit

#### Defined in

[test/setup.ts:415][19]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.WebpackTestFixtureOptions.md
[4]: test_setup.GitRepositoryFixtureOptions.md
[5]: test_setup.DummyDirectoriesFixtureOptions.md
[6]: test_setup.FixtureOptions.md#directorypaths
[7]: test_setup.FixtureOptions.md#initialfilecontents
[8]: test_setup.FixtureOptions.md#performcleanup
[9]: test_setup.FixtureOptions.md#use
[10]: test_setup.FixtureOptions.md#webpackversion
[11]: test_setup.FixtureOptions.md#setupgit
[12]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/test/setup.ts#L420
[13]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/test/setup.ts#L405
[14]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/test/setup.ts#L403
[15]: test_setup.MockFixture.md
[16]: test_setup.FixtureContext.md
[17]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/test/setup.ts#L404
[18]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/test/setup.ts#L410
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/test/setup.ts#L415
