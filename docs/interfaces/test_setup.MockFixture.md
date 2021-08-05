[ghostmeme.api.hscc.bdpa.org](../README.md) / [test/setup](../modules/test_setup.md) / MockFixture

# Interface: MockFixture<Context\>

[test/setup](../modules/test_setup.md).MockFixture

## Type parameters

| Name | Type |
| :------ | :------ |
| `Context` | [`FixtureContext`](test_setup.FixtureContext.md) |

## Table of contents

### Properties

- [description](test_setup.MockFixture.md#description)
- [name](test_setup.MockFixture.md#name)
- [setup](test_setup.MockFixture.md#setup)
- [teardown](test_setup.MockFixture.md#teardown)

## Properties

### description

• **description**: `string` \| [`ReturnsString`](../modules/test_setup.md#returnsstring)<`Context`\>

#### Defined in

[test/setup.ts:464](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/setup.ts#L464)

___

### name

• **name**: `string` \| `symbol` \| [`ReturnsString`](../modules/test_setup.md#returnsstring)<`Context`\>

#### Defined in

[test/setup.ts:463](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/setup.ts#L463)

___

### setup

• `Optional` **setup**: [`FixtureAction`](../modules/test_setup.md#fixtureaction)<`Context`\>

#### Defined in

[test/setup.ts:465](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/setup.ts#L465)

___

### teardown

• `Optional` **teardown**: [`FixtureAction`](../modules/test_setup.md#fixtureaction)<`Context`\>

#### Defined in

[test/setup.ts:466](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/setup.ts#L466)
