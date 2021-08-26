[ghostmeme.api.hscc.bdpa.org][1] / test/db

# Module: test/db

## Table of contents

### Type aliases

- [DummyDbData][2]

### Variables

- [dummyDbData][2]

### Functions

- [hydrateDb][3]
- [setupTestDb][4]

## Type aliases

### DummyDbData

Ƭ **DummyDbData**: `Object`

#### Type declaration

| Name          | Type                                        | Description                                                               |
| :------------ | :------------------------------------------ | :------------------------------------------------------------------------ |
| `bans`        | `WithId`<[`InternalLimitedLogEntry`][5]>\[] | -                                                                         |
| `generatedAt` | `number`                                    | Timestamp of when this dummy data was generated (in ms since unix epoch). |
| `info`        | `WithId`<[`InternalInfo`][6]>               | -                                                                         |
| `keys`        | `WithId`<[`InternalApiKey`][7]>\[]          | -                                                                         |
| `logs`        | `WithId`<[`InternalRequestLogEntry`][8]>\[] | -                                                                         |
| `memes`       | `WithId`<[`InternalMeme`][9]>\[]            | -                                                                         |
| `uploads`     | `WithId`<[`InternalUpload`][10]>\[]         | -                                                                         |
| `users`       | `WithId`<[`InternalUser`][11]>\[]           | -                                                                         |

#### Defined in

[test/db.ts:37][12]

## Variables

### dummyDbData

• `Const` **dummyDbData**: [`DummyDbData`][2]

#### Defined in

[test/db.ts:58][13]

## Functions

### hydrateDb

▸ **hydrateDb**(`db`, `data`): `Promise`<[`DummyDbData`][2]>

#### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `db`   | `Db`               |
| `data` | [`DummyDbData`][2] |

#### Returns

`Promise`<[`DummyDbData`][2]>

#### Defined in

[test/db.ts:235][14]

---

### setupTestDb

▸ **setupTestDb**(`defer?`): `Object`

Setup a test version of the database using jest lifecycle hooks.

#### Parameters

| Name    | Type      | Default value | Description                                                                                                                                                                                                     |
| :------ | :-------- | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defer` | `boolean` | `false`       | If `true`, `beforeEach` and `afterEach` lifecycle hooks are skipped and the database is initialized and hydrated once before all tests are run. **In this mode, all tests will share the same database state!** |

#### Returns

`Object`

| Name                | Type                                                            |
| :------------------ | :-------------------------------------------------------------- |
| `getDb`             | (`params?`: { `external`: `true` }) => `Promise`<`Db`>          |
| `getDbClient`       | (`params?`: { `external`: `true` }) => `Promise`<`MongoClient`> |
| `getNewClientAndDb` | () => `Promise`<`Object`>                                       |

#### Defined in

[test/db.ts:261][15]

[1]: ../README.md
[2]: test_db.md#dummydbdata
[3]: test_db.md#hydratedb
[4]: test_db.md#setuptestdb
[5]: types_global.md#internallimitedlogentry
[6]: types_global.md#internalinfo
[7]: types_global.md#internalapikey
[8]: types_global.md#internalrequestlogentry
[9]: types_global.md#internalmeme
[10]: types_global.md#internalupload
[11]: types_global.md#internaluser
[12]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/db.ts#L37
[13]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/db.ts#L58
[14]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/db.ts#L235
[15]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/test/db.ts#L261
