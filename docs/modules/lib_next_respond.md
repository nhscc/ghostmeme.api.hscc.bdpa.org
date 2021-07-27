[ghostmeme.api.hscc.bdpa.org][1] / lib/next-respond

# Module: lib/next-respond

## Table of contents

### Functions

- [sendGenericHttpResponse][2]
- [sendHttpBadMethod][3]
- [sendHttpBadRequest][4]
- [sendHttpContrivedError][5]
- [sendHttpError][6]
- [sendHttpErrorResponse][7]
- [sendHttpNotFound][8]
- [sendHttpOk][9]
- [sendHttpRateLimited][10]
- [sendHttpSuccessResponse][11]
- [sendHttpTooLarge][12]
- [sendHttpUnauthenticated][13]
- [sendHttpUnauthorized][14]
- [sendNotImplementedError][15]

## Functions

### sendGenericHttpResponse

▸ **sendGenericHttpResponse**(`res`, `statusCode`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `statusCode`    | [`HttpStatusCode`][16]        |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:4][17]

---

### sendHttpBadMethod

▸ **sendHttpBadMethod**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:76][18]

---

### sendHttpBadRequest

▸ **sendHttpBadRequest**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:36][19]

---

### sendHttpContrivedError

▸ **sendHttpContrivedError**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:126][20]

---

### sendHttpError

▸ **sendHttpError**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:106][21]

---

### sendHttpErrorResponse

▸ **sendHttpErrorResponse**(`res`, `statusCode`, `responseJson`):
[`ErrorJsonResponse`][22]

#### Parameters

| Name           | Type                                                  |
| :------------- | :---------------------------------------------------- |
| `res`          | `NextApiResponse`                                     |
| `statusCode`   | [`HttpStatusCode`][16]                                |
| `responseJson` | `Record`<`string`, `unknown`> & { `error`: `string` } |

#### Returns

[`ErrorJsonResponse`][22]

#### Defined in

[lib/next-respond/index.ts:22][23]

---

### sendHttpNotFound

▸ **sendHttpNotFound**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:66][24]

---

### sendHttpOk

▸ **sendHttpOk**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:32][25]

---

### sendHttpRateLimited

▸ **sendHttpRateLimited**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:96][26]

---

### sendHttpSuccessResponse

▸ **sendHttpSuccessResponse**(`res`, `statusCode`, `responseJson?`):
[`SuccessJsonResponse`][27]

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `statusCode`    | [`HttpStatusCode`][16]        |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

[`SuccessJsonResponse`][27]

#### Defined in

[lib/next-respond/index.ts:12][28]

---

### sendHttpTooLarge

▸ **sendHttpTooLarge**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:86][29]

---

### sendHttpUnauthenticated

▸ **sendHttpUnauthenticated**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:46][30]

---

### sendHttpUnauthorized

▸ **sendHttpUnauthorized**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:56][31]

---

### sendNotImplementedError

▸ **sendNotImplementedError**(`res`, `responseJson?`): `void`

#### Parameters

| Name            | Type                          |
| :-------------- | :---------------------------- |
| `res`           | `NextApiResponse`             |
| `responseJson?` | `Record`<`string`, `unknown`> |

#### Returns

`void`

#### Defined in

[lib/next-respond/index.ts:116][32]

[1]: ../README.md
[2]: lib_next_respond.md#sendgenerichttpresponse
[3]: lib_next_respond.md#sendhttpbadmethod
[4]: lib_next_respond.md#sendhttpbadrequest
[5]: lib_next_respond.md#sendhttpcontrivederror
[6]: lib_next_respond.md#sendhttperror
[7]: lib_next_respond.md#sendhttperrorresponse
[8]: lib_next_respond.md#sendhttpnotfound
[9]: lib_next_respond.md#sendhttpok
[10]: lib_next_respond.md#sendhttpratelimited
[11]: lib_next_respond.md#sendhttpsuccessresponse
[12]: lib_next_respond.md#sendhttptoolarge
[13]: lib_next_respond.md#sendhttpunauthenticated
[14]: lib_next_respond.md#sendhttpunauthorized
[15]: lib_next_respond.md#sendnotimplementederror
[16]: lib_next_isomorphic_redirect_types.md#httpstatuscode
[17]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L4
[18]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L76
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L36
[20]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L126
[21]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L106
[22]: lib_next_respond_types.md#errorjsonresponse
[23]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L22
[24]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L66
[25]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L32
[26]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L96
[27]: lib_next_respond_types.md#successjsonresponse
[28]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L12
[29]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L86
[30]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L46
[31]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L56
[32]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/lib/next-respond/index.ts#L116
