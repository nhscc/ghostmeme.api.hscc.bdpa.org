[ghostmeme.api.hscc.bdpa.org](../README.md) / lib/next-isomorphic-redirect

# Module: lib/next-isomorphic-redirect

## Table of contents

### Functions

- [backendRedirect](lib_next_isomorphic_redirect.md#backendredirect)
- [frontendRedirect](lib_next_isomorphic_redirect.md#frontendredirect)
- [isomorphicRedirect](lib_next_isomorphic_redirect.md#isomorphicredirect)

## Functions

### backendRedirect

▸ `Const` **backendRedirect**(`location`, `(destructured)`): `void`

Redirects the client to a specific location when this function is called
backend. This function should never be called from the frontend. Supports any
valid HTTP 3xx redirect target.

If the `immediate` parameter is `true`, `res.end()` will be called,
immediately ending further processing of the response. It is false by
default.

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | `string` |
| `(destructured)` | [`BackendRedirectConfig`](lib_next_isomorphic_redirect_types.md#backendredirectconfig) |

#### Returns

`void`

#### Defined in

[lib/next-isomorphic-redirect/index.ts:40](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/lib/next-isomorphic-redirect/index.ts#L40)

___

### frontendRedirect

▸ `Const` **frontendRedirect**(`location`, `config?`): `void`

Redirects the client to a specific location when this function is called on
the frontend. This function should never be called from the backend. Supports
any valid URI.

If `replace` is `true`, `Router.replace()` will be called, otherwise
`Router.push()` is used (default).

If `bypassRouter` is `true` or `location` is a network-path reference, the
Router is bypassed and window.location will be used for a "hard" redirect.

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | `string` |
| `config?` | [`FrontendRedirectConfig`](lib_next_isomorphic_redirect_types.md#frontendredirectconfig) |

#### Returns

`void`

#### Defined in

[lib/next-isomorphic-redirect/index.ts:24](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/lib/next-isomorphic-redirect/index.ts#L24)

___

### isomorphicRedirect

▸ `Const` **isomorphicRedirect**(`location`, `(destructured)`): `void`

Redirects the client to a specific location regardless of the runtime:
frontend or backend. Supports any valid URI or HTTP 3xx redirect target.

To keep this function's behavior simple to reason about, note that if
IsomorphicRedirectConfig does not have a "res" key, then this function MUST
be executing on the frontend. An Error will be thrown if this is not the
case.

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | `string` |
| `(destructured)` | [`IsomorphicRedirectConfig`](lib_next_isomorphic_redirect_types.md#isomorphicredirectconfig) |

#### Returns

`void`

#### Defined in

[lib/next-isomorphic-redirect/index.ts:58](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/lib/next-isomorphic-redirect/index.ts#L58)
