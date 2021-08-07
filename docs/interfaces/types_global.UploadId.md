[ghostmeme.api.hscc.bdpa.org](../README.md) / [types/global](../modules/types_global.md) / UploadId

# Interface: UploadId

[types/global](../modules/types_global.md).UploadId

## Hierarchy

- `ObjectId`

  ↳ **`UploadId`**

## Table of contents

### Properties

- [\_bsontype](types_global.UploadId.md#_bsontype)
- [generationTime](types_global.UploadId.md#generationtime)
- [id](types_global.UploadId.md#id)

### Methods

- [equals](types_global.UploadId.md#equals)
- [getTimestamp](types_global.UploadId.md#gettimestamp)
- [inspect](types_global.UploadId.md#inspect)
- [toHexString](types_global.UploadId.md#tohexstring)

## Properties

### \_bsontype

• **\_bsontype**: ``"ObjectId"``

#### Inherited from

ObjectId.\_bsontype

#### Defined in

node_modules/bson/bson.d.ts:834

___

### generationTime

• **generationTime**: `number`

#### Inherited from

ObjectId.generationTime

#### Defined in

node_modules/bson/bson.d.ts:854

___

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `otherId` | `string` \| `ObjectId` \| `ObjectIdLike` | ObjectId instance to compare against. |

#### Returns

`boolean`

#### Inherited from

ObjectId.equals

#### Defined in

node_modules/bson/bson.d.ts:871

___

### getTimestamp

▸ **getTimestamp**(): `Date`

Returns the generation date (accurate up to the second) that this ID was generated.

#### Returns

`Date`

#### Inherited from

ObjectId.getTimestamp

#### Defined in

node_modules/bson/bson.d.ts:873

___

### inspect

▸ **inspect**(): `string`

#### Returns

`string`

#### Inherited from

ObjectId.inspect

#### Defined in

node_modules/bson/bson.d.ts:895

___

### toHexString

▸ **toHexString**(): `string`

Returns the ObjectId id as a 24 character hex string representation

#### Returns

`string`

#### Inherited from

ObjectId.toHexString

#### Defined in

node_modules/bson/bson.d.ts:856
