[ghostmeme.api.hscc.bdpa.org][1] / lib/next-use-redirection

# Module: lib/next-use-redirection

## Table of contents

### Functions

- [useRedirection][2]

## Functions

### useRedirection

▸ **useRedirection**<`T`>(`(destructured)`): `Object`

Redirects to another location when configurable conditions are met.

redirecting = null - undecided redirecting = true - redirecting redirecting =
false - not redirecting error is defined - error occurred

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name                      | Type                          |
| :------------------------ | :---------------------------- |
| `(destructured)`          | `Object`                      |
| ▶ `({ fetchConfig? })`    | `FetchConfig`                 |
| ▶ `({ redirectConfig? })` | [`FrontendRedirectConfig`][3] |
| ▶ `({ redirectTo? })`     | `string`                      |
| ▶ `({ uri })`             | `string`                      |
| ▶ `({ redirectIf? })`     | (`data`: `T`) => `boolean`    |

#### Returns

`Object`

| Name          | Type                                                                                                                                                                                                                                                              |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `error`       | `any`                                                                                                                                                                                                                                                             |
| `mutate`      | (`data?`: `Record`<`string`, `unknown`> \| `Promise`<`undefined` \| `Record`<`string`, `unknown`>> \| `MutatorCallback`<`undefined` \| `Record`<`string`, `unknown`>>, `shouldRevalidate?`: `boolean`) => `Promise`<`undefined` \| `Record`<`string`, `unknown`>> |
| `redirecting` | `null` \| `boolean`                                                                                                                                                                                                                                               |

#### Defined in

[lib/next-use-redirection/index.ts:18][4]

[1]: ../README.md
[2]: lib_next_use_redirection.md#useredirection
[3]: lib_next_isomorphic_redirect_types.md#frontendredirectconfig
[4]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/ed30678/lib/next-use-redirection/index.ts#L18
