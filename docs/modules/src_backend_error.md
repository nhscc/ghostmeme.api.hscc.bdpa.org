[ghostmeme.api.hscc.bdpa.org][1] / src/backend/error

# Module: src/backend/error

## Table of contents

### Classes

- [ActivityGenerationError][2]
- [ActivitySimulationError][3]
- [AppError][4]
- [FetchError][5]
- [GuruMeditationError][6]
- [HookError][7]
- [InvalidIdError][8]
- [ItemNotFoundError][9]
- [KeyError][10]
- [NotAuthorizedError][11]
- [NotFoundError][12]
- [ValidationError][13]

### Variables

- [InvalidKeyError][14]

### Functions

- [makeNamedError][15]

## Variables

### InvalidKeyError

• `Const` **InvalidKeyError**: typeof [`KeyError`][10]

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
[2]: ../classes/src_backend_error.ActivityGenerationError.md
[3]: ../classes/src_backend_error.ActivitySimulationError.md
[4]: ../classes/src_backend_error.AppError.md
[5]: ../classes/src_backend_error.FetchError.md
[6]: ../classes/src_backend_error.GuruMeditationError.md
[7]: ../classes/src_backend_error.HookError.md
[8]: ../classes/src_backend_error.InvalidIdError.md
[9]: ../classes/src_backend_error.ItemNotFoundError.md
[10]: ../classes/src_backend_error.KeyError.md
[11]: ../classes/src_backend_error.NotAuthorizedError.md
[12]: ../classes/src_backend_error.NotFoundError.md
[13]: ../classes/src_backend_error.ValidationError.md
[14]: src_backend_error.md#invalidkeyerror
[15]: src_backend_error.md#makenamederror
