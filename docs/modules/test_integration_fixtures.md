[ghostmeme.api.hscc.bdpa.org][1] / test/integration.fixtures

# Module: test/integration.fixtures

## Table of contents

### Type aliases

- [NextApiHandlerMixin][2]
- [TestFixture][3]
- [TestResult][4]
- [TestResultset][5]

### Functions

- [getFixtures][6]

## Type aliases

### NextApiHandlerMixin

Ƭ **NextApiHandlerMixin**: `NextApiHandler`<`unknown`> & { `config?`:
`PageConfig` ; `url?`: `string` }

#### Defined in

[test/integration.fixtures.ts:27][7]

---

### TestFixture

Ƭ **TestFixture**: `Object`

Represents a test that executes an HTTP request and evaluate the response for
correctness.

#### Type declaration

| Name               | Type                                                                                                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                      |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body?`            | `Record`<`string`, `unknown`> \| (`prevResults`: [`TestResultset`][5]) => `Record`<`string`, `unknown`>                                                                                                                              | The body of the mock request. Automatically stringified.                                                                                                                                                                                                                                                                         |
| `displayIndex`     | `number`                                                                                                                                                                                                                             | The test index X (as in "#X") that is reported to the user when a test fails.                                                                                                                                                                                                                                                    |
| `handler?`         | [`NextApiHandlerMixin`][2]                                                                                                                                                                                                           | The handler under test.                                                                                                                                                                                                                                                                                                          |
| `id?`              | `string`                                                                                                                                                                                                                             | An optional id that can be used to reference the result from this fixture directly as opposed to by index. **`example`** getResultAt('my-id') === getResultAt(22)                                                                                                                                                                |
| `method?`          | `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"`                                                                                                                                                                                         | The method of the mock request.                                                                                                                                                                                                                                                                                                  |
| `params?`          | `Record`<`string`, `string` \| `string`[]> \| (`prevResults`: [`TestResultset`][5]) => `Record`<`string`, `string` \| `string`[]>                                                                                                    | Represents mock "processed" dynamic route components and query params.                                                                                                                                                                                                                                                           |
| `response?`        | `Object`                                                                                                                                                                                                                             | The expected shape of the HTTP response.                                                                                                                                                                                                                                                                                         |
| `response.json?`   | `Record`<`string`, `unknown`> \| `jest.AsymmetricMatcher` \| (`json`: `Record`<`string`, `unknown`> \| `undefined`, `prevResults`: [`TestResultset`][5]) => `Record`<`string`, `unknown`> \| `jest.AsymmetricMatcher` \| `undefined` | The expected JSON response body. No need to test for `success` as that is handled automatically (unless a status callback was used and it returned `undefined`). Jest async matchers are also supported. All json-related checks are skipped if a callback is provided that returns `undefined` or `json` itself is `undefined`. |
| `response.status?` | `number` \| (`status`: `number`, `prevResults`: [`TestResultset`][5]) => `number` \| `undefined`                                                                                                                                     | The expected response status. If status != 200, we expect `json.success` to be `false`. Otherwise, we expect it to be `true`. All status-related checks are skipped if if a callback is provided that returns `undefined`.                                                                                                       |
| `subject?`         | `string`                                                                                                                                                                                                                             | A very brief couple of words added to the end of the test title.                                                                                                                                                                                                                                                                 |

#### Defined in

[test/integration.fixtures.ts:75][8]

---

### TestResult

Ƭ **TestResult**<`T`>: `Object`

A single test result stored in `memory`.

#### Type parameters

| Name | Type  |
| :--- | :---- |
| `T`  | `any` |

#### Type declaration

| Name     | Type               |
| :------- | :----------------- |
| `json`   | `T` \| `undefined` |
| `status` | `number`           |

#### Defined in

[test/integration.fixtures.ts:36][9]

---

### TestResultset

Ƭ **TestResultset**: [`TestResult`][4]\[] & { `idMap`: `Record`<`string`,
[`TestResult`][4]> ; `latest`: [`TestResult`][4] ; `getResultAt`: \<T>(`index`:
`number`) => [`TestResult`][4]<`T`>\<T>(`index`: `number`, `prop`: `string`) =>
`T`\<T>(`index`: `string`) => [`TestResult`][4]<`T`>\<T>(`index`: `string`,
`prop`: `string`) => `T` }

Stored results from past fixtures runs made available for future fixtures runs
via `memory`.

#### Defined in

[test/integration.fixtures.ts:45][10]

## Functions

### getFixtures

▸ **getFixtures**(`api`): [`TestFixture`][3]\[]

#### Parameters

| Name  | Type                                           |
| :---- | :--------------------------------------------- |
| `api` | `Record`<`string`, [`NextApiHandlerMixin`][2]> |

#### Returns

[`TestFixture`][3]\[]

#### Defined in

[test/integration.fixtures.ts:141][11]

[1]: ../README.md
[2]: test_integration_fixtures.md#nextapihandlermixin
[3]: test_integration_fixtures.md#testfixture
[4]: test_integration_fixtures.md#testresult
[5]: test_integration_fixtures.md#testresultset
[6]: test_integration_fixtures.md#getfixtures
[7]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/integration.fixtures.ts#L27
[8]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/integration.fixtures.ts#L75
[9]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/integration.fixtures.ts#L36
[10]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/integration.fixtures.ts#L45
[11]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/test/integration.fixtures.ts#L141
