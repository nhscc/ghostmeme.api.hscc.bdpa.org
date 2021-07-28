[ghostmeme.api.hscc.bdpa.org][1] / [src/backend/error][2] / InvalidIdError

# Class: InvalidIdError\<T>

[src/backend/error][2].InvalidIdError

## Type parameters

| Name | Type                 |
| :--- | :------------------- |
| `T`  | `string` \| `number` |

## Hierarchy

- [`AppError`][3]

  ↳ **`InvalidIdError`**

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

• **new InvalidIdError**<`T`>(`id?`)

#### Type parameters

| Name | Type                 |
| :--- | :------------------- |
| `T`  | `string` \| `number` |

#### Parameters

| Name  | Type |
| :---- | :--- |
| `id?` | `T`  |

#### Overrides

[AppError][3].[constructor][11]

#### Defined in

[src/backend/error.ts:51][12]

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

| Name          | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

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
[4]: src_backend_error.InvalidIdError.md#constructor
[5]: src_backend_error.InvalidIdError.md#message
[6]: src_backend_error.InvalidIdError.md#name
[7]: src_backend_error.InvalidIdError.md#stack
[8]: src_backend_error.InvalidIdError.md#preparestacktrace
[9]: src_backend_error.InvalidIdError.md#stacktracelimit
[10]: src_backend_error.InvalidIdError.md#capturestacktrace
[11]: src_backend_error.AppError.md#constructor
[12]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1f8d01f/src/backend/error.ts#L51
[13]: src_backend_error.AppError.md#message
[14]: src_backend_error.AppError.md#name
[15]: src_backend_error.AppError.md#stack
[16]: src_backend_error.AppError.md#preparestacktrace
[17]: src_backend_error.AppError.md#stacktracelimit
[18]: src_backend_error.AppError.md#capturestacktrace
