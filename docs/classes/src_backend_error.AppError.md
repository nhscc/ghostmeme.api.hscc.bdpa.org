[ghostmeme.api.hscc.bdpa.org][1] / [src/backend/error][2] / AppError

# Class: AppError

[src/backend/error][2].AppError

## Hierarchy

- `Error`

  ↳ **`AppError`**

  ↳↳ [`NotFoundError`][3]

  ↳↳ [`ActivityGenerationError`][4]

  ↳↳ [`ActivitySimulationError`][5]

  ↳↳ [`InvalidIdError`][6]

  ↳↳ [`FactoryExhaustionError`][7]

  ↳↳ [`FetchError`][8]

  ↳↳ [`GuruMeditationError`][9]

  ↳↳ [`HookError`][10]

  ↳↳ [`KeyError`][11]

  ↳↳ [`NotAuthorizedError`][12]

  ↳↳ [`ValidationError`][13]

  ↳↳ [`ItemNotFoundError`][14]

## Table of contents

### Constructors

- [constructor][15]

### Properties

- [message][16]
- [name][17]
- [stack][18]
- [prepareStackTrace][19]
- [stackTraceLimit][20]

### Methods

- [captureStackTrace][21]

## Constructors

### constructor

• **new AppError**(`message?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:979

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`:
`CallSite`\[]) => `any`

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

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

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

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4

[1]: ../README.md
[2]: ../modules/src_backend_error.md
[3]: src_backend_error.NotFoundError.md
[4]: src_backend_error.ActivityGenerationError.md
[5]: src_backend_error.ActivitySimulationError.md
[6]: src_backend_error.InvalidIdError.md
[7]: test_setup.FactoryExhaustionError.md
[8]: src_backend_error.FetchError.md
[9]: src_backend_error.GuruMeditationError.md
[10]: src_backend_error.HookError.md
[11]: src_backend_error.KeyError.md
[12]: src_backend_error.NotAuthorizedError.md
[13]: src_backend_error.ValidationError.md
[14]: src_backend_error.ItemNotFoundError.md
[15]: src_backend_error.AppError.md#constructor
[16]: src_backend_error.AppError.md#message
[17]: src_backend_error.AppError.md#name
[18]: src_backend_error.AppError.md#stack
[19]: src_backend_error.AppError.md#preparestacktrace
[20]: src_backend_error.AppError.md#stacktracelimit
[21]: src_backend_error.AppError.md#capturestacktrace
