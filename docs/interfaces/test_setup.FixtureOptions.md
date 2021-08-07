[ghostmeme.api.hscc.bdpa.org](../README.md) / [test/setup](../modules/test_setup.md) / FixtureOptions

# Interface: FixtureOptions

[test/setup](../modules/test_setup.md).FixtureOptions

## Hierarchy

- `Partial`<[`WebpackTestFixtureOptions`](test_setup.WebpackTestFixtureOptions.md)\>

- `Partial`<[`GitRepositoryFixtureOptions`](test_setup.GitRepositoryFixtureOptions.md)\>

- `Partial`<[`DummyDirectoriesFixtureOptions`](test_setup.DummyDirectoriesFixtureOptions.md)\>

  ↳ **`FixtureOptions`**

## Table of contents

### Properties

- [directoryPaths](test_setup.FixtureOptions.md#directorypaths)
- [initialFileContents](test_setup.FixtureOptions.md#initialfilecontents)
- [performCleanup](test_setup.FixtureOptions.md#performcleanup)
- [use](test_setup.FixtureOptions.md#use)
- [webpackVersion](test_setup.FixtureOptions.md#webpackversion)

### Methods

- [setupGit](test_setup.FixtureOptions.md#setupgit)

## Properties

### directoryPaths

• `Optional` **directoryPaths**: `string`[]

#### Inherited from

Partial.directoryPaths

#### Defined in

[test/setup.ts:420](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/test/setup.ts#L420)

___

### initialFileContents

• **initialFileContents**: `Object`

#### Index signature

▪ [filePath: `string`]: `string`

#### Defined in

[test/setup.ts:405](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/test/setup.ts#L405)

___

### performCleanup

• **performCleanup**: `boolean`

#### Defined in

[test/setup.ts:403](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/test/setup.ts#L403)

___

### use

• **use**: [`MockFixture`](test_setup.MockFixture.md)<[`FixtureContext`](test_setup.FixtureContext.md)<`Object`\>\>[]

#### Defined in

[test/setup.ts:404](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/test/setup.ts#L404)

___

### webpackVersion

• `Optional` **webpackVersion**: `string`

#### Inherited from

Partial.webpackVersion

#### Defined in

[test/setup.ts:410](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/test/setup.ts#L410)

## Methods

### setupGit

▸ `Optional` **setupGit**(`git`): `AnyVoid`

#### Parameters

| Name | Type |
| :------ | :------ |
| `git` | `SimpleGit` |

#### Returns

`AnyVoid`

#### Inherited from

Partial.setupGit

#### Defined in

[test/setup.ts:415](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/test/setup.ts#L415)
