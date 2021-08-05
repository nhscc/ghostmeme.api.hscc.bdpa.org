[ghostmeme.api.hscc.bdpa.org](../README.md) / src/backend/db

# Module: src/backend/db

## Table of contents

### Type aliases

- [IdItem](src_backend_db.md#iditem)
- [IdItemArray](src_backend_db.md#iditemarray)

### Functions

- [closeDb](src_backend_db.md#closedb)
- [destroyDb](src_backend_db.md#destroydb)
- [getDb](src_backend_db.md#getdb)
- [getDbClient](src_backend_db.md#getdbclient)
- [initializeDb](src_backend_db.md#initializedb)
- [itemExists](src_backend_db.md#itemexists)
- [itemToObjectId](src_backend_db.md#itemtoobjectid)
- [itemToStringId](src_backend_db.md#itemtostringid)
- [setClientAndDb](src_backend_db.md#setclientanddb)

## Type aliases

### IdItem

Ƭ **IdItem**<`T`\>: `WithId`<`unknown`\> \| `string` \| `T` \| `Nullish`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ObjectId` |

#### Defined in

[src/backend/db.ts:147](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L147)

___

### IdItemArray

Ƭ **IdItemArray**<`T`\>: `WithId`<`unknown`\>[] \| `string`[] \| `T`[] \| `Nullish`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ObjectId` |

#### Defined in

[src/backend/db.ts:148](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L148)

## Functions

### closeDb

▸ **closeDb**(): `Promise`<`void`\>

Kills the MongoClient and closes any lingering database connections.

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/db.ts:49](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L49)

___

### destroyDb

▸ **destroyDb**(`db`): `Promise`<`void`\>

Destroys all collections in the database. Can be called multiple times
safely. Used primarily for testing purposes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | `Db` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/db.ts:68](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L68)

___

### getDb

▸ **getDb**(`params?`): `Promise`<`Db`\>

Lazily connects to the database once on-demand instead of immediately when
the app runs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Object` |
| `params.external` | ``true`` |

#### Returns

`Promise`<`Db`\>

#### Defined in

[src/backend/db.ts:19](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L19)

___

### getDbClient

▸ **getDbClient**(`params?`): `Promise`<`MongoClient`\>

Returns the MongoClient instance used to connect to the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params?` | `Object` | if `{external: true}`, external Mongo connect URI will be used |
| `params.external` | ``true`` | - |

#### Returns

`Promise`<`MongoClient`\>

#### Defined in

[src/backend/db.ts:40](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L40)

___

### initializeDb

▸ **initializeDb**(`db`): `Promise`<`void`\>

Initializes the database collections and indices. This function is idempotent
and can be called without worry of data loss.

#### Parameters

| Name | Type |
| :------ | :------ |
| `db` | `Db` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/db.ts:83](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L83)

___

### itemExists

▸ **itemExists**<`T`\>(`collection`, `id`, `key?`, `options?`): `Promise`<`boolean`\>

Checks if an item identified by some `key` (default identifier is `"_id"`)
exists within `collection`.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `Collection`<`T`\> |
| `id` | `ObjectId` |
| `key?` | ``"_id"`` \| ``"owner"`` \| ``"receiver"`` \| ``"replyTo"`` |
| `options?` | `ItemExistsOptions` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/backend/db.ts:109](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L109)

▸ **itemExists**<`T`\>(`collection`, `id`, `key`, `options?`): `Promise`<`boolean`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `Collection`<`T`\> |
| `id` | `string` |
| `key` | `string` |
| `options?` | `ItemExistsOptions` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/backend/db.ts:115](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L115)

___

### itemToObjectId

▸ **itemToObjectId**<`T`\>(`item`): `T`

Reduces an `item` down to its `ObjectId` instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ObjectId`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IdItem`](src_backend_db.md#iditem)<`T`\> |

#### Returns

`T`

#### Defined in

[src/backend/db.ts:157](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L157)

▸ **itemToObjectId**<`T`\>(`item`): `T`[]

Reduces an array of `item`s down to its `ObjectId` instances.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ObjectId`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IdItemArray`](src_backend_db.md#iditemarray)<`T`\> |

#### Returns

`T`[]

#### Defined in

[src/backend/db.ts:161](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L161)

___

### itemToStringId

▸ **itemToStringId**<`T`\>(`item`): `string`

Reduces an `item` down to the string representation of its `ObjectId`
instance.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ObjectId`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IdItem`](src_backend_db.md#iditem)<`T`\> |

#### Returns

`string`

#### Defined in

[src/backend/db.ts:192](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L192)

▸ **itemToStringId**<`T`\>(`item`): `string`[]

Reduces an array of `item`s down to the string representations of their
respective `ObjectId` instances.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `ObjectId`<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IdItemArray`](src_backend_db.md#iditemarray)<`T`\> |

#### Returns

`string`[]

#### Defined in

[src/backend/db.ts:197](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L197)

___

### setClientAndDb

▸ **setClientAndDb**(`(destructured)`): `void`

Sets the global db instance to something else. Used primarily for testing
purposes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ client })` | `MongoClient` |
| ▶ `({ db })` | `Db` |

#### Returns

`void`

#### Defined in

[src/backend/db.ts:58](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/311fb73/src/backend/db.ts#L58)
