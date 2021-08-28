[ghostmeme.api.hscc.bdpa.org][1] / [src/backend/error][2] / TestError

# Class: TestError

[src/backend/error][2].TestError

## Hierarchy

- [`AppError`][3]

  ↳ **`TestError`**

  ↳↳ [`FactoryExhaustionError`][4]

## Table of contents

### Constructors

- [constructor][5]

### Properties

- [message][6]
- [name][7]
- [stack][8]
- [prepareStackTrace][9]
- [stackTraceLimit][10]

### Methods

- [captureStackTrace][11]

## Constructors

### constructor

• **new TestError**(`message?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | `string` |

#### Inherited from

[AppError][3].[constructor][12]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:979

## Properties

### message

• **message**: `string`

#### Inherited from

[AppError][3].[message][13]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: `string`

#### Inherited from

[AppError][3].[name][14]

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

[AppError][3].[stack][15]

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

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

##### Returns

`any`

#### Inherited from

[AppError][3].[prepareStackTrace][16]

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[AppError][3].[stackTraceLimit][17]

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

[AppError][3].[captureStackTrace][18]

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/src_backend_error.md
[3]: src_backend_error.AppError.md
[4]: test_setup.FactoryExhaustionError.md
[5]: src_backend_error.TestError.md#constructor
[6]: src_backend_error.TestError.md#message
[7]: src_backend_error.TestError.md#name
[8]: src_backend_error.TestError.md#stack
[9]: src_backend_error.TestError.md#preparestacktrace
[10]: src_backend_error.TestError.md#stacktracelimit
[11]: src_backend_error.TestError.md#capturestacktrace
[12]: src_backend_error.AppError.md#constructor
[13]: src_backend_error.AppError.md#message
[14]: src_backend_error.AppError.md#name
[15]: src_backend_error.AppError.md#stack
[16]: src_backend_error.AppError.md#preparestacktrace
[17]: src_backend_error.AppError.md#stacktracelimit
[18]: src_backend_error.AppError.md#capturestacktrace
