[ghostmeme.api.hscc.bdpa.org][1] / src/backend

# Module: src/backend

## Table of contents

### Variables

- [BANNED_KEY][2]
- [DEV_KEY][3]
- [DUMMY_KEY][4]
- [NULL_KEY][5]
- [publicMemeProjection][6]
- [publicUserProjection][7]

### Functions

- [addFriendRequest][8]
- [addLikedMeme][9]
- [addToRequestLog][10]
- [addUserAsFriend][11]
- [createMeme][12]
- [createUser][13]
- [deleteUser][14]
- [getAllUsers][15]
- [getApiKeys][16]
- [getFriendRequestsOfType][17]
- [getMemeLikesUserIds][18]
- [getMemes][19]
- [getSystemInfo][20]
- [getUser][21]
- [getUserFriendsUserIds][22]
- [getUserLikedMemeIds][23]
- [isDueForContrivedError][24]
- [isFriendRequestOfType][25]
- [isKeyAuthentic][26]
- [isMemeLiked][27]
- [isRateLimited][28]
- [isUserAFriend][29]
- [removeFriendRequest][30]
- [removeLikedMeme][31]
- [removeUserAsFriend][32]
- [searchMemes][33]
- [updateMemes][34]
- [updateUser][35]

## Variables

### BANNED_KEY

• `Const` **BANNED_KEY**: `"banned-h54e-6rt7-gctfh-hrftdygct0"`

This key is guaranteed to be rate limited.

#### Defined in

[src/backend/index.ts:67][36]

---

### DEV_KEY

• `Const` **DEV_KEY**: `"dev-xunn-dev-294a-536h-9751-rydmj"`

This key is guaranteed to be rate limited.

#### Defined in

[src/backend/index.ts:72][37]

---

### DUMMY_KEY

• `Const` **DUMMY_KEY**: `"12349b61-83a7-4036-b060-213784b491"`

This key is only valid when running in a Jest test environment.

#### Defined in

[src/backend/index.ts:62][38]

---

### NULL_KEY

• `Const` **NULL_KEY**: `"00000000-0000-0000-0000-000000000000"`

This key is guaranteed never to appear in the system and can be checked against.

#### Defined in

[src/backend/index.ts:57][39]

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

[src/backend/index.ts:94][40]

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

[src/backend/index.ts:108][41]

## Functions

### addFriendRequest

▸ **addFriendRequest**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                   | Type                      |
| :--------------------- | :------------------------ |
| `(destructured)`       | `Object`                  |
| ▶ `({ request_type })` | [`FriendRequestType`][42] |
| ▶ `({ target_id })`    | [`UserId`][43]            |
| ▶ `({ user_id })`      | [`UserId`][43]            |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:935][44]

---

### addLikedMeme

▸ **addLikedMeme**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ meme_id })` | [`MemeId`][45] |
| ▶ `({ user_id })` | [`UserId`][43] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:447][46]

---

### addToRequestLog

▸ **addToRequestLog**(`(destructured)`): `Promise`<`void`>

Note that this async function does not have to be awaited. It's fire and forget!

#### Parameters

| Name             | Type                 |
| :--------------- | :------------------- |
| `(destructured)` | [`NextApiState`][47] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:1222][48]

---

### addUserAsFriend

▸ **addUserAsFriend**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ friend_id })` | [`UserId`][43] |
| ▶ `({ user_id })`   | [`UserId`][43] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:806][49]

---

### createMeme

▸ **createMeme**(`(destructured)`): `Promise`<[`PublicMeme`][50]>

#### Parameters

| Name                 | Type                       |
| :------------------- | :------------------------- |
| `(destructured)`     | `Object`                   |
| ▶ `({ creatorKey })` | `string`                   |
| ▶ `({ data })`       | `Partial`<[`NewMeme`][51]> |

#### Returns

`Promise`<[`PublicMeme`][50]>

#### Defined in

[src/backend/index.ts:131][52]

---

### createUser

▸ **createUser**(`(destructured)`): `Promise`<[`PublicUser`][53]>

#### Parameters

| Name                 | Type                       |
| :------------------- | :------------------------- |
| `(destructured)`     | `Object`                   |
| ▶ `({ creatorKey })` | `string`                   |
| ▶ `({ data })`       | `Partial`<[`NewUser`][54]> |

#### Returns

`Promise`<[`PublicUser`][53]>

#### Defined in

[src/backend/index.ts:479][55]

---

### deleteUser

