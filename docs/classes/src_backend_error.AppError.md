[ghostmeme.api.hscc.bdpa.org](../README.md) / [src/backend/error](../modules/src_backend_error.md) / AppError

# Class: AppError

[src/backend/error](../modules/src_backend_error.md).AppError

## Hierarchy

- `Error`

  ↳ **`AppError`**

  ↳↳ [`TestError`](src_backend_error.TestError.md)

  ↳↳ [`NotFoundError`](src_backend_error.NotFoundError.md)

  ↳↳ [`InvalidIdError`](src_backend_error.InvalidIdError.md)

  ↳↳ [`IllegalEnvironmentError`](src_backend_error.IllegalEnvironmentError.md)

  ↳↳ [`ExternalError`](src_backend_error.ExternalError.md)

  ↳↳ [`IllegalExternalEnvironmentError`](src_backend_error.IllegalExternalEnvironmentError.md)

  ↳↳ [`FetchError`](src_backend_error.FetchError.md)

  ↳↳ [`GuruMeditationError`](src_backend_error.GuruMeditationError.md)

  ↳↳ [`HookError`](src_backend_error.HookError.md)

  ↳↳ [`KeyError`](src_backend_error.KeyError.md)

  ↳↳ [`NotAuthorizedError`](src_backend_error.NotAuthorizedError.md)

  ↳↳ [`ValidationError`](src_backend_error.ValidationError.md)

  ↳↳ [`ItemNotFoundError`](src_backend_error.ItemNotFoundError.md)

## Table of contents

### Constructors

- [constructor](src_backend_error.AppError.md#constructor)

### Properties

- [message](src_backend_error.AppError.md#message)
- [name](src_backend_error.AppError.md#name)
- [stack](src_backend_error.AppError.md#stack)
- [prepareStackTrace](src_backend_error.AppError.md#preparestacktrace)
- [stackTraceLimit](src_backend_error.AppError.md#stacktracelimit)

### Methods

- [captureStackTrace](src_backend_error.AppError.md#capturestacktrace)

## Constructors

### constructor

• **new AppError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
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

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

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

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

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

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
