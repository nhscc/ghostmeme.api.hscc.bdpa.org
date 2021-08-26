[ghostmeme.api.hscc.bdpa.org][1] / lib/next-isomorphic-redirect

# Module: lib/next-isomorphic-redirect

## Table of contents

### Functions

- [backendRedirect][2]
- [frontendRedirect][3]
- [isomorphicRedirect][4]

## Functions

### backendRedirect

▸ `Const` **backendRedirect**(`location`, `(destructured)`): `void`

Redirects the client to a specific location when this function is called
backend. This function should never be called from the frontend. Supports any
valid HTTP 3xx redirect target.

If the `immediate` parameter is `true`, `res.end()` will be called, immediately
ending further processing of the response. It is false by default.

#### Parameters

| Name             | Type                         |
| :--------------- | :--------------------------- |
| `location`       | `string`                     |
| `(destructured)` | [`BackendRedirectConfig`][5] |

#### Returns

`void`

#### Defined in

[lib/next-isomorphic-redirect/index.ts:40][6]

---

### frontendRedirect

▸ `Const` **frontendRedirect**(`location`, `config?`): `void`

Redirects the client to a specific location when this function is called on the
frontend. This function should never be called from the backend. Supports any
valid URI.

If `replace` is `true`, `Router.replace()` will be called, otherwise
`Router.push()` is used (default).

If `bypassRouter` is `true` or `location` is a network-path reference, the
Router is bypassed and window\.location will be used for a "hard" redirect.

#### Parameters

| Name       | Type                          |
| :--------- | :---------------------------- |
| `location` | `string`                      |
| `config?`  | [`FrontendRedirectConfig`][7] |

#### Returns

`void`

#### Defined in

[lib/next-isomorphic-redirect/index.ts:24][8]

---

### isomorphicRedirect

▸ `Const` **isomorphicRedirect**(`location`, `(destructured)`): `void`

Redirects the client to a specific location regardless of the runtime: frontend
or backend. Supports any valid URI or HTTP 3xx redirect target.

To keep this function's behavior simple to reason about, note that if
IsomorphicRedirectConfig does not have a "res" key, then this function MUST be
executing on the frontend. An Error will be thrown if this is not the case.

#### Parameters

| Name             | Type                            |
| :--------------- | :------------------------------ |
| `location`       | `string`                        |
| `(destructured)` | [`IsomorphicRedirectConfig`][9] |

#### Returns

`void`

#### Defined in

[lib/next-isomorphic-redirect/index.ts:58][10]

[1]: ../README.md
[2]: lib_next_isomorphic_redirect.md#backendredirect
[3]: lib_next_isomorphic_redirect.md#frontendredirect
[4]: lib_next_isomorphic_redirect.md#isomorphicredirect
[5]: lib_next_isomorphic_redirect_types.md#backendredirectconfig
[6]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/lib/next-isomorphic-redirect/index.ts#L40
[7]: lib_next_isomorphic_redirect_types.md#frontendredirectconfig
[8]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/lib/next-isomorphic-redirect/index.ts#L24
[9]: lib_next_isomorphic_redirect_types.md#isomorphicredirectconfig
[10]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/lib/next-isomorphic-redirect/index.ts#L58
