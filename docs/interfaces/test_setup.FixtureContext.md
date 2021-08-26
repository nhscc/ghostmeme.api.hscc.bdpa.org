[ghostmeme.api.hscc.bdpa.org][1] / [test/setup][2] / FixtureContext

# Interface: FixtureContext\<CustomOptions>

[test/setup][2].FixtureContext

## Type parameters

| Name            | Type                                    |
| :-------------- | :-------------------------------------- |
| `CustomOptions` | extends `Record`<`string`, `unknown`>{} |

## Hierarchy

- `Partial`<[`TestResultProvider`][3]>

- `Partial`<[`TreeOutputProvider`][4]>

- `Partial`<[`GitProvider`][5]>

  ↳ **`FixtureContext`**

## Table of contents

### Properties

- [debug][6]
- [fileContents][7]
- [git][8]
- [options][9]
- [root][10]
- [testIdentifier][11]
- [testResult][12]
- [treeOutput][13]
- [using][14]

## Properties

### debug

• **debug**: `Debugger`

#### Defined in

[test/setup.ts:434][15]

---

### fileContents

• **fileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:433][16]

---

### git

• `Optional` **git**: `SimpleGit`

#### Inherited from

Partial.git

#### Defined in

[test/setup.ts:449][17]

---

### options

• **options**: [`FixtureOptions`][18] & `CustomOptions`

#### Defined in

[test/setup.ts:431][19]

---

### root

• **root**: `string`

#### Defined in

[test/setup.ts:429][20]

---

### testIdentifier

• **testIdentifier**: `string`

#### Defined in

[test/setup.ts:430][21]

---

### testResult

• `Optional` **testResult**: `Object`

#### Type declaration

| Name     | Type     |
| :------- | :------- |
| `code`   | `number` |
| `stderr` | `string` |
| `stdout` | `string` |

#### Inherited from

Partial.testResult

#### Defined in

[test/setup.ts:439][22]

---

### treeOutput

• `Optional` **treeOutput**: `string`

#### Inherited from

Partial.treeOutput

#### Defined in

[test/setup.ts:444][23]

---

### using

• **using**: [`MockFixture`][24]<[`FixtureContext`][25]<`Object`>>\[]

#### Defined in

[test/setup.ts:432][26]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.TestResultProvider.md
[4]: test_setup.TreeOutputProvider.md
[5]: test_setup.GitProvider.md
[6]: test_setup.FixtureContext.md#debug
[7]: test_setup.FixtureContext.md#filecontents
[8]: test_setup.FixtureContext.md#git
[9]: test_setup.FixtureContext.md#options
[10]: test_setup.FixtureContext.md#root
[11]: test_setup.FixtureContext.md#testidentifier
[12]: test_setup.FixtureContext.md#testresult
[13]: test_setup.FixtureContext.md#treeoutput
[14]: test_setup.FixtureContext.md#using
[15]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L434
[16]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L433
[17]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L449
[18]: test_setup.FixtureOptions.md
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L431
[20]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L429
[21]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L430
[22]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L439
[23]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L444
[24]: test_setup.MockFixture.md
[25]: test_setup.FixtureContext.md
[26]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/setup.ts#L432
