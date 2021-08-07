[ghostmeme.api.hscc.bdpa.org](../README.md) / lib/next-respond

# Module: lib/next-respond

## Table of contents

### Functions

- [sendGenericHttpResponse](lib_next_respond.md#sendgenerichttpresponse)
- [sendHttpBadMethod](lib_next_respond.md#sendhttpbadmethod)
- [sendHttpBadRequest](lib_next_respond.md#sendhttpbadrequest)
- [sendHttpContrivedError](lib_next_respond.md#sendhttpcontrivederror)
- [sendHttpError](lib_next_respond.md#sendhttperror)
- [sendHttpErrorResponse](lib_next_respond.md#sendhttperrorresponse)
- [sendHttpNotFound](lib_next_respond.md#sendhttpnotfound)
- [sendHttpOk](lib_next_respond.md#sendhttpok)
- [sendHttpRateLimited](lib_next_respond.md#sendhttpratelimited)
- [sendHttpSuccessResponse](lib_next_respond.md#sendhttpsuccessresponse)
- [sendHttpTooLarge](lib_next_respond.md#sendhttptoolarge)
- [sendHttpUnauthenticated](lib_next_respond.md#sendhttpunauthenticated)
- [sendHttpUnauthorized](lib_next_respond.md#sendhttpunauthorized)
- [sendNotImplementedError](lib_next_respond.md#sendnotimplementederror)

## Functions

### sendGenericHttpResponse

▸ **sendGenericHttpResponse**(`res`, `statusCode`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `statusCode` | [`HttpStatusCode`](lib_next_isomorphic_redirect_types.md#httpstatuscode) |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:4](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L4)

___

### sendHttpBadMethod

▸ **sendHttpBadMethod**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:76](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L76)

___

### sendHttpBadRequest

▸ **sendHttpBadRequest**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:36](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L36)

___

### sendHttpContrivedError

▸ **sendHttpContrivedError**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:126](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L126)

___

### sendHttpError

▸ **sendHttpError**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:106](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L106)

___

### sendHttpErrorResponse

▸ **sendHttpErrorResponse**(`res`, `statusCode`, `responseJson`): [`ErrorJsonResponse`](lib_next_respond_types.md#errorjsonresponse)

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `statusCode` | [`HttpStatusCode`](lib_next_isomorphic_redirect_types.md#httpstatuscode) |
| `responseJson` | `Record`<`string`, `unknown`\> & { `error`: `string`  } |

#### Returns

[`ErrorJsonResponse`](lib_next_respond_types.md#errorjsonresponse)

#### Defined in

[lib/next-respond/index.ts:22](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L22)

___

### sendHttpNotFound

▸ **sendHttpNotFound**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:66](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L66)

___

### sendHttpOk

▸ **sendHttpOk**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:32](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L32)

___

### sendHttpRateLimited

▸ **sendHttpRateLimited**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:96](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L96)

___

### sendHttpSuccessResponse

▸ **sendHttpSuccessResponse**(`res`, `statusCode`, `responseJson?`): [`SuccessJsonResponse`](lib_next_respond_types.md#successjsonresponse)

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `statusCode` | [`HttpStatusCode`](lib_next_isomorphic_redirect_types.md#httpstatuscode) |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

[`SuccessJsonResponse`](lib_next_respond_types.md#successjsonresponse)

#### Defined in

[lib/next-respond/index.ts:12](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L12)

___

### sendHttpTooLarge

▸ **sendHttpTooLarge**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:86](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L86)

___

### sendHttpUnauthenticated

▸ **sendHttpUnauthenticated**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:46](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L46)

___

### sendHttpUnauthorized

▸ **sendHttpUnauthorized**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:56](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L56)

___

### sendNotImplementedError

▸ **sendNotImplementedError**(`res`, `responseJson?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `res` | `NextApiResponse` |
| `responseJson?` | `Record`<`string`, `unknown`\> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:116](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/lib/next-respond/index.ts#L116)
