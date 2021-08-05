[ghostmeme.api.hscc.bdpa.org](../README.md) / test/db

# Module: test/db

## Table of contents

### Type aliases

- [DummyDbData](test_db.md#dummydbdata)

### Variables

- [dummyDbData](test_db.md#dummydbdata)

### Functions

- [hydrateDb](test_db.md#hydratedb)
- [setupTestDb](test_db.md#setuptestdb)

## Type aliases

### DummyDbData

Ƭ **DummyDbData**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bans` | `WithId`<[`InternalLimitedLogEntry`](types_global.md#internallimitedlogentry)\>[] | - |
| `generatedAt` | `number` | Timestamp of when this dummy data was generated (in ms since unix epoch). |
| `info` | `WithId`<[`InternalInfo`](types_global.md#internalinfo)\> | - |
| `keys` | `WithId`<[`InternalApiKey`](types_global.md#internalapikey)\>[] | - |
| `logs` | `WithId`<[`InternalRequestLogEntry`](types_global.md#internalrequestlogentry)\>[] | - |
| `memes` | `WithId`<[`InternalMeme`](types_global.md#internalmeme)\>[] | - |
| `users` | `WithId`<[`InternalUser`](types_global.md#internaluser)\>[] | - |

#### Defined in

[test/db.ts:36](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/db.ts#L36)

## Variables

### dummyDbData

• `Const` **dummyDbData**: [`DummyDbData`](test_db.md#dummydbdata)

#### Defined in

[test/db.ts:56](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/db.ts#L56)

## Functions

### hydrateDb

▸ **hydrateDb**(`db`, `data`): `Promise`<[`DummyDbData`](test_db.md#dummydbdata)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | `Db` |
| `data` | [`DummyDbData`](test_db.md#dummydbdata) |

#### Returns

`Promise`<[`DummyDbData`](test_db.md#dummydbdata)\>

#### Defined in

[test/db.ts:212](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/db.ts#L212)

___

### setupTestDb

▸ **setupTestDb**(`defer?`): `Object`

Setup a test version of the database using jest lifecycle hooks.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `defer` | `boolean` | `false` | If `true`, `beforeEach` and `afterEach` lifecycle hooks are skipped and the database is initialized and hydrated once before all tests are run. **In this mode, all tests will share the same database state!** |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `getDb` | (`params?`: { `external`: ``true``  }) => `Promise`<`Db`\> |
| `getDbClient` | (`params?`: { `external`: ``true``  }) => `Promise`<`MongoClient`\> |
| `getNewClientAndDb` | () => `Promise`<`Object`\> |

#### Defined in

[test/db.ts:235](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/test/db.ts#L235)
