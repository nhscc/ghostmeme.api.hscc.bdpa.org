[ghostmeme.api.hscc.bdpa.org][1] / src/backend/middleware

# Module: src/backend/middleware

## Table of contents

### Variables

- [defaultConfig][2]

### Functions

- [handleError][3]
- [wrapHandler][4]

## Variables

### defaultConfig

• `Const` **defaultConfig**: `PageConfig`

**`see`** [https://nextjs.org/docs/api-routes/api-middlewares#custom-config][5]

#### Defined in

[src/backend/middleware.ts:48][6]

## Functions

### handleError

▸ **handleError**(`res`, `error`): `Promise`<`void`>

#### Parameters

| Name            | Type              |
| :-------------- | :---------------- |
| `res`           | `NextApiResponse` |
| `error`         | `Object`          |
| `error.message` | `string`          |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/middleware.ts:58][7]

---

### wrapHandler

▸ **wrapHandler**(`handler`, `(destructured)`): `Promise`<`void`>

Generic middleware "glue" to handle api endpoints with consistent behavior like
safe exception handling.

Passing `undefined` as `handler` or not calling `res.send()` in your handler
will trigger an `HTTP 501 Not Implemented` response. This can be used to to stub
out endpoints for later implementation.

#### Parameters

| Name             | Type                                                                      |
| :--------------- | :------------------------------------------------------------------------ |
| `handler`        | `undefined` \| (`params`: [`NextApiState`][8]) => `Promise`<`void`>       |
| `(destructured)` | [`NextApiState`][8] & { `apiVersion?`: `number` ; `methods`: `string`[] } |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/middleware.ts:90][9]

[1]: ../README.md
[2]: src_backend_middleware.md#defaultconfig
[3]: src_backend_middleware.md#handleerror
[4]: src_backend_middleware.md#wraphandler
[5]: https://nextjs.org/docs/api-routes/api-middlewares#custom-config
[6]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/ed30678/src/backend/middleware.ts#L48
[7]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/ed30678/src/backend/middleware.ts#L58
[8]: types_global.md#nextapistate
[9]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/ed30678/src/backend/middleware.ts#L90