▸ **deleteUser**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ user_id })` | [`UserId`][43] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:646][56]

---

### getAllUsers

▸ **getAllUsers**(`(destructured)`): `Promise`<[`PublicUser`][53]\[]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| ▶ `({ after })`  | [`UserId`][43] \| `null` |

#### Returns

`Promise`<[`PublicUser`][53]\[]>

#### Defined in

[src/backend/index.ts:665][57]

---

### getApiKeys

▸ **getApiKeys**(): `Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Returns

`Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Defined in

[src/backend/index.ts:1233][58]

---

### getFriendRequestsOfType

▸ **getFriendRequestsOfType**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name                   | Type                              |
| :--------------------- | :-------------------------------- |
| `(destructured)`       | `Object`                          |
| ▶ `({ after })`        | [`FriendRequestId`][59] \| `null` |
| ▶ `({ request_type })` | [`FriendRequestType`][42]         |
| ▶ `({ user_id })`      | [`UserId`][43]                    |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:833][60]

---

### getMemeLikesUserIds

▸ **getMemeLikesUserIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name              | Type                     |
| :---------------- | :----------------------- |
| `(destructured)`  | `Object`                 |
| ▶ `({ after })`   | [`UserId`][43] \| `null` |
| ▶ `({ meme_id })` | [`MemeId`][45]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:307][61]

---

### getMemes

▸ **getMemes**(`(destructured)`): `Promise`<[`PublicMeme`][50]\[]>

#### Parameters

| Name               | Type             |
| :----------------- | :--------------- |
| `(destructured)`   | `Object`         |
| ▶ `({ meme_ids })` | [`MemeId`][45][] |

#### Returns

`Promise`<[`PublicMeme`][50]\[]>

#### Defined in

[src/backend/index.ts:277][62]

---

### getSystemInfo

▸ **getSystemInfo**(): `Promise`<[`InternalInfo`][63]>

#### Returns

`Promise`<[`InternalInfo`][63]>

#### Defined in

[src/backend/index.ts:121][64]

---

### getUser

▸ **getUser**(`(destructured)`): `Promise`<[`PublicUser`][53]>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ user_id? })`  | [`UserId`][43] |
| ▶ `({ username? })` | `string`       |

#### Returns

`Promise`<[`PublicUser`][53]>

#### Defined in

[src/backend/index.ts:689][65]

---

### getUserFriendsUserIds

▸ **getUserFriendsUserIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name              | Type                     |
| :---------------- | :----------------------- |
| `(destructured)`  | `Object`                 |
| ▶ `({ after })`   | [`UserId`][43] \| `null` |
| ▶ `({ user_id })` | [`UserId`][43]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:715][66]

---

### getUserLikedMemeIds

▸ **getUserLikedMemeIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name              | Type                     |
| :---------------- | :----------------------- |
| `(destructured)`  | `Object`                 |
| ▶ `({ after })`   | [`MemeId`][45] \| `null` |
| ▶ `({ user_id })` | [`UserId`][43]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:347][67]

---

### isDueForContrivedError

▸ **isDueForContrivedError**(): `boolean`

Note that this is a per-serverless-function request counter and not global
across all Vercel virtual machines.

#### Returns

`boolean`

#### Defined in

[src/backend/index.ts:1207][68]

---

### isFriendRequestOfType

▸ **isFriendRequestOfType**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name                   | Type                      |
| :--------------------- | :------------------------ |
| `(destructured)`       | `Object`                  |
| ▶ `({ request_type })` | [`FriendRequestType`][42] |
| ▶ `({ target_id })`    | [`UserId`][43]            |
| ▶ `({ user_id })`      | [`UserId`][43]            |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:876][69]

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

[src/backend/index.ts:1172][70]

---

### isMemeLiked

▸ **isMemeLiked**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ meme_id })` | [`MemeId`][45] |
| ▶ `({ user_id })` | [`UserId`][43] |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:387][71]

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

[src/backend/index.ts:1181][72]

---

### isUserAFriend

▸ **isUserAFriend**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ friend_id })` | [`UserId`][43] |
| ▶ `({ user_id })`   | [`UserId`][43] |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:754][73]

---

### removeFriendRequest

▸ **removeFriendRequest**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                   | Type                      |
| :--------------------- | :------------------------ |
| `(destructured)`       | `Object`                  |
| ▶ `({ request_type })` | [`FriendRequestType`][42] |
| ▶ `({ target_id })`    | [`UserId`][43]            |
| ▶ `({ user_id })`      | [`UserId`][43]            |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:908][74]

---

