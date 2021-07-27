[ghostmeme.api.hscc.bdpa.org][1] / [test/setup][2] / MockFixture

# Interface: MockFixture\<Context>

[test/setup][2].MockFixture

## Type parameters

| Name      | Type                  |
| :-------- | :-------------------- |
| `Context` | [`FixtureContext`][3] |

## Table of contents

### Properties

- [description][4]
- [name][5]
- [setup][6]
- [teardown][7]

## Properties

### description

• **description**: `string` | [`ReturnsString`][8]<`Context`>

#### Defined in

[test/setup.ts:465][9]

---

### name

• **name**: `string` | `symbol` | [`ReturnsString`][8]<`Context`>

#### Defined in

[test/setup.ts:464][10]

---

### setup

• `Optional` **setup**: [`FixtureAction`][11]<`Context`>

#### Defined in

[test/setup.ts:466][12]

---

### teardown

• `Optional` **teardown**: [`FixtureAction`][11]<`Context`>

#### Defined in

[test/setup.ts:467][13]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.FixtureContext.md
[4]: test_setup.MockFixture.md#description
[5]: test_setup.MockFixture.md#name
[6]: test_setup.MockFixture.md#setup
[7]: test_setup.MockFixture.md#teardown
[8]: ../modules/test_setup.md#returnsstring
[9]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/setup.ts#L465
[10]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/setup.ts#L464
[11]: ../modules/test_setup.md#fixtureaction
[12]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/setup.ts#L466
[13]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/setup.ts#L467
