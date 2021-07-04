[ghostmeme.api.hscc.bdpa.org][1] / src/backend

# Module: src/backend

## Table of contents

### Variables

- [BANNED_KEY][2]
- [DUMMY_KEY][3]
- [NULL_KEY][4]
- [publicMemeProjection][5]
- [publicUserProjection][6]

### Functions

- [addFriendRequest][7]
- [addLikedMeme][8]
- [addToRequestLog][9]
- [addUserAsFriend][10]
- [createMeme][11]
- [createUser][12]
- [deleteUser][13]
- [getAllUsers][14]
- [getApiKeys][15]
- [getFriendRequestsOfType][16]
- [getMemeLikesUserIds][17]
- [getMemes][18]
- [getSystemInfo][19]
- [getUser][20]
- [getUserFriendsUserIds][21]
- [getUserLikedMemeIds][22]
- [isDueForContrivedError][23]
- [isFriendRequestOfType][24]
- [isKeyAuthentic][25]
- [isMemeLiked][26]
- [isRateLimited][27]
- [isUserAFriend][28]
- [removeFriendRequest][29]
- [removeLikedMeme][30]
- [removeUserAsFriend][31]
- [searchMemes][32]
- [updateMemes][33]
- [updateUser][34]

## Variables

### BANNED_KEY

• `Const` **BANNED_KEY**: `"banned-h54e-6rt7-gctfh-hrftdygct0"`

This key is guaranteed to be rate limited.

#### Defined in

[src/backend/index.ts:67][35]

---

### DUMMY_KEY

• `Const` **DUMMY_KEY**: `"12349b61-83a7-4036-b060-213784b491"`

This key is only valid when running in a Jest test environment.

#### Defined in

[src/backend/index.ts:62][36]

---

### NULL_KEY

• `Const` **NULL_KEY**: `"00000000-0000-0000-0000-000000000000"`

This key is guaranteed never to appear in the system and can be checked against.

#### Defined in

[src/backend/index.ts:57][37]

---

### publicMemeProjection

• `Const` **publicMemeProjection**: `Object`

#### Type declaration

| Name                 | Type      |
| :------------------- | :-------- |
| `_id`                | `boolean` |
| `createdAt`          | `boolean` |
| `description`        | `boolean` |
| `expiredAt`          | `boolean` |
| `imageUrl`           | `boolean` |
| `likes`              | `string`  |
| `meme_id`            | `Object`  |
| `meme_id.$toString`  | `string`  |
| `owner`              | `Object`  |
| `owner.$toString`    | `string`  |
| `private`            | `boolean` |
| `receiver`           | `Object`  |
| `receiver.$toString` | `string`  |
| `replyTo`            | `Object`  |
| `replyTo.$toString`  | `string`  |

#### Defined in

[src/backend/index.ts:89][38]

---

### publicUserProjection

• `Const` **publicUserProjection**: `Object`

#### Type declaration

| Name                | Type      |
| :------------------ | :-------- |
| `_id`               | `boolean` |
| `deleted`           | `boolean` |
| `email`             | `boolean` |
| `friends`           | `Object`  |
| `friends.$size`     | `string`  |
| `imageUrl`          | `boolean` |
| `liked`             | `Object`  |
| `liked.$size`       | `string`  |
| `name`              | `boolean` |
| `phone`             | `boolean` |
| `user_id`           | `Object`  |
| `user_id.$toString` | `string`  |
| `username`          | `boolean` |

#### Defined in

[src/backend/index.ts:103][39]

## Functions

### addFriendRequest

▸ **addFriendRequest**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                   | Type                      |
| :--------------------- | :------------------------ |
| `(destructured)`       | `Object`                  |
| ▶ `({ request_type })` | [`FriendRequestType`][40] |
| ▶ `({ target_id })`    | [`UserId`][41]            |
| ▶ `({ user_id })`      | [`UserId`][41]            |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:930][42]

---

### addLikedMeme

▸ **addLikedMeme**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ meme_id })` | [`MemeId`][43] |
| ▶ `({ user_id })` | [`UserId`][41] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:442][44]

---

### addToRequestLog

▸ **addToRequestLog**(`(destructured)`): `Promise`<`void`>

Note that this async function does not have to be awaited. It's fire and forget!

#### Parameters

| Name             | Type                 |
| :--------------- | :------------------- |
| `(destructured)` | [`NextApiState`][45] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:1217][46]

---

### addUserAsFriend

▸ **addUserAsFriend**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ friend_id })` | [`UserId`][41] |
| ▶ `({ user_id })`   | [`UserId`][41] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:801][47]

---

### createMeme

▸ **createMeme**(`(destructured)`): `Promise`<[`PublicMeme`][48]>

#### Parameters

| Name                 | Type                       |
| :------------------- | :------------------------- |
| `(destructured)`     | `Object`                   |
| ▶ `({ creatorKey })` | `string`                   |
| ▶ `({ data })`       | `Partial`<[`NewMeme`][49]> |

