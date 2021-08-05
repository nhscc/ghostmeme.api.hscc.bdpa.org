[ghostmeme.api.hscc.bdpa.org](../README.md) / lib/next-isomorphic-redirect/types

# Module: lib/next-isomorphic-redirect/types

## Table of contents

### Type aliases

- [BackendRedirectConfig](lib_next_isomorphic_redirect_types.md#backendredirectconfig)
- [FrontendRedirectConfig](lib_next_isomorphic_redirect_types.md#frontendredirectconfig)
- [HttpStatusCode](lib_next_isomorphic_redirect_types.md#httpstatuscode)
- [IsomorphicRedirectConfig](lib_next_isomorphic_redirect_types.md#isomorphicredirectconfig)

## Type aliases

### BackendRedirectConfig

Ƭ **BackendRedirectConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `immediate?` | `boolean` |
| `res` | `NextApiResponse` |
| `status?` | [`HttpStatusCode`](lib_next_isomorphic_redirect_types.md#httpstatuscode) |

#### Defined in

[lib/next-isomorphic-redirect/types.ts:9](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/lib/next-isomorphic-redirect/types.ts#L9)

___

### FrontendRedirectConfig

Ƭ **FrontendRedirectConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bypassRouter?` | `boolean` |
| `replace?` | `boolean` |

#### Defined in

[lib/next-isomorphic-redirect/types.ts:4](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/lib/next-isomorphic-redirect/types.ts#L4)

___

### HttpStatusCode

Ƭ **HttpStatusCode**: ``100`` \| ``101`` \| ``102`` \| ``200`` \| ``201`` \| ``202`` \| ``203`` \| ``204`` \| ``205`` \| ``206`` \| ``207`` \| ``208`` \| ``226`` \| ``300`` \| ``301`` \| ``302`` \| ``303`` \| ``304`` \| ``305`` \| ``306`` \| ``307`` \| ``308`` \| ``400`` \| ``401`` \| ``402`` \| ``403`` \| ``404`` \| ``405`` \| ``406`` \| ``407`` \| ``408`` \| ``409`` \| ``410`` \| ``411`` \| ``412`` \| ``413`` \| ``414`` \| ``415`` \| ``416`` \| ``417`` \| ``418`` \| ``419`` \| ``420`` \| ``420`` \| ``422`` \| ``423`` \| ``424`` \| ``424`` \| ``425`` \| ``426`` \| ``428`` \| ``429`` \| ``431`` \| ``444`` \| ``449`` \| ``450`` \| ``451`` \| ``451`` \| ``494`` \| ``495`` \| ``496`` \| ``497`` \| ``499`` \| ``500`` \| ``501`` \| ``502`` \| ``503`` \| ``504`` \| ``505`` \| ``506`` \| ``507`` \| ``508`` \| ``509`` \| ``510`` \| ``511`` \| ``555`` \| ``598`` \| ``599``

#### Defined in

node_modules/@ergodark/types/dist/modules/index.d.ts:21

___

### IsomorphicRedirectConfig

Ƭ **IsomorphicRedirectConfig**: [`FrontendRedirectConfig`](lib_next_isomorphic_redirect_types.md#frontendredirectconfig) & [`BackendRedirectConfig`](lib_next_isomorphic_redirect_types.md#backendredirectconfig)

#### Defined in

[lib/next-isomorphic-redirect/types.ts:15](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/lib/next-isomorphic-redirect/types.ts#L15)
