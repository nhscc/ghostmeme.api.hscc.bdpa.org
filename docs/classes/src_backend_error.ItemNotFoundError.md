[ghostmeme.api.hscc.bdpa.org](../README.md) / [src/backend/error](../modules/src_backend_error.md) / ItemNotFoundError

# Class: ItemNotFoundError<T\>

[src/backend/error](../modules/src_backend_error.md).ItemNotFoundError

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` |

## Hierarchy

- [`AppError`](src_backend_error.AppError.md)

  ↳ **`ItemNotFoundError`**

## Table of contents

### Constructors

- [constructor](src_backend_error.ItemNotFoundError.md#constructor)

### Properties

- [message](src_backend_error.ItemNotFoundError.md#message)
- [name](src_backend_error.ItemNotFoundError.md#name)
- [stack](src_backend_error.ItemNotFoundError.md#stack)
- [prepareStackTrace](src_backend_error.ItemNotFoundError.md#preparestacktrace)
- [stackTraceLimit](src_backend_error.ItemNotFoundError.md#stacktracelimit)

### Methods

- [captureStackTrace](src_backend_error.ItemNotFoundError.md#capturestacktrace)

## Constructors

### constructor

• **new ItemNotFoundError**<`T`\>(`reference?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `reference?` | `T` |

#### Overrides

[AppError](src_backend_error.AppError.md).[constructor](src_backend_error.AppError.md#constructor)

#### Defined in

node_modules/named-app-errors/dist/modules/index.d.ts:21

## Properties

### message

• **message**: `string`

#### Inherited from

[AppError](src_backend_error.AppError.md).[message](src_backend_error.AppError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: `string`

#### Inherited from

[AppError](src_backend_error.AppError.md).[name](src_backend_error.AppError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[AppError](src_backend_error.AppError.md).[stack](src_backend_error.AppError.md#stack)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[AppError](src_backend_error.AppError.md).[prepareStackTrace](src_backend_error.AppError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[AppError](src_backend_error.AppError.md).[stackTraceLimit](src_backend_error.AppError.md#stacktracelimit)

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[AppError](src_backend_error.AppError.md).[captureStackTrace](src_backend_error.AppError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
