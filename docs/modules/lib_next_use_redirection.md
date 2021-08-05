[ghostmeme.api.hscc.bdpa.org](../README.md) / lib/next-use-redirection

# Module: lib/next-use-redirection

## Table of contents

### Functions

- [useRedirection](lib_next_use_redirection.md#useredirection)

## Functions

### useRedirection

▸ **useRedirection**<`T`\>(`(destructured)`): `Object`

Redirects to another location when configurable conditions are met.

redirecting = null  - undecided
redirecting = true  - redirecting
redirecting = false - not redirecting
error is defined    - error occurred

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ fetchConfig? })` | `FetchConfig` |
| ▶ `({ redirectConfig? })` | [`FrontendRedirectConfig`](lib_next_isomorphic_redirect_types.md#frontendredirectconfig) |
| ▶ `({ redirectTo? })` | `string` |
| ▶ `({ uri })` | `string` |
| ▶ `({ redirectIf? })` | (`data`: `T`) => `boolean` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `error` | `any` |
| `mutate` | (`data?`: `Record`<`string`, `unknown`\> \| `Promise`<`undefined` \| `Record`<`string`, `unknown`\>\> \| `MutatorCallback`<`undefined` \| `Record`<`string`, `unknown`\>\>, `shouldRevalidate?`: `boolean`) => `Promise`<`undefined` \| `Record`<`string`, `unknown`\>\> |
| `redirecting` | ``null`` \| `boolean` |

#### Defined in

[lib/next-use-redirection/index.ts:18](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/lib/next-use-redirection/index.ts#L18)
