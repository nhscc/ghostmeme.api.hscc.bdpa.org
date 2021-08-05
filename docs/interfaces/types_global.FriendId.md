[ghostmeme.api.hscc.bdpa.org](../README.md) / [types/global](../modules/types_global.md) / FriendId

# Interface: FriendId

[types/global](../modules/types_global.md).FriendId

## Hierarchy

- [`MemeId`](types_global.MemeId.md)

  ↳ **`FriendId`**

## Table of contents

### Properties

- [\_bsontype](types_global.FriendId.md#_bsontype)
- [generationTime](types_global.FriendId.md#generationtime)
- [id](types_global.FriendId.md#id)

### Methods

- [equals](types_global.FriendId.md#equals)
- [getTimestamp](types_global.FriendId.md#gettimestamp)
- [inspect](types_global.FriendId.md#inspect)
- [toHexString](types_global.FriendId.md#tohexstring)

## Properties

### \_bsontype

• **\_bsontype**: ``"ObjectId"``

#### Inherited from

[MemeId](types_global.MemeId.md).[_bsontype](types_global.MemeId.md#_bsontype)

#### Defined in

node_modules/bson/bson.d.ts:834

___

### generationTime

• **generationTime**: `number`

#### Inherited from

[MemeId](types_global.MemeId.md).[generationTime](types_global.MemeId.md#generationtime)

#### Defined in

node_modules/bson/bson.d.ts:854

___

### id

• **id**: `Buffer`

#### Inherited from

[MemeId](types_global.MemeId.md).[id](types_global.MemeId.md#id)

#### Defined in

node_modules/bson/bson.d.ts:849

## Methods

### equals

▸ **equals**(`otherId`): `boolean`

Compares the equality of this ObjectId with `otherID`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `otherId` | `string` \| `ObjectId` \| `ObjectIdLike` | ObjectId instance to compare against. |

#### Returns

`boolean`

#### Inherited from

[MemeId](types_global.MemeId.md).[equals](types_global.MemeId.md#equals)

#### Defined in

node_modules/bson/bson.d.ts:871

___

### getTimestamp

▸ **getTimestamp**(): `Date`

Returns the generation date (accurate up to the second) that this ID was generated.

#### Returns

`Date`

#### Inherited from

[MemeId](types_global.MemeId.md).[getTimestamp](types_global.MemeId.md#gettimestamp)

#### Defined in

node_modules/bson/bson.d.ts:873

___

### inspect

▸ **inspect**(): `string`

#### Returns

`string`

#### Inherited from

[MemeId](types_global.MemeId.md).[inspect](types_global.MemeId.md#inspect)

#### Defined in

node_modules/bson/bson.d.ts:895

___

### toHexString

▸ **toHexString**(): `string`

Returns the ObjectId id as a 24 character hex string representation

#### Returns

`string`

#### Inherited from

[MemeId](types_global.MemeId.md).[toHexString](types_global.MemeId.md#tohexstring)

#### Defined in

node_modules/bson/bson.d.ts:856
