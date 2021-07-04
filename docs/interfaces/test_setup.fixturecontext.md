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

[test/setup.ts:435][15]

---

### fileContents

• **fileContents**: `Object`

#### Index signature

▪ \[filePath: `string`]: `string`

#### Defined in

[test/setup.ts:434][16]

---

### git

• `Optional` **git**: `SimpleGit`

#### Inherited from

Partial.git

#### Defined in

[test/setup.ts:450][17]

---

### options

• **options**: [`FixtureOptions`][18] & `CustomOptions`

#### Defined in

[test/setup.ts:432][19]

---

### root

• **root**: `string`

#### Defined in

[test/setup.ts:430][20]

---

### testIdentifier

• **testIdentifier**: `string`

#### Defined in

[test/setup.ts:431][21]

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

[test/setup.ts:440][22]

---

### treeOutput

• `Optional` **treeOutput**: `string`

#### Inherited from

Partial.treeOutput

#### Defined in

[test/setup.ts:445][23]

---

### using

• **using**: [`MockFixture`][24]<[`FixtureContext`][25]<`Object`>>\[]

#### Defined in

[test/setup.ts:433][26]

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: test_setup.testresultprovider.md
[4]: test_setup.treeoutputprovider.md
[5]: test_setup.gitprovider.md
[6]: test_setup.fixturecontext.md#debug
[7]: test_setup.fixturecontext.md#filecontents
[8]: test_setup.fixturecontext.md#git
[9]: test_setup.fixturecontext.md#options
[10]: test_setup.fixturecontext.md#root
[11]: test_setup.fixturecontext.md#testidentifier
[12]: test_setup.fixturecontext.md#testresult
[13]: test_setup.fixturecontext.md#treeoutput
[14]: test_setup.fixturecontext.md#using
[15]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L435
[16]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L434
[17]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L450
[18]: test_setup.fixtureoptions.md
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L432
[20]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L430
[21]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L431
[22]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L440
[23]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L445
[24]: test_setup.mockfixture.md
[25]: test_setup.fixturecontext.md
[26]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/test/setup.ts#L433
