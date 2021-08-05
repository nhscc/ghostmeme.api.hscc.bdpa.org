[ghostmeme.api.hscc.bdpa.org](../README.md) / test/integration.fixtures

# Module: test/integration.fixtures

## Table of contents

### Type aliases

- [NextApiHandlerMixin](test_integration_fixtures.md#nextapihandlermixin)
- [TestFixture](test_integration_fixtures.md#testfixture)
- [TestResult](test_integration_fixtures.md#testresult)
- [TestResultset](test_integration_fixtures.md#testresultset)

### Functions

- [getFixtures](test_integration_fixtures.md#getfixtures)

## Type aliases

### NextApiHandlerMixin

Ƭ **NextApiHandlerMixin**: `NextApiHandler`<`unknown`\> & { `config?`: `PageConfig` ; `url?`: `string`  }

#### Defined in

[test/integration.fixtures.ts:28](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/integration.fixtures.ts#L28)

___

### TestFixture

Ƭ **TestFixture**: `Object`

Represents a test that executes an HTTP request and evaluate the response
for correctness.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `body?` | `Record`<`string`, `unknown`\> \| (`prevResults`: [`TestResultset`](test_integration_fixtures.md#testresultset)) => `Promisable`<`Record`<`string`, `unknown`\>\> | The body of the mock request. Automatically stringified. |
| `displayIndex` | `number` | The test index X (as in "#X") that is reported to the user when a test fails. |
| `handler?` | [`NextApiHandlerMixin`](test_integration_fixtures.md#nextapihandlermixin) | The handler under test. |
| `id?` | `string` | An optional id that can be used to reference the result from this fixture directly as opposed to by index.  **`example`** getResultAt('my-id') === getResultAt(22) |
| `method?` | ``"GET"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` | The method of the mock request. |
| `params?` | `Record`<`string`, `string` \| `string`[]\> \| (`prevResults`: [`TestResultset`](test_integration_fixtures.md#testresultset)) => `Promisable`<`Record`<`string`, `string` \| `string`[]\>\> | Represents mock "processed" dynamic route components and query params. |
| `response?` | `Object` | The expected shape of the HTTP response. |
| `response.json?` | `Record`<`string`, `unknown`\> \| `jest.AsymmetricMatcher` \| (`json`: `Record`<`string`, `unknown`\> \| `undefined`, `prevResults`: [`TestResultset`](test_integration_fixtures.md#testresultset)) => `Promisable`<`Record`<`string`, `unknown`\> \| `jest.AsymmetricMatcher` \| `undefined`\> | The expected JSON response body. No need to test for `success` as that is handled automatically (unless a status callback was used and it returned `undefined`). Jest async matchers are also supported. All json-related checks are skipped if a callback is provided that returns `undefined` or `json` itself is `undefined`. |
| `response.status?` | `number` \| (`status`: `number`, `prevResults`: [`TestResultset`](test_integration_fixtures.md#testresultset)) => `Promisable`<`number` \| `undefined`\> | The expected response status. If status != 200, we expect `json.success` to be `false`. Otherwise, we expect it to be `true`. All status-related checks are skipped if if a callback is provided that returns `undefined`. |
| `subject?` | `string` | A very brief couple of words added to the end of the test title. |

#### Defined in

[test/integration.fixtures.ts:76](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/integration.fixtures.ts#L76)

___

### TestResult

Ƭ **TestResult**<`T`\>: `Object`

A single test result stored in `memory`.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `json` | `T` \| `undefined` |
| `status` | `number` |

#### Defined in

[test/integration.fixtures.ts:37](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/integration.fixtures.ts#L37)

___

### TestResultset

Ƭ **TestResultset**: [`TestResult`](test_integration_fixtures.md#testresult)[] & { `idMap`: `Record`<`string`, [`TestResult`](test_integration_fixtures.md#testresult)\> ; `latest`: [`TestResult`](test_integration_fixtures.md#testresult) ; `getResultAt`: <T\>(`index`: `number`) => [`TestResult`](test_integration_fixtures.md#testresult)<`T`\><T\>(`index`: `number`, `prop`: `string`) => `T`<T\>(`index`: `string`) => [`TestResult`](test_integration_fixtures.md#testresult)<`T`\><T\>(`index`: `string`, `prop`: `string`) => `T`  }

Stored results from past fixtures runs made available for future fixtures
runs via `memory`.

#### Defined in

[test/integration.fixtures.ts:46](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/integration.fixtures.ts#L46)

## Functions

### getFixtures

▸ **getFixtures**(`api`): `Promise`<[`TestFixture`](test_integration_fixtures.md#testfixture)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `Record`<`string`, [`NextApiHandlerMixin`](test_integration_fixtures.md#nextapihandlermixin)\> |

#### Returns

`Promise`<[`TestFixture`](test_integration_fixtures.md#testfixture)[]\>

#### Defined in

[test/integration.fixtures.ts:142](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/test/integration.fixtures.ts#L142)
