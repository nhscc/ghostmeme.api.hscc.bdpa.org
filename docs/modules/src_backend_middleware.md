[ghostmeme.api.hscc.bdpa.org](../README.md) / src/backend/middleware

# Module: src/backend/middleware

## Table of contents

### Variables

- [defaultConfig](src_backend_middleware.md#defaultconfig)

### Functions

- [handleError](src_backend_middleware.md#handleerror)
- [wrapHandler](src_backend_middleware.md#wraphandler)

## Variables

### defaultConfig

• `Const` **defaultConfig**: `PageConfig`

**`see`** https://nextjs.org/docs/api-routes/api-middlewares#custom-config

#### Defined in

[src/backend/middleware.ts:48](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/middleware.ts#L48)

## Functions

### handleError

▸ **handleError**(`res`, `error`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `error` | `Object` |
| `error.message` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/middleware.ts:58](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/middleware.ts#L58)

___

### wrapHandler

▸ **wrapHandler**(`handler`, `(destructured)`): `Promise`<`void`\>

Generic middleware "glue" to handle api endpoints with consistent behavior
like safe exception handling.

Passing `undefined` as `handler` or not calling `res.send()` in your handler
will trigger an `HTTP 501 Not Implemented` response. This can be used to to
stub out endpoints for later implementation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | `undefined` \| (`params`: [`NextApiState`](types_global.md#nextapistate)) => `Promise`<`void`\> |
| `(destructured)` | [`NextApiState`](types_global.md#nextapistate) & { `apiVersion?`: `number` ; `methods`: `string`[]  } |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/middleware.ts:90](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/middleware.ts#L90)