### removeLikedMeme

▸ **removeLikedMeme**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| ▶ `({ meme_id })` | [`MemeId`][45] |
| ▶ `({ user_id })` | [`UserId`][43] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:418][75]

---

### removeUserAsFriend

▸ **removeUserAsFriend**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                | Type           |
| :------------------ | :------------- |
| `(destructured)`    | `Object`       |
| ▶ `({ friend_id })` | [`UserId`][43] |
| ▶ `({ user_id })`   | [`UserId`][43] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:784][76]

---

### searchMemes

▸ **searchMemes**(`(destructured)`): `Promise`<[`PublicMeme`][50]\[]>

#### Parameters

| Name                 | Type                     |
| :------------------- | :----------------------- |
| `(destructured)`     | `Object`                 |
| ▶ `({ after })`      | [`MemeId`][45] \| `null` |
| ▶ `({ match })`      | `Object`                 |
| ▶ `({ regexMatch })` | `Object`                 |

#### Returns

`Promise`<[`PublicMeme`][50]\[]>

#### Defined in

[src/backend/index.ts:966][77]

---

### updateMemes

▸ **updateMemes**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name               | Type                         |
| :----------------- | :--------------------------- |
| `(destructured)`   | `Object`                     |
| ▶ `({ data })`     | `Partial`<[`PatchMeme`][78]> |
| ▶ `({ meme_ids })` | [`MemeId`][45][]             |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:252][79]

---

### updateUser

▸ **updateUser**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type                         |
| :---------------- | :--------------------------- |
| `(destructured)`  | `Object`                     |
| ▶ `({ data })`    | `Partial`<[`PatchUser`][80]> |
| ▶ `({ user_id })` | [`UserId`][43]               |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:573][81]

[1]: ../README.md
[2]: src_backend.md#banned_key
[3]: src_backend.md#dev_key
[4]: src_backend.md#dummy_key
[5]: src_backend.md#null_key
[6]: src_backend.md#publicmemeprojection
[7]: src_backend.md#publicuserprojection
[8]: src_backend.md#addfriendrequest
[9]: src_backend.md#addlikedmeme
[10]: src_backend.md#addtorequestlog
[11]: src_backend.md#adduserasfriend
[12]: src_backend.md#creatememe
[13]: src_backend.md#createuser
[14]: src_backend.md#deleteuser
[15]: src_backend.md#getallusers
[16]: src_backend.md#getapikeys
[17]: src_backend.md#getfriendrequestsoftype
[18]: src_backend.md#getmemelikesuserids
[19]: src_backend.md#getmemes
[20]: src_backend.md#getsysteminfo
[21]: src_backend.md#getuser
[22]: src_backend.md#getuserfriendsuserids
[23]: src_backend.md#getuserlikedmemeids
[24]: src_backend.md#isdueforcontrivederror
[25]: src_backend.md#isfriendrequestoftype
[26]: src_backend.md#iskeyauthentic
[27]: src_backend.md#ismemeliked
[28]: src_backend.md#isratelimited
[29]: src_backend.md#isuserafriend
[30]: src_backend.md#removefriendrequest
[31]: src_backend.md#removelikedmeme
[32]: src_backend.md#removeuserasfriend
[33]: src_backend.md#searchmemes
[34]: src_backend.md#updatememes
[35]: src_backend.md#updateuser
[36]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L67
[37]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L72
[38]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L62
[39]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L57
[40]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L94
[41]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L108
[42]: types_global.md#friendrequesttype
[43]: ../interfaces/types_global.userid.md
[44]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L935
[45]: ../interfaces/types_global.memeid.md
[46]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L447
[47]: types_global.md#nextapistate
[48]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L1222
[49]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L806
[50]: types_global.md#publicmeme
[51]: types_global.md#newmeme
[52]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L131
[53]: types_global.md#publicuser
[54]: types_global.md#newuser
[55]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L479
[56]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L646
[57]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L665
[58]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L1233
[59]: ../interfaces/types_global.friendrequestid.md
[60]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L833
[61]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L307
[62]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L277
[63]: types_global.md#internalinfo
[64]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L121
[65]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L689
[66]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L715
[67]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L347
[68]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L1207
[69]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L876
[70]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L1172
[71]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L387
[72]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L1181
[73]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L754
[74]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L908
[75]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L418
[76]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L784
[77]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L966
[78]: types_global.md#patchmeme
[79]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L252
[80]: types_global.md#patchuser
[81]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/bc222b4/src/backend/index.ts#L573
