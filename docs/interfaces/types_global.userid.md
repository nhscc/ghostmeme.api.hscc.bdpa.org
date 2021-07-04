[ghostmeme.api.hscc.bdpa.org][1] / [types/global][2] / UserId

# Interface: UserId

[types/global][2].UserId

## Hierarchy

- `ObjectId`

  ↳ **`UserId`**

## Table of contents

### Properties

- [generationTime][3]

### Methods

- [equals][4]
- [getTimestamp][5]
- [toHexString][6]

## Properties

### generationTime

• **generationTime**: `number`

The generation time of this ObjectId instance

#### Inherited from

ObjectId.generationTime

#### Defined in

node_modules/@types/bson/index.d.ts:365

## Methods

### equals

▸ **equals**(`otherID`): `boolean`

Compares the equality of this ObjectId with `otherID`.

#### Parameters

| Name      | Type                   | Description                           |
| :-------- | :--------------------- | :------------------------------------ |
| `otherID` | `string` \| `ObjectId` | ObjectId instance to compare against. |

#### Returns

`boolean`

the result of comparing two ObjectId's

#### Inherited from

ObjectId.equals

#### Defined in

node_modules/@types/bson/index.d.ts:391

---

### getTimestamp

▸ **getTimestamp**(): `Date`

Returns the generation date (accurate up to the second) that this ID was
generated.

#### Returns

`Date`

the generation date

#### Inherited from

ObjectId.getTimestamp

#### Defined in

node_modules/@types/bson/index.d.ts:402

---

### toHexString

▸ **toHexString**(): `string`

Return the ObjectId id as a 24 byte hex string representation

#### Returns

`string`

return the 24 byte hex string representation.

#### Inherited from

ObjectId.toHexString

#### Defined in

node_modules/@types/bson/index.d.ts:407

[1]: ../README.md
[2]: ../modules/types_global.md
[3]: types_global.userid.md#generationtime
[4]: types_global.userid.md#equals
[5]: types_global.userid.md#gettimestamp
[6]: types_global.userid.md#tohexstring
