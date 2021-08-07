[ghostmeme.api.hscc.bdpa.org](../README.md) / src/backend

# Module: src/backend

## Table of contents

### Variables

- [BANNED\_KEY](src_backend.md#banned_key)
- [DEV\_KEY](src_backend.md#dev_key)
- [DUMMY\_KEY](src_backend.md#dummy_key)
- [IMGUR\_API\_URI](src_backend.md#imgur_api_uri)
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

[src/backend/index.ts:80](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L80)

___

### DEV\_KEY

• `Const` **DEV\_KEY**: ``"dev-xunn-dev-294a-536h-9751-rydmj"``

This key can be used to authenticate with local and non-production
deployments.

#### Defined in

[src/backend/index.ts:86](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L86)

___

### DUMMY\_KEY

• `Const` **DUMMY\_KEY**: ``"12349b61-83a7-4036-b060-213784b491"``

This key is valid only when running in a test environment.

#### Defined in

[src/backend/index.ts:75](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L75)

___

### IMGUR\_API\_URI

• `Const` **IMGUR\_API\_URI**: ``"https://api.imgur.com/3/image"``

The imgur API URL used throughout the API backend

#### Defined in

[src/backend/index.ts:63](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L63)

___

### NULL\_KEY

• `Const` **NULL\_KEY**: ``"00000000-0000-0000-0000-000000000000"``

This key is guaranteed never to appear in dummy data generated during tests.
In production, this key is used in place of `null` where a string key is
required (e.g. the `meta.creator` field for auto-generated users).

#### Defined in

[src/backend/index.ts:70](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L70)

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

[src/backend/index.ts:139](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L139)

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

[src/backend/index.ts:153](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L153)

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

[src/backend/index.ts:1034](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1034)

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

[src/backend/index.ts:583](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L583)

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

[src/backend/index.ts:1324](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1324)

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

[src/backend/index.ts:902](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L902)

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

[src/backend/index.ts:261](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L261)

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

[src/backend/index.ts:615](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L615)

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

[src/backend/index.ts:739](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L739)

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

[src/backend/index.ts:758](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L758)

___

### getApiKeys

▸ **getApiKeys**(): `Promise`<{ `key`: `string` ; `owner`: `string`  }[]\>

#### Returns

`Promise`<{ `key`: `string` ; `owner`: `string`  }[]\>

#### Defined in

[src/backend/index.ts:1335](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1335)

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

[src/backend/index.ts:929](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L929)

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

[src/backend/index.ts:437](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L437)

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

[src/backend/index.ts:406](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L406)

___

### getSystemInfo

▸ **getSystemInfo**(): `Promise`<[`InternalInfo`](types_global.md#internalinfo)\>

#### Returns

`Promise`<[`InternalInfo`](types_global.md#internalinfo)\>

#### Defined in

[src/backend/index.ts:251](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L251)

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

[src/backend/index.ts:782](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L782)

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

[src/backend/index.ts:808](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L808)

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

[src/backend/index.ts:480](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L480)

___

### handleImageUpload

▸ **handleImageUpload**(`creatorKey`, `imageBase64`): `Promise`<``null`` \| `string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `creatorKey` | `string` |
| `imageBase64` | `string` \| ``null`` \| `undefined` |

#### Returns

`Promise`<``null`` \| `string`\>

#### Defined in

[src/backend/index.ts:166](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L166)

___

### isDueForContrivedError

▸ **isDueForContrivedError**(): `boolean`

Note that this is a per-serverless-function request counter and not global
across all Vercel virtual machines.

#### Returns

`boolean`

#### Defined in

[src/backend/index.ts:1309](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1309)

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

[src/backend/index.ts:975](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L975)

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

[src/backend/index.ts:1274](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1274)

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

[src/backend/index.ts:523](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L523)

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

[src/backend/index.ts:1283](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1283)

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

[src/backend/index.ts:850](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L850)

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

[src/backend/index.ts:1007](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1007)

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

[src/backend/index.ts:554](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L554)

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

[src/backend/index.ts:880](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L880)

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

[src/backend/index.ts:1065](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L1065)

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

[src/backend/index.ts:381](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L381)

___

### updateUser

▸ **updateUser**(`(destructured)`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `(destructured)` | `Object` |
| ▶ `({ creatorKey })` | `string` |
| ▶ `({ data })` | `Partial`<[`PatchUser`](types_global.md#patchuser)\> |
| ▶ `({ user_id })` | [`UserId`](../interfaces/types_global.UserId.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/backend/index.ts:678](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/86898e9/src/backend/index.ts#L678)
