[ghostmeme.api.hscc.bdpa.org](../README.md) / test/setup

# Module: test/setup

## Table of contents

### Classes

- [FactoryExhaustionError](../classes/test_setup.FactoryExhaustionError.md)

### Interfaces

- [DummyDirectoriesFixtureOptions](../interfaces/test_setup.DummyDirectoriesFixtureOptions.md)
- [FixtureContext](../interfaces/test_setup.FixtureContext.md)
- [FixtureOptions](../interfaces/test_setup.FixtureOptions.md)
- [GitProvider](../interfaces/test_setup.GitProvider.md)
- [GitRepositoryFixtureOptions](../interfaces/test_setup.GitRepositoryFixtureOptions.md)
- [MockFixture](../interfaces/test_setup.MockFixture.md)
- [RunOptions](../interfaces/test_setup.RunOptions.md)
- [TestResultProvider](../interfaces/test_setup.TestResultProvider.md)
- [TreeOutputProvider](../interfaces/test_setup.TreeOutputProvider.md)
- [WebpackTestFixtureOptions](../interfaces/test_setup.WebpackTestFixtureOptions.md)

### Type aliases

- [FixtureAction](test_setup.md#fixtureaction)
- [MockArgvOptions](test_setup.md#mockargvoptions)
- [MockEnvOptions](test_setup.md#mockenvoptions)
- [ReturnsString](test_setup.md#returnsstring)

### Functions

- [asMockedFunction](test_setup.md#asmockedfunction)
- [asMockedNextApiMiddleware](test_setup.md#asmockednextapimiddleware)
- [describeRootFixture](test_setup.md#describerootfixture)
- [dummyDirectoriesFixture](test_setup.md#dummydirectoriesfixture)
- [dummyFilesFixture](test_setup.md#dummyfilesfixture)
- [dummyNpmPackageFixture](test_setup.md#dummynpmpackagefixture)
- [gitRepositoryFixture](test_setup.md#gitrepositoryfixture)
- [isolatedImport](test_setup.md#isolatedimport)
- [isolatedImportFactory](test_setup.md#isolatedimportfactory)
- [itemFactory](test_setup.md#itemfactory)
- [mockArgvFactory](test_setup.md#mockargvfactory)
- [mockEnvFactory](test_setup.md#mockenvfactory)
- [mockFixtureFactory](test_setup.md#mockfixturefactory)
- [nodeImportTestFixture](test_setup.md#nodeimporttestfixture)
- [npmLinkSelfFixture](test_setup.md#npmlinkselffixture)
- [protectedImportFactory](test_setup.md#protectedimportfactory)
- [rootFixture](test_setup.md#rootfixture)
- [run](test_setup.md#run)
- [runnerFactory](test_setup.md#runnerfactory)
- [toPublicMeme](test_setup.md#topublicmeme)
- [toPublicUser](test_setup.md#topublicuser)
- [webpackTestFixture](test_setup.md#webpacktestfixture)
- [withMockedArgv](test_setup.md#withmockedargv)
- [withMockedEnv](test_setup.md#withmockedenv)
- [withMockedExit](test_setup.md#withmockedexit)
- [withMockedFixture](test_setup.md#withmockedfixture)
- [withMockedOutput](test_setup.md#withmockedoutput)

## Type aliases

### FixtureAction

Ƭ **FixtureAction**<`Context`\>: (`ctx`: `Context`) => `Promise`<`unknown`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Context` | [`FixtureContext`](../interfaces/test_setup.FixtureContext.md) |

#### Type declaration

▸ (`ctx`): `Promise`<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Context` |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[test/setup.ts:454](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L454)

___

### MockArgvOptions

Ƭ **MockArgvOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `replace?` | `boolean` | By default, the first two elements in `process.argv` are preserved. Setting `replace` to `true` will cause the entire process.argv array to be replaced  **`default`** false |

#### Defined in

[test/setup.ts:175](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L175)

___

### MockEnvOptions

Ƭ **MockEnvOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `replace?` | `boolean` | By default, the `process.env` object is emptied and re-hydrated with `newEnv`. Setting `replace` to `false` will cause `newEnv` to be appended instead  **`default`** true |

#### Defined in

[test/setup.ts:185](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L185)

___

### ReturnsString

Ƭ **ReturnsString**<`Context`\>: (`ctx`: `Context`) => `Promise`<`string`\> \| `string`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Context` | [`FixtureContext`](../interfaces/test_setup.FixtureContext.md) |

#### Type declaration

▸ (`ctx`): `Promise`<`string`\> \| `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `Context` |

##### Returns

`Promise`<`string`\> \| `string`

#### Defined in

[test/setup.ts:457](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L457)

## Functions

### asMockedFunction

▸ **asMockedFunction**<`T`\>(): `jest.MockedFunction`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AnyFunction``never` |

#### Returns

`jest.MockedFunction`<`T`\>

#### Defined in

[test/setup.ts:166](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L166)

▸ **asMockedFunction**<`T`\>(`fn`): `jest.MockedFunction`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AnyFunction` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `T` |

#### Returns

`jest.MockedFunction`<`T`\>

#### Defined in

[test/setup.ts:167](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L167)

___

### asMockedNextApiMiddleware

▸ **asMockedNextApiMiddleware**(`wrapHandler`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `wrapHandler` | [`src/backend/middleware`](src_backend_middleware.md)[``"wrapHandler"``] |

#### Returns

`void`

#### Defined in

[test/setup.ts:92](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L92)

___

### describeRootFixture

▸ **describeRootFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:692](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L692)

___

### dummyDirectoriesFixture

▸ **dummyDirectoriesFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:646](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L646)

___

### dummyFilesFixture

▸ **dummyFilesFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:667](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L667)

___

### dummyNpmPackageFixture

▸ **dummyNpmPackageFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:489](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L489)

___

### gitRepositoryFixture

▸ **gitRepositoryFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:622](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L622)

___

### isolatedImport

▸ **isolatedImport**(`path`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[test/setup.ts:270](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L270)

___

### isolatedImportFactory

▸ **isolatedImportFactory**(`path`): () => `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`fn`

▸ (): `Promise`<`unknown`\>

##### Returns

`Promise`<`unknown`\>

#### Defined in

[test/setup.ts:294](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L294)

___

### itemFactory

▸ **itemFactory**<`T`\>(`testItems`): () => `T` & { `$iter`: `IterableIterator`<`T`\> ; `count`: `number` ; `items`: `T`[] ; `[asyncIterator]`: () => `AsyncGenerator`<`T`, `void`, `unknown`\> ; `[iterator]`: () => `Generator`<`T`, `void`, `unknown`\>  }

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `testItems` | `T`[] |

#### Returns

() => `T` & { `$iter`: `IterableIterator`<`T`\> ; `count`: `number` ; `items`: `T`[] ; `[asyncIterator]`: () => `AsyncGenerator`<`T`, `void`, `unknown`\> ; `[iterator]`: () => `Generator`<`T`, `void`, `unknown`\>  }

#### Defined in

[test/setup.ts:118](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L118)

___

### mockArgvFactory

▸ **mockArgvFactory**(`newArgv`, `options?`): (`fn`: () => `AnyVoid`, `newArgv?`: `string`[], `options?`: [`MockArgvOptions`](test_setup.md#mockargvoptions)) => `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newArgv` | typeof `process.argv` |
| `options` | [`MockArgvOptions`](test_setup.md#mockargvoptions) |

#### Returns

`fn`

▸ (`fn`, `newArgv?`, `options?`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `AnyVoid` |
| `newArgv?` | `string`[] |
| `options?` | [`MockArgvOptions`](test_setup.md#mockargvoptions) |

##### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:212](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L212)

___

### mockEnvFactory

▸ **mockEnvFactory**(`newEnv`, `options?`): (`fn`: () => `AnyVoid`, `newEnv?`: `Record`<`string`, `string`\>, `options?`: [`MockEnvOptions`](test_setup.md#mockenvoptions)) => `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newEnv` | `Record`<`string`, `string`\> |
| `options` | [`MockEnvOptions`](test_setup.md#mockenvoptions) |

#### Returns

`fn`

▸ (`fn`, `newEnv?`, `options?`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `AnyVoid` |
| `newEnv?` | `Record`<`string`, `string`\> |
| `options?` | [`MockEnvOptions`](test_setup.md#mockenvoptions) |

##### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:249](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L249)

___

### mockFixtureFactory

▸ **mockFixtureFactory**<`CustomOptions`, `CustomContext`\>(`testIdentifier`, `options?`): (`fn`: [`FixtureAction`](test_setup.md#fixtureaction)<[`FixtureContext`](../interfaces/test_setup.FixtureContext.md)<[`FixtureOptions`](../interfaces/test_setup.FixtureOptions.md) & `Partial`<`Record`<`string`, `unknown`\> & `CustomOptions`\>\> & `CustomContext`\>) => `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomOptions` | extends `Record`<`string`, `unknown`\>{} |
| `CustomContext` | extends `Record`<`string`, `unknown`\>{} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `testIdentifier` | `string` |
| `options?` | `Partial`<[`FixtureOptions`](../interfaces/test_setup.FixtureOptions.md) & `CustomOptions`\> |

#### Returns

`fn`

▸ (`fn`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | [`FixtureAction`](test_setup.md#fixtureaction)<[`FixtureContext`](../interfaces/test_setup.FixtureContext.md)<[`FixtureOptions`](../interfaces/test_setup.FixtureOptions.md) & `Partial`<`Record`<`string`, `unknown`\> & `CustomOptions`\>\> & `CustomContext`\> |

##### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:818](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L818)

___

### nodeImportTestFixture

▸ **nodeImportTestFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:588](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L588)

___

### npmLinkSelfFixture

▸ **npmLinkSelfFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:514](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L514)

___

### protectedImportFactory

▸ **protectedImportFactory**(`path`): (`params?`: { `expectedExitCode?`: `number`  }) => `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`fn`

▸ (`params?`): `Promise`<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Object` |
| `params.expectedExitCode?` | `number` |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[test/setup.ts:314](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L314)

___

### rootFixture

▸ **rootFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:470](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L470)

___

### run

▸ **run**(`file`, `args?`, `options?`): `Promise`<`ExecaReturnValue`<`string`\> & { `code`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |
| `args?` | `string`[] |
| `options?` | [`RunOptions`](../interfaces/test_setup.RunOptions.md) |

#### Returns

`Promise`<`ExecaReturnValue`<`string`\> & { `code`: `number`  }\>

#### Defined in

[test/setup.ts:378](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L378)

___

### runnerFactory

▸ **runnerFactory**(`file`, `args?`, `options?`): (`args?`: `string`[], `options?`: [`RunOptions`](../interfaces/test_setup.RunOptions.md)) => `Promise`<`ExecaReturnValue`<`string`\> & { `code`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |
| `args?` | `string`[] |
| `options?` | [`RunOptions`](../interfaces/test_setup.RunOptions.md) |

#### Returns

`fn`

▸ (`args?`, `options?`): `Promise`<`ExecaReturnValue`<`string`\> & { `code`: `number`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | `string`[] |
| `options?` | [`RunOptions`](../interfaces/test_setup.RunOptions.md) |

##### Returns

`Promise`<`ExecaReturnValue`<`string`\> & { `code`: `number`  }\>

#### Defined in

[test/setup.ts:390](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L390)

___

### toPublicMeme

▸ **toPublicMeme**(`internal`): [`PublicMeme`](types_global.md#publicmeme)

#### Parameters

| Name | Type |
| :------ | :------ |
| `internal` | `WithId`<[`InternalMeme`](types_global.md#internalmeme)\> |

#### Returns

[`PublicMeme`](types_global.md#publicmeme)

#### Defined in

[test/setup.ts:54](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L54)

___

### toPublicUser

▸ **toPublicUser**(`internal`): [`PublicUser`](types_global.md#publicuser)

#### Parameters

| Name | Type |
| :------ | :------ |
| `internal` | `WithId`<[`InternalUser`](types_global.md#internaluser)\> |

#### Returns

[`PublicUser`](types_global.md#publicuser)

#### Defined in

[test/setup.ts:40](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L40)

___

### webpackTestFixture

▸ **webpackTestFixture**(): [`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Returns

[`MockFixture`](../interfaces/test_setup.MockFixture.md)

#### Defined in

[test/setup.ts:529](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L529)

___

### withMockedArgv

▸ **withMockedArgv**(`fn`, `newArgv`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `AnyVoid` |
| `newArgv` | `string`[] |
| `options` | [`MockArgvOptions`](test_setup.md#mockargvoptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:196](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L196)

___

### withMockedEnv

▸ **withMockedEnv**(`fn`, `newEnv`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `AnyVoid` |
| `newEnv` | `Record`<`string`, `string`\> |
| `options` | [`MockEnvOptions`](test_setup.md#mockenvoptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:229](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L229)

___

### withMockedExit

▸ **withMockedExit**(`fn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`spies`: { `exitSpy`: `jest.SpyInstance`  }) => `AnyVoid` |

#### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:299](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L299)

___

### withMockedFixture

▸ **withMockedFixture**<`CustomOptions`, `CustomContext`\>(`(destructured)`): `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `CustomOptions` | extends `Record`<`string`, `unknown`\>{} |
| `CustomContext` | extends `Record`<`string`, `unknown`\>{} |

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ fn })` | [`FixtureAction`](test_setup.md#fixtureaction)<[`FixtureContext`](../interfaces/test_setup.FixtureContext.md)<[`FixtureOptions`](../interfaces/test_setup.FixtureOptions.md) & `Partial`<`Record`<`string`, `unknown`\> & `CustomOptions`\>\> & `CustomContext`\> |
| ▶ `({ options? })` | `Partial`<[`FixtureOptions`](../interfaces/test_setup.FixtureOptions.md) & `CustomOptions`\> |
| ▶ `({ testIdentifier })` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:706](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L706)

___

### withMockedOutput

▸ **withMockedOutput**(`fn`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | (`spies`: { `errorSpy`: `jest.SpyInstance` ; `infoSpy`: `jest.SpyInstance` ; `logSpy`: `jest.SpyInstance` ; `stdErrSpy`: `jest.SpyInstance` ; `stdoutSpy`: `jest.SpyInstance` ; `warnSpy`: `jest.SpyInstance`  }) => `AnyVoid` |

#### Returns

`Promise`<`void`\>

#### Defined in

[test/setup.ts:331](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/setup.ts#L331)
