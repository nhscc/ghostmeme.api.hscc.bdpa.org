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
[2]: ../classes/src_backend_error.activitygenerationerror.md
[3]: ../classes/src_backend_error.activitysimulationerror.md
[4]: ../classes/src_backend_error.apperror.md
[5]: ../classes/src_backend_error.fetcherror.md
[6]: ../classes/src_backend_error.gurumeditationerror.md
[7]: ../classes/src_backend_error.hookerror.md
[8]: ../classes/src_backend_error.invalididerror.md
[9]: ../classes/src_backend_error.itemnotfounderror.md
[10]: ../classes/src_backend_error.keyerror.md
[11]: ../classes/src_backend_error.notauthorizederror.md
[12]: ../classes/src_backend_error.notfounderror.md
[13]: ../classes/src_backend_error.validationerror.md
[14]: src_backend_error.md#invalidkeyerror
[15]: src_backend_error.md#makenamederror
