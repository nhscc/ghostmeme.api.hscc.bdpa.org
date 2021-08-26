[ghostmeme.api.hscc.bdpa.org][1] / src/backend

# Module: src/backend

## Table of contents

### Variables

- [BANNED_KEY][2]
- [DEV_KEY][3]
- [DUMMY_KEY][4]
- [IMGUR_API_URI][5]
- [MACHINE_KEY][6]
- [NULL_KEY][7]
- [publicMemeProjection][8]
- [publicUserProjection][9]

### Functions

- [addFriendRequest][10]
- [addLikedMeme][11]
- [addToRequestLog][12]
- [addUserAsFriend][13]
- [createMeme][14]
- [createUser][15]
- [deleteUser][16]
- [getAllUsers][17]
- [getApiKeys][18]
- [getFriendRequestsOfType][19]
- [getMemeLikesUserIds][20]
- [getMemes][21]
- [getSystemInfo][22]
- [getUser][23]
- [getUserFriendsUserIds][24]
- [getUserLikedMemeIds][25]
- [handleImageUpload][26]
- [isDueForContrivedError][27]
- [isFriendRequestOfType][28]
- [isKeyAuthentic][29]
- [isMemeLiked][30]
- [isRateLimited][31]
- [isUserAFriend][32]
- [removeFriendRequest][33]
- [removeLikedMeme][34]
- [removeUserAsFriend][35]
- [searchMemes][36]
- [updateMemes][37]
- [updateUser][38]

## Variables

### BANNED_KEY

• `Const` **BANNED_KEY**: `"banned-h54e-6rt7-gctfh-hrftdygct0"`

This key is guaranteed to be rate limited when running in a test environment
(i.e. `NODE_ENV=test`). This key cannot be used for authenticated HTTP access to
the API in production.

#### Defined in

[src/backend/index.ts:92][39]

---

### DEV_KEY

• `Const` **DEV_KEY**: `"dev-xunn-dev-294a-536h-9751-rydmj"`

This key can be used to authenticate with local and non-production deployments.
This key cannot be used for authenticated HTTP access to the API in production.

#### Defined in

[src/backend/index.ts:99][40]

---

### DUMMY_KEY

• `Const` **DUMMY_KEY**: `"12349b61-83a7-4036-b060-213784b491"`

This key allows authenticated API access only when running in a test environment
(i.e. `NODE_ENV=test`). This key cannot be used for authenticated HTTP access to
the API in production.

#### Defined in

[src/backend/index.ts:85][41]

---

### IMGUR_API_URI

• `Const` **IMGUR_API_URI**: `"https://api.imgur.com/3/image"`

The imgur API URL used throughout the API backend

#### Defined in

[src/backend/index.ts:64][42]

---

### MACHINE_KEY

• `Const` **MACHINE_KEY**: `"11111111-1111-1111-1111-111111111111"`

This key is used by database initialization and activity simulation scripts.
This key cannot be used for authenticated HTTP access to the API in production.

#### Defined in

[src/backend/index.ts:78][43]

---

### NULL_KEY

• `Const` **NULL_KEY**: `"00000000-0000-0000-0000-000000000000"`

This key is guaranteed never to appear in dummy data generated during tests. In
production, this key can be used to represent a `null` or non-existent key. This
key cannot be used for authenticated HTTP access to the API.

#### Defined in

[src/backend/index.ts:71][44]

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

[src/backend/index.ts:152][45]

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

[src/backend/index.ts:166][46]

## Functions

### addFriendRequest

▸ **addFriendRequest**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                 | Type                      |
| :------------------- | :------------------------ |
| `(destructured)`     | `Object`                  |
| `({ request_type })` | [`FriendRequestType`][47] |
| `({ target_id })`    | [`UserId`][48]            |
| `({ user_id })`      | [`UserId`][48]            |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:1042][49]

---

### addLikedMeme