#### Returns

`Promise`<[`PublicMeme`][48]>

#### Defined in

[src/backend/index.ts:126][50]

---

### createUser

▸ **createUser**(`(destructured)`): `Promise`<[`PublicUser`][51]>

#### Parameters

| Name                 | Type                       |
| :------------------- | :------------------------- |
| `(destructured)`     | `Object`                   |
| ▶ `({ creatorKey })` | `string`                   |
| ▶ `({ data })`       | `Partial`<[`NewUser`][52]> |

#### Returns

`Promise`<[`PublicUser`][51]>

#### Defined in

[src/backend/index.ts:474][53]

---

### deleteUser

▸ **deleteUser**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ user_id })` | [`UserId`][41] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:641][54]

---

### getAllUsers

▸ **getAllUsers**(`(destructured)`): `Promise`<[`PublicUser`][51]\[]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| ▶ `({ after })`  | [`UserId`][41] \| `null` |

#### Returns

`Promise`<[`PublicUser`][51]\[]>

#### Defined in

[src/backend/index.ts:660][55]

---

### getApiKeys

▸ **getApiKeys**(): `Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Returns

`Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Defined in

[src/backend/index.ts:1228][56]

---

### getFriendRequestsOfType

▸ **getFriendRequestsOfType**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name                   | Type                              |
| :--------------------- | :-------------------------------- |
| `(destructured)`       | `Object`                          |
| ▶ `({ after })`        | [`FriendRequestId`][57] \| `null` |
| ▶ `({ request_type })` | [`FriendRequestType`][40]         |
| ▶ `({ user_id })`      | [`UserId`][41]                    |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:828][58]

---

### getMemeLikesUserIds

▸ **getMemeLikesUserIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name              | Type                     |
| :---------------- | :----------------------- |
| `(destructured)`  | `Object`                 |
| ▶ `({ after })`   | [`UserId`][41] \| `null` |
| ▶ `({ meme_id })` | [`MemeId`][43]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:302][59]

---

### getMemes

▸ **getMemes**(`(destructured)`): `Promise`<[`PublicMeme`][48]\[]>

#### Parameters

| Name               | Type             |
| :----------------- | :--------------- |
| `(destructured)`   | `Object`         |
| ▶ `({ meme_ids })` | [`MemeId`][43][] |

#### Returns

`Promise`<[`PublicMeme`][48]\[]>

#### Defined in

[src/backend/index.ts:272][60]

---

### getSystemInfo

▸ **getSystemInfo**(): `Promise`<[`InternalInfo`][61]>

#### Returns

`Promise`<[`InternalInfo`][61]>

#### Defined in

[src/backend/index.ts:116][62]

---

### getUser

▸ **getUser**(`(destructured)`): `Promise`<[`PublicUser`][51]>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ user_id? })`  | [`UserId`][41] |
| ▶ `({ username? })` | `string`       |

#### Returns

`Promise`<[`PublicUser`][51]>

#### Defined in

[src/backend/index.ts:684][63]

---

### getUserFriendsUserIds

▸ **getUserFriendsUserIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name              | Type                     |
| :---------------- | :----------------------- |
| `(destructured)`  | `Object`                 |
| ▶ `({ after })`   | [`UserId`][41] \| `null` |
| ▶ `({ user_id })` | [`UserId`][41]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:710][64]

---

### getUserLikedMemeIds

▸ **getUserLikedMemeIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name              | Type                     |
| :---------------- | :----------------------- |
| `(destructured)`  | `Object`                 |
| ▶ `({ after })`   | [`MemeId`][43] \| `null` |
| ▶ `({ user_id })` | [`UserId`][41]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:342][65]

---

### isDueForContrivedError

▸ **isDueForContrivedError**(): `boolean`

Note that this is a per-serverless-function request counter and not global
across all Vercel virtual machines.

#### Returns

`boolean`

#### Defined in

[src/backend/index.ts:1202][66]

---

### isFriendRequestOfType

▸ **isFriendRequestOfType**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name                   | Type                      |
| :--------------------- | :------------------------ |
| `(destructured)`       | `Object`                  |
| ▶ `({ request_type })` | [`FriendRequestType`][40] |
| ▶ `({ target_id })`    | [`UserId`][41]            |
| ▶ `({ user_id })`      | [`UserId`][41]            |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:871][67]

---

### isKeyAuthentic

▸ **isKeyAuthentic**(`key`): `Promise`<`boolean`>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `key` | `string` |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:1167][68]

---

### isMemeLiked

▸ **isMemeLiked**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ meme_id })` | [`MemeId`][43] |
| ▶ `({ user_id })` | [`UserId`][41] |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:382][69]

---

### isRateLimited

▸ **isRateLimited**(`req`): `Promise`<`Object`>

#### Parameters

| Name  | Type             |
| :---- | :--------------- |
| `req` | `NextApiRequest` |

#### Returns

`Promise`<`Object`>

#### Defined in

[src/backend/index.ts:1176][70]

---

### isUserAFriend

▸ **isUserAFriend**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ friend_id })` | [`UserId`][41] |
| ▶ `({ user_id })`   | [`UserId`][41] |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:749][71]

