[ghostmeme.api.hscc.bdpa.org](../README.md) / src/backend

# Module: src/backend

## Table of contents

### Variables

- [BANNED\_KEY](src_backend.md#banned_key)
- [DEV\_KEY](src_backend.md#dev_key)
- [DUMMY\_KEY](src_backend.md#dummy_key)
- [NULL\_KEY](src_backend.md#null_key)
- [publicMemeProjection](src_backend.md#publicmemeprojection)
- [publicUserProjection](src_backend.md#publicuserprojection)

### Functions

- [addFriendRequest](src_backend.md#addfriendrequest)
- [addLikedMeme](src_backend.md#addlikedmeme)
- [addToRequestLog](src_backend.md#addtorequestlog)
- [addUserAsFriend](src_backend.md#adduserasfriend)
- [createMeme](src_backend.md#creatememe)
- [createUser](src_backend.md#createuser)
- [deleteUser](src_backend.md#deleteuser)
- [getAllUsers](src_backend.md#getallusers)
- [getApiKeys](src_backend.md#getapikeys)
- [getFriendRequestsOfType](src_backend.md#getfriendrequestsoftype)
- [getMemeLikesUserIds](src_backend.md#getmemelikesuserids)
- [getMemes](src_backend.md#getmemes)
- [getSystemInfo](src_backend.md#getsysteminfo)
- [getUser](src_backend.md#getuser)
- [getUserFriendsUserIds](src_backend.md#getuserfriendsuserids)
- [getUserLikedMemeIds](src_backend.md#getuserlikedmemeids)
- [handleImageUpload](src_backend.md#handleimageupload)
- [isDueForContrivedError](src_backend.md#isdueforcontrivederror)
- [isFriendRequestOfType](src_backend.md#isfriendrequestoftype)
- [isKeyAuthentic](src_backend.md#iskeyauthentic)
- [isMemeLiked](src_backend.md#ismemeliked)
- [isRateLimited](src_backend.md#isratelimited)
- [isUserAFriend](src_backend.md#isuserafriend)
- [removeFriendRequest](src_backend.md#removefriendrequest)
- [removeLikedMeme](src_backend.md#removelikedmeme)
- [removeUserAsFriend](src_backend.md#removeuserasfriend)
- [searchMemes](src_backend.md#searchmemes)
- [updateMemes](src_backend.md#updatememes)
- [updateUser](src_backend.md#updateuser)

## Variables

### BANNED\_KEY

• `Const` **BANNED\_KEY**: ``"banned-h54e-6rt7-gctfh-hrftdygct0"``

This key is guaranteed to be rate limited when running in a test environment.

#### Defined in

[src/backend/index.ts:67](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L67)

___

### DEV\_KEY

• `Const` **DEV\_KEY**: ``"dev-xunn-dev-294a-536h-9751-rydmj"``

This key can be used to authenticate with local and non-production
deployments.

#### Defined in

[src/backend/index.ts:73](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L73)

___

### DUMMY\_KEY

• `Const` **DUMMY\_KEY**: ``"12349b61-83a7-4036-b060-213784b491"``

This key is valid only when running in a test environment.

#### Defined in

[src/backend/index.ts:62](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L62)

___

### NULL\_KEY

• `Const` **NULL\_KEY**: ``"00000000-0000-0000-0000-000000000000"``

This key is guaranteed never to appear in dummy data generated during tests.
In production, this key is used in place of `null` where a string key is
required (e.g. the `meta.creator` field for auto-generated users).

#### Defined in

[src/backend/index.ts:57](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L57)

___

### publicMemeProjection

• `Const` **publicMemeProjection**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `boolean` |
| `createdAt` | `boolean` |
| `description` | `boolean` |
| `expiredAt` | `boolean` |
| `imageUrl` | `boolean` |
| `likes` | `string` |
| `meme_id` | `Object` |
| `meme_id.$toString` | `string` |
| `owner` | `Object` |
| `owner.$toString` | `string` |
| `private` | `boolean` |
| `receiver` | `Object` |
| `receiver.$toString` | `string` |
| `replyTo` | `Object` |
| `replyTo.$toString` | `string` |

#### Defined in

[src/backend/index.ts:126](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L126)

___

### publicUserProjection

• `Const` **publicUserProjection**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_id` | `boolean` |
| `deleted` | `boolean` |
| `email` | `boolean` |
| `friends` | `Object` |
| `friends.$size` | `string` |
| `imageUrl` | `boolean` |
| `liked` | `Object` |
| `liked.$size` | `string` |
| `name` | `boolean` |
| `phone` | `boolean` |
| `user_id` | `Object` |
| `user_id.$toString` | `string` |
| `username` | `boolean` |

#### Defined in

[src/backend/index.ts:140](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L140)

## Functions

### addFriendRequest

▸ **addFriendRequest**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ request_type })` | [`FriendRequestType`](types_global.md#friendrequesttype) |
| ▶ `({ target_id })` | [`UserId`](../interfaces/types_global.UserId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:943](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L943)

___

### addLikedMeme

▸ **addLikedMeme**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ meme_id })` | [`MemeId`](../interfaces/types_global.MemeId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:496](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L496)

___

### addToRequestLog

▸ **addToRequestLog**(`(destructured)`): `Promise`<`void`\>

Note that this async function does not have to be awaited. It's fire and
forget!

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | [`NextApiState`](types_global.md#nextapistate) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:1233](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L1233)

___

### addUserAsFriend

▸ **addUserAsFriend**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ friend_id })` | [`UserId`](../interfaces/types_global.UserId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:811](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L811)

___

### createMeme

▸ **createMeme**(`(destructured)`): `Promise`<[`PublicMeme`](types_global.md#publicmeme)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ creatorKey })` | `string` |
| ▶ `({ data })` | `Partial`<[`NewMeme`](types_global.md#newmeme)\> |

#### Returns

`Promise`<[`PublicMeme`](types_global.md#publicmeme)\>

#### Defined in

[src/backend/index.ts:173](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L173)

___

### createUser

▸ **createUser**(`(destructured)`): `Promise`<[`PublicUser`](types_global.md#publicuser)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ creatorKey })` | `string` |
| ▶ `({ data })` | `Partial`<[`NewUser`](types_global.md#newuser)\> |

#### Returns

`Promise`<[`PublicUser`](types_global.md#publicuser)\>

#### Defined in

[src/backend/index.ts:528](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L528)

___

### deleteUser

▸ **deleteUser**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:648](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L648)

___

### getAllUsers

▸ **getAllUsers**(`(destructured)`): `Promise`<[`PublicUser`](types_global.md#publicuser)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ after })` | [`UserId`](../interfaces/types_global.UserId.md) \| ``null`` |

#### Returns

`Promise`<[`PublicUser`](types_global.md#publicuser)[]\>

#### Defined in

[src/backend/index.ts:667](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L667)

___

### getApiKeys

▸ **getApiKeys**(): `Promise`<{ `key`: `string` ; `owner`: `string`  }[]\>

#### Returns

`Promise`<{ `key`: `string` ; `owner`: `string`  }[]\>

#### Defined in

[src/backend/index.ts:1244](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L1244)

___

### getFriendRequestsOfType

▸ **getFriendRequestsOfType**(`(destructured)`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ after })` | [`FriendRequestId`](../interfaces/types_global.FriendRequestId.md) \| ``null`` |
| ▶ `({ request_type })` | [`FriendRequestType`](types_global.md#friendrequesttype) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/backend/index.ts:838](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L838)

___

### getMemeLikesUserIds

▸ **getMemeLikesUserIds**(`(destructured)`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ after })` | [`UserId`](../interfaces/types_global.UserId.md) \| ``null`` |
| ▶ `({ meme_id })` | [`MemeId`](../interfaces/types_global.MemeId.md) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/backend/index.ts:350](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L350)

___

### getMemes

▸ **getMemes**(`(destructured)`): `Promise`<[`PublicMeme`](types_global.md#publicmeme)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ meme_ids })` | [`MemeId`](../interfaces/types_global.MemeId.md)[] |

#### Returns

`Promise`<[`PublicMeme`](types_global.md#publicmeme)[]\>

#### Defined in

[src/backend/index.ts:319](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L319)

___

### getSystemInfo

▸ **getSystemInfo**(): `Promise`<[`InternalInfo`](types_global.md#internalinfo)\>

#### Returns

`Promise`<[`InternalInfo`](types_global.md#internalinfo)\>

#### Defined in

[src/backend/index.ts:163](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L163)

___

### getUser

▸ **getUser**(`(destructured)`): `Promise`<[`PublicUser`](types_global.md#publicuser)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ user_id? })` | [`UserId`](../interfaces/types_global.UserId.md) |
| ▶ `({ username? })` | `string` |

#### Returns

`Promise`<[`PublicUser`](types_global.md#publicuser)\>

#### Defined in

[src/backend/index.ts:691](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L691)

___

### getUserFriendsUserIds

▸ **getUserFriendsUserIds**(`(destructured)`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ after })` | [`UserId`](../interfaces/types_global.UserId.md) \| ``null`` |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/backend/index.ts:717](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L717)

___

### getUserLikedMemeIds

▸ **getUserLikedMemeIds**(`(destructured)`): `Promise`<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ after })` | [`MemeId`](../interfaces/types_global.MemeId.md) \| ``null`` |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/backend/index.ts:393](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L393)

___

### handleImageUpload

▸ **handleImageUpload**(`imageBase64`): `Promise`<``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `imageBase64` | `string` \| ``null`` \| `undefined` |

#### Returns

`Promise`<``null``\>

#### Defined in

[src/backend/index.ts:153](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L153)

___

### isDueForContrivedError

▸ **isDueForContrivedError**(): `boolean`

Note that this is a per-serverless-function request counter and not global
across all Vercel virtual machines.

#### Returns

`boolean`

#### Defined in

[src/backend/index.ts:1218](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L1218)

___

### isFriendRequestOfType

▸ **isFriendRequestOfType**(`(destructured)`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ request_type })` | [`FriendRequestType`](types_global.md#friendrequesttype) |
| ▶ `({ target_id })` | [`UserId`](../interfaces/types_global.UserId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/backend/index.ts:884](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L884)

___

### isKeyAuthentic

▸ **isKeyAuthentic**(`key`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/backend/index.ts:1183](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L1183)

___

### isMemeLiked

▸ **isMemeLiked**(`(destructured)`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ meme_id })` | [`MemeId`](../interfaces/types_global.MemeId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/backend/index.ts:436](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L436)

___

### isRateLimited

▸ **isRateLimited**(`req`): `Promise`<`Object`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | `NextApiRequest` |

#### Returns

`Promise`<`Object`\>

#### Defined in

[src/backend/index.ts:1192](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L1192)

___

### isUserAFriend

▸ **isUserAFriend**(`(destructured)`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ friend_id })` | [`UserId`](../interfaces/types_global.UserId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/backend/index.ts:759](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L759)

___

### removeFriendRequest

▸ **removeFriendRequest**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ request_type })` | [`FriendRequestType`](types_global.md#friendrequesttype) |
| ▶ `({ target_id })` | [`UserId`](../interfaces/types_global.UserId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:916](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L916)

___

### removeLikedMeme

▸ **removeLikedMeme**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ meme_id })` | [`MemeId`](../interfaces/types_global.MemeId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:467](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L467)

___

### removeUserAsFriend

▸ **removeUserAsFriend**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ friend_id })` | [`UserId`](../interfaces/types_global.UserId.md) |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:789](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L789)

___

### searchMemes

▸ **searchMemes**(`(destructured)`): `Promise`<[`PublicMeme`](types_global.md#publicmeme)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ after })` | [`MemeId`](../interfaces/types_global.MemeId.md) \| ``null`` |
| ▶ `({ match })` | `Object` |
| ▶ `({ regexMatch })` | `Object` |

#### Returns

`Promise`<[`PublicMeme`](types_global.md#publicmeme)[]\>

#### Defined in

[src/backend/index.ts:974](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L974)

___

### updateMemes

▸ **updateMemes**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ data })` | `Partial`<[`PatchMeme`](types_global.md#patchmeme)\> |
| ▶ `({ meme_ids })` | [`MemeId`](../interfaces/types_global.MemeId.md)[] |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:294](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L294)

___

### updateUser

▸ **updateUser**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ data })` | `Partial`<[`PatchUser`](types_global.md#patchuser)\> |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:591](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/40f330c/src/backend/index.ts#L591)
