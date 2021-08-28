[ghostmeme.api.hscc.bdpa.org][1] / [types/global][2] / MemeId

# Interface: MemeId

[types/global][2].MemeId

## Hierarchy

- `ObjectId`

  ↳ **`MemeId`**

  ↳↳ [`FriendId`][3]

  ↳↳ [`FriendRequestId`][4]

## Table of contents

### Properties

- [\_bsontype][5]
- [generationTime][6]
- [id][7]

### Methods

- [equals][8]
- [getTimestamp][9]
- [inspect][10]
- [toHexString][11]

## Properties

### \_bsontype

• **\_bsontype**: `"ObjectId"`

#### Inherited from

ObjectId.\_bsontype

#### Defined in

node_modules/bson/bson.d.ts:834

---

### generationTime

• **generationTime**: `number`

#### Inherited from

ObjectId.generationTime

#### Defined in

node_modules/bson/bson.d.ts:854

---

### id

• **id**: `Buffer`

#### Inherited from

ObjectId.id

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

ObjectId.equals

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

ObjectId.getTimestamp

#### Defined in

node_modules/bson/bson.d.ts:873

---

### inspect

▸ **inspect**(): `string`

#### Returns

`string`

#### Inherited from

ObjectId.inspect

#### Defined in

node_modules/bson/bson.d.ts:895

---

### toHexString

▸ **toHexString**(): `string`

Returns the ObjectId id as a 24 character hex string representation

#### Returns

`string`

#### Inherited from

ObjectId.toHexString

#### Defined in

node_modules/bson/bson.d.ts:856

[1]: ../README.md
[2]: ../modules/types_global.md
[3]: types_global.FriendId.md
[4]: types_global.FriendRequestId.md
[5]: types_global.MemeId.md#_bsontype
[6]: types_global.MemeId.md#generationtime
[7]: types_global.MemeId.md#id
[8]: types_global.MemeId.md#equals
[9]: types_global.MemeId.md#gettimestamp
[10]: types_global.MemeId.md#inspect
[11]: types_global.MemeId.md#tohexstring
