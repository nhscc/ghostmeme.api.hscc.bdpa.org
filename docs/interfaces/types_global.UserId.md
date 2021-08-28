[ghostmeme.api.hscc.bdpa.org][1] / [types/global][2] / UserId

# Interface: UserId

[types/global][2].UserId

## Hierarchy

- `ObjectId`

  ↳ **`UserId`**

## Table of contents

### Properties

- [\_bsontype][3]
- [generationTime][4]
- [id][5]

### Methods

- [equals][6]
- [getTimestamp][7]
- [inspect][8]
- [toHexString][9]

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
[3]: types_global.UserId.md#_bsontype
[4]: types_global.UserId.md#generationtime
[5]: types_global.UserId.md#id
[6]: types_global.UserId.md#equals
[7]: types_global.UserId.md#gettimestamp
[8]: types_global.UserId.md#inspect
[9]: types_global.UserId.md#tohexstring