▸ **addLikedMeme**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name             | Type           |
| :--------------- | :------------- |
| `(destructured)` | `Object`       |
| `({ meme_id })`  | [`MemeId`][50] |
| `({ user_id })`  | [`UserId`][48] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:597][51]

---

### addToRequestLog

▸ **addToRequestLog**(`(destructured)`): `Promise`<`void`>

Note that this async function does not have to be awaited. It's fire and forget!

#### Parameters

| Name             | Type                 |
| :--------------- | :------------------- |
| `(destructured)` | [`NextApiState`][52] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:1332][53]

---

### addUserAsFriend

▸ **addUserAsFriend**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| `({ friend_id })` | [`UserId`][48] |
| `({ user_id })`   | [`UserId`][48] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:913][54]

---

### createMeme

▸ **createMeme**(`(destructured)`): `Promise`<[`PublicMeme`][55]>

#### Parameters

| Name               | Type                       |
| :----------------- | :------------------------- |
| `(destructured)`   | `Object`                   |
| `({ creatorKey })` | `string`                   |
| `({ data })`       | `Partial`<[`NewMeme`][56]> |

#### Returns

`Promise`<[`PublicMeme`][55]>

#### Defined in

[src/backend/index.ts:282][57]

---

### createUser

▸ **createUser**(`(destructured)`): `Promise`<[`PublicUser`][58]>

#### Parameters

| Name               | Type                       |
| :----------------- | :------------------------- |
| `(destructured)`   | `Object`                   |
| `({ creatorKey })` | `string`                   |
| `({ data })`       | `Partial`<[`NewUser`][59]> |

#### Returns

`Promise`<[`PublicUser`][58]>

#### Defined in

[src/backend/index.ts:629][60]

---

### deleteUser

▸ **deleteUser**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name             | Type           |
| :--------------- | :------------- |
| `(destructured)` | `Object`       |
| `({ user_id })`  | [`UserId`][48] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:753][61]

---

### getAllUsers

▸ **getAllUsers**(`(destructured)`): `Promise`<[`PublicUser`][58]\[]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| `({ after })`    | [`UserId`][48] \| `null` |

#### Returns

`Promise`<[`PublicUser`][58]\[]>

#### Defined in

[src/backend/index.ts:772][62]

---

### getApiKeys

