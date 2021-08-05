[ghostmeme.api.hscc.bdpa.org](../README.md) / src/backend/error

# Module: src/backend/error

## Table of contents

### Classes

- [AppError](../classes/src_backend_error.AppError.md)
- [ExternalError](../classes/src_backend_error.ExternalError.md)
- [FetchError](../classes/src_backend_error.FetchError.md)
- [GuruMeditationError](../classes/src_backend_error.GuruMeditationError.md)
- [HookError](../classes/src_backend_error.HookError.md)
- [IllegalEnvironmentError](../classes/src_backend_error.IllegalEnvironmentError.md)
- [IllegalExternalEnvironmentError](../classes/src_backend_error.IllegalExternalEnvironmentError.md)
- [InvalidIdError](../classes/src_backend_error.InvalidIdError.md)
- [ItemNotFoundError](../classes/src_backend_error.ItemNotFoundError.md)
- [KeyError](../classes/src_backend_error.KeyError.md)
- [NotAuthorizedError](../classes/src_backend_error.NotAuthorizedError.md)
- [NotFoundError](../classes/src_backend_error.NotFoundError.md)
- [TestError](../classes/src_backend_error.TestError.md)
- [ValidationError](../classes/src_backend_error.ValidationError.md)

### Variables

- [InvalidKeyError](src_backend_error.md#invalidkeyerror)

### Functions

- [makeNamedError](src_backend_error.md#makenamederror)

## Variables

### InvalidKeyError

• `Const` **InvalidKeyError**: typeof [`KeyError`](../classes/src_backend_error.KeyError.md)

An alias of KeyError.

#### Defined in

node_modules/named-app-errors/dist/modules/index.d.ts:29

## Functions

### makeNamedError

▸ **makeNamedError**(`ErrorClass`, `name`): `void`

Defines a special `name` property on an error class that improves DX.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ErrorClass` | `AnyClass` |
| `name` | `string` |

#### Returns

`void`

#### Defined in

node_modules/named-app-errors/dist/modules/index.d.ts:5
