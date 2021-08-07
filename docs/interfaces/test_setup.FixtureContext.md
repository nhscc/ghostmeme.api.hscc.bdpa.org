[ghostmeme.api.hscc.bdpa.org](../README.md) / [test/setup](../modules/test_setup.md) / FixtureContext

# Interface: FixtureContext<CustomOptions\>

[test/setup](../modules/test_setup.md).FixtureContext

## Type parameters

| Name | Type |
| :------ | :------ |
| `CustomOptions` | extends `Record`<`string`, `unknown`\>{} |

## Hierarchy

- `Partial`<[`TestResultProvider`](test_setup.TestResultProvider.md)\>

- `Partial`<[`TreeOutputProvider`](test_setup.TreeOutputProvider.md)\>

- `Partial`<[`GitProvider`](test_setup.GitProvider.md)\>

  ↳ **`FixtureContext`**

## Table of contents

### Properties

- [debug](test_setup.FixtureContext.md#debug)
- [fileContents](test_setup.FixtureContext.md#filecontents)
- [git](test_setup.FixtureContext.md#git)
- [options](test_setup.FixtureContext.md#options)
- [root](test_setup.FixtureContext.md#root)
- [testIdentifier](test_setup.FixtureContext.md#testidentifier)
- [testResult](test_setup.FixtureContext.md#testresult)
- [treeOutput](test_setup.FixtureContext.md#treeoutput)
- [using](test_setup.FixtureContext.md#using)

## Properties

### debug

• **debug**: `Debugger`

#### Defined in

[test/setup.ts:434](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L434)

___

### fileContents

• **fileContents**: `Object`

#### Index signature

▪ [filePath: `string`]: `string`

#### Defined in

[test/setup.ts:433](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L433)

___

### git

• `Optional` **git**: `SimpleGit`

#### Inherited from

Partial.git

#### Defined in

[test/setup.ts:449](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L449)

___

### options

• **options**: [`FixtureOptions`](test_setup.FixtureOptions.md) & `CustomOptions`

#### Defined in

[test/setup.ts:431](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L431)

___

### root

• **root**: `string`

#### Defined in

[test/setup.ts:429](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L429)

___

### testIdentifier

• **testIdentifier**: `string`

#### Defined in

[test/setup.ts:430](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L430)

___

### testResult

• `Optional` **testResult**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `stderr` | `string` |
| `stdout` | `string` |

#### Inherited from

Partial.testResult

#### Defined in

[test/setup.ts:439](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L439)

___

### treeOutput

• `Optional` **treeOutput**: `string`

#### Inherited from

Partial.treeOutput

#### Defined in

[test/setup.ts:444](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L444)

___

### using

• **using**: [`MockFixture`](test_setup.MockFixture.md)<[`FixtureContext`](test_setup.FixtureContext.md)<`Object`\>\>[]

#### Defined in

[test/setup.ts:432](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/test/setup.ts#L432)
