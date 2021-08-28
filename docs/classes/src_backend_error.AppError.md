[ghostmeme.api.hscc.bdpa.org][1] / [src/backend/error][2] / AppError

# Class: AppError

[src/backend/error][2].AppError

## Hierarchy

- `Error`

  ↳ **`AppError`**

  ↳↳ [`TestError`][3]

  ↳↳ [`NotFoundError`][4]

  ↳↳ [`InvalidIdError`][5]

  ↳↳ [`IllegalEnvironmentError`][6]

  ↳↳ [`ExternalError`][7]

  ↳↳ [`IllegalExternalEnvironmentError`][8]

  ↳↳ [`FetchError`][9]

  ↳↳ [`GuruMeditationError`][10]

  ↳↳ [`HookError`][11]

  ↳↳ [`KeyError`][12]

  ↳↳ [`NotAuthorizedError`][13]

  ↳↳ [`ValidationError`][14]

  ↳↳ [`ItemNotFoundError`][15]

## Table of contents

### Constructors

- [constructor][16]

### Properties

- [message][17]
- [name][18]
- [stack][19]
- [prepareStackTrace][20]
- [stackTraceLimit][21]

### Methods

- [captureStackTrace][22]

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

| Name          | Type          |
| :------------ | :------------ |
| `err`         | `Error`       |
| `stackTraces` | `CallSite`\[] |

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
[3]: src_backend_error.TestError.md
[4]: src_backend_error.NotFoundError.md
[5]: src_backend_error.InvalidIdError.md
[6]: src_backend_error.IllegalEnvironmentError.md
[7]: src_backend_error.ExternalError.md
[8]: src_backend_error.IllegalExternalEnvironmentError.md
[9]: src_backend_error.FetchError.md
[10]: src_backend_error.GuruMeditationError.md
[11]: src_backend_error.HookError.md
[12]: src_backend_error.KeyError.md
[13]: src_backend_error.NotAuthorizedError.md
[14]: src_backend_error.ValidationError.md
[15]: src_backend_error.ItemNotFoundError.md
[16]: src_backend_error.AppError.md#constructor
[17]: src_backend_error.AppError.md#message
[18]: src_backend_error.AppError.md#name
[19]: src_backend_error.AppError.md#stack
[20]: src_backend_error.AppError.md#preparestacktrace
[21]: src_backend_error.AppError.md#stacktracelimit
[22]: src_backend_error.AppError.md#capturestacktrace
