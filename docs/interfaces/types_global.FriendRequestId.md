[ghostmeme.api.hscc.bdpa.org][1] / [types/global][2] / FriendRequestId

# Interface: FriendRequestId

[types/global][2].FriendRequestId

## Hierarchy

- [`MemeId`][3]

  ↳ **`FriendRequestId`**

## Table of contents

### Properties

- [\_bsontype][4]
- [generationTime][5]
- [id][6]

### Methods

- [equals][7]
- [getTimestamp][8]
- [inspect][9]
- [toHexString][10]

## Properties

### \_bsontype

• **\_bsontype**: `"ObjectId"`

#### Inherited from

[MemeId][3].[\_bsontype][11]

#### Defined in

node_modules/bson/bson.d.ts:834

---

### generationTime

• **generationTime**: `number`

#### Inherited from

[MemeId][3].[generationTime][12]

#### Defined in

node_modules/bson/bson.d.ts:854

---

### id

• **id**: `Buffer`

#### Inherited from

[MemeId][3].[id][13]

#### Defined in

node_modules/bson/bson.d.ts:849

## Methods

### equals

▸ **equals**(`otherId`): `boolean`

Compares the equality of this ObjectId with `otherID`.

#### Parameters

| Name      | Type                                     | Description                           |
| :-------- | :--------------------------------------- | :------------------------------------ |
| `otherId` | `string` \| `ObjectId` \| `ObjectIdLike` | ObjectId instance to compare against. |

#### Returns

`boolean`

#### Inherited from

[MemeId][3].[equals][14]

#### Defined in

node_modules/bson/bson.d.ts:871

---

### getTimestamp

▸ **getTimestamp**(): `Date`

Returns the generation date (accurate up to the second) that this ID was
generated.

#### Returns

`Date`

#### Inherited from

[MemeId][3].[getTimestamp][15]

#### Defined in

node_modules/bson/bson.d.ts:873

---

### inspect

▸ **inspect**(): `string`

#### Returns

`string`

#### Inherited from

[MemeId][3].[inspect][16]

#### Defined in

node_modules/bson/bson.d.ts:895

---

### toHexString

▸ **toHexString**(): `string`

Returns the ObjectId id as a 24 character hex string representation

#### Returns

`string`

#### Inherited from

[MemeId][3].[toHexString][17]

#### Defined in

node_modules/bson/bson.d.ts:856

[1]: ../README.md
[2]: ../modules/types_global.md
[3]: types_global.MemeId.md
[4]: types_global.FriendRequestId.md#_bsontype
[5]: types_global.FriendRequestId.md#generationtime
[6]: types_global.FriendRequestId.md#id
[7]: types_global.FriendRequestId.md#equals
[8]: types_global.FriendRequestId.md#gettimestamp
[9]: types_global.FriendRequestId.md#inspect
[10]: types_global.FriendRequestId.md#tohexstring
[11]: types_global.MemeId.md#_bsontype
[12]: types_global.MemeId.md#generationtime
[13]: types_global.MemeId.md#id
[14]: types_global.MemeId.md#equals
[15]: types_global.MemeId.md#gettimestamp
[16]: types_global.MemeId.md#inspect
[17]: types_global.MemeId.md#tohexstring
