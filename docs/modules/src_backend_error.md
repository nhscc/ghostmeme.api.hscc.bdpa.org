[ghostmeme.api.hscc.bdpa.org][1] / src/backend/error

# Module: src/backend/error

## Table of contents

### Classes

- [AppError][2]
- [ExternalError][3]
- [FetchError][4]
- [GuruMeditationError][5]
- [HookError][6]
- [IllegalEnvironmentError][7]
- [IllegalExternalEnvironmentError][8]
- [InvalidIdError][9]
- [ItemNotFoundError][10]
- [KeyError][11]
- [NotAuthorizedError][12]
- [NotFoundError][13]
- [TestError][14]
- [ValidationError][15]

### Variables

- [InvalidKeyError][16]

### Functions

- [makeNamedError][17]

## Variables

### InvalidKeyError

• `Const` **InvalidKeyError**: typeof [`KeyError`][11]

An alias of KeyError.

#### Defined in

node_modules/named-app-errors/dist/modules/index.d.ts:29

## Functions

### makeNamedError

▸ **makeNamedError**(`ErrorClass`, `name`): `void`

Defines a special `name` property on an error class that improves DX.

#### Parameters

| Name         | Type       |
| :----------- | :--------- |
| `ErrorClass` | `AnyClass` |
| `name`       | `string`   |

#### Returns

`void`

#### Defined in

node_modules/named-app-errors/dist/modules/index.d.ts:5

[1]: ../README.md
[2]: ../classes/src_backend_error.AppError.md
[3]: ../classes/src_backend_error.ExternalError.md
[4]: ../classes/src_backend_error.FetchError.md
[5]: ../classes/src_backend_error.GuruMeditationError.md
[6]: ../classes/src_backend_error.HookError.md
[7]: ../classes/src_backend_error.IllegalEnvironmentError.md
[8]: ../classes/src_backend_error.IllegalExternalEnvironmentError.md
[9]: ../classes/src_backend_error.InvalidIdError.md
[10]: ../classes/src_backend_error.ItemNotFoundError.md
[11]: ../classes/src_backend_error.KeyError.md
[12]: ../classes/src_backend_error.NotAuthorizedError.md
[13]: ../classes/src_backend_error.NotFoundError.md
[14]: ../classes/src_backend_error.TestError.md
[15]: ../classes/src_backend_error.ValidationError.md
[16]: src_backend_error.md#invalidkeyerror
[17]: src_backend_error.md#makenamederror
