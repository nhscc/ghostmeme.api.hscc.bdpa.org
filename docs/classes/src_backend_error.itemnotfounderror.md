[ghostmeme.api.hscc.bdpa.org][1] / [src/backend/error][2] / ItemNotFoundError

# Class: ItemNotFoundError\<T>

[src/backend/error][2].ItemNotFoundError

## Type parameters

| Name | Type     |
| :--- | :------- |
| `T`  | `string` |

## Hierarchy

- [`AppError`][3]

  ↳ **`ItemNotFoundError`**

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

• **new ItemNotFoundError**<`T`>(`reference?`)

#### Type parameters

| Name | Type     |
| :--- | :------- |
| `T`  | `string` |

#### Parameters

| Name         | Type |
| :----------- | :--- |
| `reference?` | `T`  |

#### Overrides

[AppError][3].[constructor][11]

#### Defined in

node_modules/named-app-errors/dist/modules/index.d.ts:20

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
[2]: ../modules/src_backend_error.md
[3]: src_backend_error.apperror.md
[4]: src_backend_error.itemnotfounderror.md#constructor
[5]: src_backend_error.itemnotfounderror.md#message
[6]: src_backend_error.itemnotfounderror.md#name
[7]: src_backend_error.itemnotfounderror.md#stack
[8]: src_backend_error.itemnotfounderror.md#preparestacktrace
[9]: src_backend_error.itemnotfounderror.md#stacktracelimit
[10]: src_backend_error.itemnotfounderror.md#capturestacktrace
[11]: src_backend_error.apperror.md#constructor
[12]: src_backend_error.apperror.md#message
[13]: src_backend_error.apperror.md#name
[14]: src_backend_error.apperror.md#stack
[15]: src_backend_error.apperror.md#preparestacktrace
[16]: src_backend_error.apperror.md#stacktracelimit
[17]: src_backend_error.apperror.md#capturestacktrace
