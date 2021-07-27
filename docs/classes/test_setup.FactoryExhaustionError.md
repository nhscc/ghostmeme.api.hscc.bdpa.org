[ghostmeme.api.hscc.bdpa.org][1] / [test/setup][2] / FactoryExhaustionError

# Class: FactoryExhaustionError

[test/setup][2].FactoryExhaustionError

## Hierarchy

- [`AppError`][3]

  ↳ **`FactoryExhaustionError`**

## Table of contents

### Constructors

- [constructor][4]

### Properties

- [message][5]
- [name][6]
- [stack][7]
- [prepareStackTrace][8]
- [stackTraceLimit][9]

### Methods

- [captureStackTrace][10]

## Constructors

### constructor

• **new FactoryExhaustionError**(`message?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | `string` |

#### Inherited from

[AppError][3].[constructor][11]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:979

## Properties

### message

• **message**: `string`

#### Inherited from

[AppError][3].[message][12]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: `string`

#### Inherited from

[AppError][3].[name][13]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[AppError][3].[stack][14]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

Optional override for formatting stack traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name          | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[AppError][3].[prepareStackTrace][15]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[AppError][3].[stackTraceLimit][16]

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[AppError][3].[captureStackTrace][17]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/test_setup.md
[3]: src_backend_error.AppError.md
[4]: test_setup.FactoryExhaustionError.md#constructor
[5]: test_setup.FactoryExhaustionError.md#message
[6]: test_setup.FactoryExhaustionError.md#name
[7]: test_setup.FactoryExhaustionError.md#stack
[8]: test_setup.FactoryExhaustionError.md#preparestacktrace
[9]: test_setup.FactoryExhaustionError.md#stacktracelimit
[10]: test_setup.FactoryExhaustionError.md#capturestacktrace
[11]: src_backend_error.AppError.md#constructor
[12]: src_backend_error.AppError.md#message
[13]: src_backend_error.AppError.md#name
[14]: src_backend_error.AppError.md#stack
[15]: src_backend_error.AppError.md#preparestacktrace
[16]: src_backend_error.AppError.md#stacktracelimit
[17]: src_backend_error.AppError.md#capturestacktrace
