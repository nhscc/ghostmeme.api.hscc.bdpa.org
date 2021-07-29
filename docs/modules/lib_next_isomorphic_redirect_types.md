[ghostmeme.api.hscc.bdpa.org][1] / lib/next-isomorphic-redirect/types

# Module: lib/next-isomorphic-redirect/types

## Table of contents

### Type aliases

- [BackendRedirectConfig][2]
- [FrontendRedirectConfig][3]
- [HttpStatusCode][4]
- [IsomorphicRedirectConfig][5]

## Type aliases

### BackendRedirectConfig

Ƭ **BackendRedirectConfig**: `Object`

#### Type declaration

| Name         | Type                  |
| :----------- | :-------------------- |
| `immediate?` | `boolean`             |
| `res`        | `NextApiResponse`     |
| `status?`    | [`HttpStatusCode`][4] |

#### Defined in

[lib/next-isomorphic-redirect/types.ts:9][6]

---

### FrontendRedirectConfig

Ƭ **FrontendRedirectConfig**: `Object`

#### Type declaration

| Name            | Type      |
| :-------------- | :-------- |
| `bypassRouter?` | `boolean` |
| `replace?`      | `boolean` |

#### Defined in

[lib/next-isomorphic-redirect/types.ts:4][7]

---

### HttpStatusCode

Ƭ **HttpStatusCode**: `100` | `101` | `102` | `200` | `201` | `202` | `203` |
`204` | `205` | `206` | `207` | `208` | `226` | `300` | `301` | `302` | `303` |
`304` | `305` | `306` | `307` | `308` | `400` | `401` | `402` | `403` | `404` |
`405` | `406` | `407` | `408` | `409` | `410` | `411` | `412` | `413` | `414` |
`415` | `416` | `417` | `418` | `419` | `420` | `420` | `422` | `423` | `424` |
`424` | `425` | `426` | `428` | `429` | `431` | `444` | `449` | `450` | `451` |
`451` | `494` | `495` | `496` | `497` | `499` | `500` | `501` | `502` | `503` |
`504` | `505` | `506` | `507` | `508` | `509` | `510` | `511` | `555` | `598` |
`599`

#### Defined in

node_modules/@ergodark/types/dist/modules/index.d.ts:21

---

### IsomorphicRedirectConfig

Ƭ **IsomorphicRedirectConfig**: [`FrontendRedirectConfig`][3] &
[`BackendRedirectConfig`][2]

#### Defined in

[lib/next-isomorphic-redirect/types.ts:15][8]

[1]: ../README.md
[2]: lib_next_isomorphic_redirect_types.md#backendredirectconfig
[3]: lib_next_isomorphic_redirect_types.md#frontendredirectconfig
[4]: lib_next_isomorphic_redirect_types.md#httpstatuscode
[5]: lib_next_isomorphic_redirect_types.md#isomorphicredirectconfig
[6]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/lib/next-isomorphic-redirect/types.ts#L9
[7]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/lib/next-isomorphic-redirect/types.ts#L4
[8]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/lib/next-isomorphic-redirect/types.ts#L15