▸ **getApiKeys**(): `Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Returns

`Promise`<{ `key`: `string` ; `owner`: `string` }\[]>

#### Defined in

[src/backend/index.ts:1343][63]

---

### getFriendRequestsOfType

▸ **getFriendRequestsOfType**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name                 | Type                              |
| :------------------- | :-------------------------------- |
| `(destructured)`     | `Object`                          |
| `({ after })`        | [`FriendRequestId`][64] \| `null` |
| `({ request_type })` | [`FriendRequestType`][47]         |
| `({ user_id })`      | [`UserId`][48]                    |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:940][65]

---

### getMemeLikesUserIds

▸ **getMemeLikesUserIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| `({ after })`    | [`UserId`][48] \| `null` |
| `({ meme_id })`  | [`MemeId`][50]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:457][66]

---

### getMemes

▸ **getMemes**(`(destructured)`): `Promise`<[`PublicMeme`][55]\[]>

#### Parameters

| Name             | Type              |
| :--------------- | :---------------- |
| `(destructured)` | `Object`          |
| `({ meme_ids })` | [`MemeId`][50]\[] |

#### Returns

`Promise`<[`PublicMeme`][55]\[]>

#### Defined in

[src/backend/index.ts:427][67]

---

### getSystemInfo

▸ **getSystemInfo**(): `Promise`<[`InternalInfo`][68]>

#### Returns

`Promise`<[`InternalInfo`][68]>

#### Defined in

[src/backend/index.ts:272][69]

---

### getUser

▸ **getUser**(`(destructured)`): `Promise`<[`PublicUser`][58]>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| `({ user_id? })`  | [`UserId`][48] |
| `({ username? })` | `string`       |

#### Returns

`Promise`<[`PublicUser`][58]>

#### Defined in

[src/backend/index.ts:796][70]

---

### getUserFriendsUserIds

▸ **getUserFriendsUserIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| `({ after })`    | [`UserId`][48] \| `null` |
| `({ user_id })`  | [`UserId`][48]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:822][71]

---

### getUserLikedMemeIds

▸ **getUserLikedMemeIds**(`(destructured)`): `Promise`<`string`\[]>

#### Parameters

| Name             | Type                     |
| :--------------- | :----------------------- |
| `(destructured)` | `Object`                 |
| `({ after })`    | [`MemeId`][50] \| `null` |
| `({ user_id })`  | [`UserId`][48]           |

#### Returns

`Promise`<`string`\[]>

#### Defined in

[src/backend/index.ts:497][72]

---

### handleImageUpload

▸ **handleImageUpload**(`creatorKey`, `imageBase64`): `Promise`<`null` |
`string`>

#### Parameters

| Name          | Type                              |
| :------------ | :-------------------------------- |
| `creatorKey`  | `string`                          |
| `imageBase64` | `string` \| `null` \| `undefined` |

#### Returns

`Promise`<`null` | `string`>

#### Defined in

[src/backend/index.ts:179][73]

---

### isDueForContrivedError

▸ **isDueForContrivedError**(): `boolean`

Note that this is a per-serverless-function request counter and not global
across all Vercel virtual machines.

#### Returns

`boolean`

#### Defined in

[src/backend/index.ts:1317][74]

---

### isFriendRequestOfType

▸ **isFriendRequestOfType**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name                 | Type                      |
| :------------------- | :------------------------ |
| `(destructured)`     | `Object`                  |
| `({ request_type })` | [`FriendRequestType`][47] |
| `({ target_id })`    | [`UserId`][48]            |
| `({ user_id })`      | [`UserId`][48]            |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:983][75]

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

[src/backend/index.ts:1282][76]

---

### isMemeLiked

▸ **isMemeLiked**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name             | Type           |
| :--------------- | :------------- |
| `(destructured)` | `Object`       |
| `({ meme_id })`  | [`MemeId`][50] |
| `({ user_id })`  | [`UserId`][48] |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:537][77]

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

[src/backend/index.ts:1291][78]

---

### isUserAFriend

▸ **isUserAFriend**(`(destructured)`): `Promise`<`boolean`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| `({ friend_id })` | [`UserId`][48] |
| `({ user_id })`   | [`UserId`][48] |

#### Returns

`Promise`<`boolean`>

#### Defined in

[src/backend/index.ts:861][79]

---

### removeFriendRequest

▸ **removeFriendRequest**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name                 | Type                      |
| :------------------- | :------------------------ |
| `(destructured)`     | `Object`                  |
| `({ request_type })` | [`FriendRequestType`][47] |
| `({ target_id })`    | [`UserId`][48]            |
| `({ user_id })`      | [`UserId`][48]            |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:1015][80]

---

### removeLikedMeme

▸ **removeLikedMeme**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name             | Type           |
| :--------------- | :------------- |
| `(destructured)` | `Object`       |
| `({ meme_id })`  | [`MemeId`][50] |
| `({ user_id })`  | [`UserId`][48] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:568][81]

---

### removeUserAsFriend

▸ **removeUserAsFriend**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name              | Type           |
| :---------------- | :------------- |
| `(destructured)`  | `Object`       |
| `({ friend_id })` | [`UserId`][48] |
| `({ user_id })`   | [`UserId`][48] |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:891][82]

---

### searchMemes

▸ **searchMemes**(`(destructured)`): `Promise`<[`PublicMeme`][55]\[]>

#### Parameters

| Name               | Type                     |
| :----------------- | :----------------------- |
| `(destructured)`   | `Object`                 |
| `({ after })`      | [`MemeId`][50] \| `null` |
| `({ match })`      | `Object`                 |
| `({ regexMatch })` | `Object`                 |

#### Returns

`Promise`<[`PublicMeme`][55]\[]>

#### Defined in

[src/backend/index.ts:1073][83]

---

### updateMemes

▸ **updateMemes**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name             | Type                         |
| :--------------- | :--------------------------- |
| `(destructured)` | `Object`                     |
| `({ data })`     | `Partial`<[`PatchMeme`][84]> |
| `({ meme_ids })` | [`MemeId`][50]\[]            |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:402][85]

---

### updateUser

▸ **updateUser**(`(destructured)`): `Promise`<`void`>

#### Parameters

| Name               | Type                         |
| :----------------- | :--------------------------- |
| `(destructured)`   | `Object`                     |
| `({ creatorKey })` | `string`                     |
| `({ data })`       | `Partial`<[`PatchUser`][86]> |
| `({ user_id })`    | [`UserId`][48]               |

#### Returns

`Promise`<`void`>

#### Defined in

[src/backend/index.ts:692][87]

[1]: ../README.md
[2]: src_backend.md#banned_key
[3]: src_backend.md#dev_key
[4]: src_backend.md#dummy_key
[5]: src_backend.md#imgur_api_uri
[6]: src_backend.md#machine_key
[7]: src_backend.md#null_key
[8]: src_backend.md#publicmemeprojection
[9]: src_backend.md#publicuserprojection
[10]: src_backend.md#addfriendrequest
[11]: src_backend.md#addlikedmeme
[12]: src_backend.md#addtorequestlog
[13]: src_backend.md#adduserasfriend
[14]: src_backend.md#creatememe
[15]: src_backend.md#createuser
[16]: src_backend.md#deleteuser
[17]: src_backend.md#getallusers
[18]: src_backend.md#getapikeys
[19]: src_backend.md#getfriendrequestsoftype
[20]: src_backend.md#getmemelikesuserids
[21]: src_backend.md#getmemes
[22]: src_backend.md#getsysteminfo
[23]: src_backend.md#getuser
[24]: src_backend.md#getuserfriendsuserids
[25]: src_backend.md#getuserlikedmemeids
[26]: src_backend.md#handleimageupload
[27]: src_backend.md#isdueforcontrivederror
[28]: src_backend.md#isfriendrequestoftype
[29]: src_backend.md#iskeyauthentic
[30]: src_backend.md#ismemeliked
[31]: src_backend.md#isratelimited
[32]: src_backend.md#isuserafriend
[33]: src_backend.md#removefriendrequest
[34]: src_backend.md#removelikedmeme
[35]: src_backend.md#removeuserasfriend
[36]: src_backend.md#searchmemes
[37]: src_backend.md#updatememes
[38]: src_backend.md#updateuser
[39]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L92
[40]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L99
[41]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L85
[42]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L64
[43]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L78
[44]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L71
[45]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L152
[46]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L166
[47]: types_global.md#friendrequesttype
[48]: ../interfaces/types_global.UserId.md
[49]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1042
[50]: ../interfaces/types_global.MemeId.md
[51]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L597
[52]: types_global.md#nextapistate
[53]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1332
[54]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L913
[55]: types_global.md#publicmeme
[56]: types_global.md#newmeme
[57]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L282
[58]: types_global.md#publicuser
[59]: types_global.md#newuser
[60]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L629
[61]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L753
[62]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L772
[63]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1343
[64]: ../interfaces/types_global.FriendRequestId.md
[65]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L940
[66]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L457
[67]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L427
[68]: types_global.md#internalinfo
[69]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L272
[70]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L796
[71]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L822
[72]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L497
[73]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L179
[74]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1317
[75]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L983
[76]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1282
[77]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L537
[78]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1291
[79]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L861
[80]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1015
[81]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L568
[82]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L891
[83]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L1073
[84]: types_global.md#patchmeme
[85]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L402
[86]: types_global.md#patchuser
[87]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/src/backend/index.ts#L692
