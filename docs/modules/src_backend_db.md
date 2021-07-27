[ghostmeme.api.hscc.bdpa.org][1] / src/backend/db

# Module: src/backend/db

## Table of contents

### Type aliases

- [IdItem][2]
- [IdItemArray][3]

### Functions

- [closeDb][4]
- [destroyDb][5]
- [getDb][6]
- [getDbClient][7]
- [initializeDb][8]
- [itemExists][9]
- [itemToObjectId][10]
- [itemToStringId][11]
- [setClientAndDb][12]

## Type aliases

### IdItem

Ƭ **IdItem**<`T`>: `WithId`<`unknown`> | `string` | `T` | `Nullish`

#### Type parameters

| Name | Type               |
| :--- | :----------------- |
| `T`  | extends `ObjectId` |

#### Defined in

[src/backend/db.ts:147][13]

---

### IdItemArray

Ƭ **IdItemArray**<`T`>: `WithId`<`unknown`>\[] | `string`\[] | `T`\[] |
`Nullish`

#### Type parameters

| Name | Type               |
| :--- | :----------------- |
| `T`  | extends `ObjectId` |

#### Defined in

[src/backend/db.ts:148][14]

## Functions

### closeDb

▸ **closeDb**(): `Promise`<`void`>

Kills the MongoClient and closes any lingering database connections.

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/db.ts:49][15]

---

### destroyDb

▸ **destroyDb**(`db`): `Promise`<`void`>

Destroys all collections in the database. Can be called multiple times safely.
Used primarily for testing purposes.

#### Parameters

| Name | Type |
| :--- | :--- |
| `db` | `Db` |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/db.ts:68][16]

---

### getDb

▸ **getDb**(`params?`): `Promise`<`Db`>

Lazily connects to the database once on-demand instead of immediately when the
app runs.

#### Parameters

| Name              | Type     |
| :---------------- | :------- |
| `params?`         | `Object` |
| `params.external` | `true`   |

#### Returns

`Promise`<`Db`>

#### Defined in

[src/backend/db.ts:15][17]

---

### getDbClient

▸ **getDbClient**(`params?`): `Promise`<`MongoClient`>

Returns the MongoClient instance used to connect to the database.

#### Parameters

| Name              | Type     | Description                                                    |
| :---------------- | :------- | :------------------------------------------------------------- |
| `params?`         | `Object` | if `{external: true}`, external Mongo connect URI will be used |
| `params.external` | `true`   | -                                                              |

#### Returns

`Promise`<`MongoClient`>

#### Defined in

[src/backend/db.ts:40][18]

---

### initializeDb

▸ **initializeDb**(`db`): `Promise`<`void`>

Initializes the database collections and indices. This function is idempotent
and can be called without worry of data loss.

#### Parameters

| Name | Type |
| :--- | :--- |
| `db` | `Db` |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/db.ts:83][19]

---

### itemExists

▸ **itemExists**<`T`>(`collection`, `id`, `key?`, `options?`):
`Promise`<`boolean`>

Checks if an item identified by some `key` (default identifier is `"_id"`)
exists within `collection`.

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name         | Type                                                |
| :----------- | :-------------------------------------------------- |
| `collection` | `Collection`<`T`>                                   |
| `id`         | `ObjectId`                                          |
| `key?`       | `"_id"` \| `"owner"` \| `"receiver"` \| `"replyTo"` |
| `options?`   | `ItemExistsOptions`                                 |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/db.ts:109][20]

▸ **itemExists**<`T`>(`collection`, `id`, `key`, `options?`):
`Promise`<`boolean`>

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name         | Type                |
| :----------- | :------------------ |
| `collection` | `Collection`<`T`>   |
| `id`         | `string`            |
| `key`        | `string`            |
| `options?`   | `ItemExistsOptions` |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/db.ts:115][21]

---

### itemToObjectId

▸ **itemToObjectId**<`T`>(`item`): `T`

Reduces an `item` down to its `ObjectId` instance.

#### Type parameters

| Name | Type                    |
| :--- | :---------------------- |
| `T`  | extends `ObjectId`<`T`> |

#### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `item` | [`IdItem`][2]<`T`> |

#### Returns

`T`

#### Defined in

[src/backend/db.ts:157][22]

▸ **itemToObjectId**<`T`>(`item`): `T`\[]

Reduces an array of `item`s down to its `ObjectId` instances.

#### Type parameters

| Name | Type                    |
| :--- | :---------------------- |
| `T`  | extends `ObjectId`<`T`> |

#### Parameters

| Name   | Type                    |
| :----- | :---------------------- |
| `item` | [`IdItemArray`][3]<`T`> |

#### Returns

`T`\[]

#### Defined in

[src/backend/db.ts:161][23]

---

### itemToStringId

▸ **itemToStringId**<`T`>(`item`): `string`

Reduces an `item` down to the string representation of its `ObjectId` instance.

#### Type parameters

| Name | Type                    |
| :--- | :---------------------- |
| `T`  | extends `ObjectId`<`T`> |

#### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `item` | [`IdItem`][2]<`T`> |

#### Returns

`string`

#### Defined in

[src/backend/db.ts:192][24]

▸ **itemToStringId**<`T`>(`item`): `string`\[]

Reduces an array of `item`s down to the string representations of their
respective `ObjectId` instances.

#### Type parameters

| Name | Type                    |
| :--- | :---------------------- |
| `T`  | extends `ObjectId`<`T`> |

#### Parameters

| Name   | Type                    |
| :----- | :---------------------- |
| `item` | [`IdItemArray`][3]<`T`> |

#### Returns

`string`\[]

#### Defined in

[src/backend/db.ts:197][25]

---

### setClientAndDb

▸ **setClientAndDb**(`(destructured)`): `void`

Sets the global db instance to something else. Used primarily for testing
purposes.

#### Parameters

| Name             | Type          |
| :--------------- | :------------ |
| `(destructured)` | `Object`      |
| ▶ `({ client })` | `MongoClient` |
| ▶ `({ db })`     | `Db`          |

#### Returns

`void`

#### Defined in

[src/backend/db.ts:58][26]

[1]: ../README.md
[2]: src_backend_db.md#iditem
[3]: src_backend_db.md#iditemarray
[4]: src_backend_db.md#closedb
[5]: src_backend_db.md#destroydb
[6]: src_backend_db.md#getdb
[7]: src_backend_db.md#getdbclient
[8]: src_backend_db.md#initializedb
[9]: src_backend_db.md#itemexists
[10]: src_backend_db.md#itemtoobjectid
[11]: src_backend_db.md#itemtostringid
[12]: src_backend_db.md#setclientanddb
[13]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L147
[14]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L148
[15]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L49
[16]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L68
[17]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L15
[18]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L40
[19]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L83
[20]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L109
[21]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L115
[22]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L157
[23]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L161
[24]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L192
[25]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L197
[26]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/9eb38c4/src/backend/db.ts#L58