---

### removeFriendRequest

▸ **removeFriendRequest**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                   | Type                      |
| :--------------------- | :------------------------ |
| `(destructured)`       | `Object`                  |
| ▶ `({ request_type })` | [`FriendRequestType`][40] |
| ▶ `({ target_id })`    | [`UserId`][41]            |
| ▶ `({ user_id })`      | [`UserId`][41]            |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:903][72]

---

### removeLikedMeme

▸ **removeLikedMeme**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ meme_id })` | [`MemeId`][43] |
| ▶ `({ user_id })` | [`UserId`][41] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:413][73]

---

### removeUserAsFriend

▸ **removeUserAsFriend**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ friend_id })` | [`UserId`][41] |
| ▶ `({ user_id })`   | [`UserId`][41] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:779][74]

---

### searchMemes

▸ **searchMemes**(`(destructured)`): `Promise`<[`PublicMeme`][48]\[]>

#### Parameters

| Name                 | Type                     |
| :------------------- | :----------------------- |
| `(destructured)`     | `Object`                 |
| ▶ `({ after })`      | [`MemeId`][43] \| `null` |
| ▶ `({ match })`      | `Object`                 |
| ▶ `({ regexMatch })` | `Object`                 |

#### Returns

`Promise`<[`PublicMeme`][48]\[]>

#### Defined in

[src/backend/index.ts:961][75]

---

### updateMemes

▸ **updateMemes**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name               | Type                         |
| :----------------- | :--------------------------- |
| `(destructured)`   | `Object`                     |
| ▶ `({ data })`     | `Partial`<[`PatchMeme`][76]> |
| ▶ `({ meme_ids })` | [`MemeId`][43][]             |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:247][77]

---

### updateUser

▸ **updateUser**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type                         |
| :---------------- | :--------------------------- |
| `(destructured)`  | `Object`                     |
| ▶ `({ data })`    | `Partial`<[`PatchUser`][78]> |
| ▶ `({ user_id })` | [`UserId`][41]               |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:568][79]

[1]: ../README.md
[2]: src_backend.md#banned_key
[3]: src_backend.md#dummy_key
[4]: src_backend.md#null_key
[5]: src_backend.md#publicmemeprojection
[6]: src_backend.md#publicuserprojection
[7]: src_backend.md#addfriendrequest
[8]: src_backend.md#addlikedmeme
[9]: src_backend.md#addtorequestlog
[10]: src_backend.md#adduserasfriend
[11]: src_backend.md#creatememe
[12]: src_backend.md#createuser
[13]: src_backend.md#deleteuser
[14]: src_backend.md#getallusers
[15]: src_backend.md#getapikeys
[16]: src_backend.md#getfriendrequestsoftype
[17]: src_backend.md#getmemelikesuserids
[18]: src_backend.md#getmemes
[19]: src_backend.md#getsysteminfo
[20]: src_backend.md#getuser
[21]: src_backend.md#getuserfriendsuserids
[22]: src_backend.md#getuserlikedmemeids
[23]: src_backend.md#isdueforcontrivederror
[24]: src_backend.md#isfriendrequestoftype
[25]: src_backend.md#iskeyauthentic
[26]: src_backend.md#ismemeliked
[27]: src_backend.md#isratelimited
[28]: src_backend.md#isuserafriend
[29]: src_backend.md#removefriendrequest
[30]: src_backend.md#removelikedmeme
[31]: src_backend.md#removeuserasfriend
[32]: src_backend.md#searchmemes
[33]: src_backend.md#updatememes
[34]: src_backend.md#updateuser
[35]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L67
[36]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L62
[37]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L57
[38]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L89
[39]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L103
[40]: types_global.md#friendrequesttype
[41]: ../interfaces/types_global.userid.md
[42]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L930
[43]: ../interfaces/types_global.memeid.md
[44]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L442
[45]: types_global.md#nextapistate
[46]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L1217
[47]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L801
[48]: types_global.md#publicmeme
[49]: types_global.md#newmeme
[50]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L126
[51]: types_global.md#publicuser
[52]: types_global.md#newuser
[53]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L474
[54]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L641
[55]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L660
[56]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L1228
[57]: ../interfaces/types_global.friendrequestid.md
[58]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L828
[59]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L302
[60]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L272
[61]: types_global.md#internalinfo
[62]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L116
[63]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L684
[64]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L710
[65]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L342
[66]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L1202
[67]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L871
[68]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L1167
[69]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L382
[70]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L1176
[71]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L749
[72]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L903
[73]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L413
[74]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L779
[75]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L961
[76]: types_global.md#patchmeme
[77]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L247
[78]: types_global.md#patchuser
[79]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/1aca321/src/backend/index.ts#L568
