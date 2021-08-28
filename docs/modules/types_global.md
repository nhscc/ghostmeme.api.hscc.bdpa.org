[ghostmeme.api.hscc.bdpa.org][1] / types/global

# Module: types/global

## Table of contents

### Interfaces

- [FriendId][2]
- [FriendRequestId][3]
- [MemeId][4]
- [UnixEpochMs][5]
- [UploadId][6]
- [UserId][7]

### Type aliases

- [ChatsWorkerOptions][8]
- [CorpusData][9]
- [CorpusDialogLine][10]
- [FriendRequestType][11]
- [FriendsWorkerOptions][12]
- [ImgurApiResponse][13]
- [InteractionsWorkerOptions][14]
- [InternalApiKey][15]
- [InternalInfo][16]
- [InternalLimitedLogEntry][17]
- [InternalMeme][18]
- [InternalRequestLogEntry][19]
- [InternalUpload][20]
- [InternalUser][21]
- [MemesWorkerOptions][22]
- [NewMeme][23]
- [NewUser][24]
- [NextApiState][25]
- [PatchMeme][26]
- [PatchUser][27]
- [PublicMeme][28]
- [PublicUser][29]

## Type aliases

### ChatsWorkerOptions

Ƭ **ChatsWorkerOptions**: `Object`

The shape of the options object accepted by the chats worker.

#### Type declaration

| Name             | Type               |
| :--------------- | :----------------- |
| `debugNamespace` | `string`           |
| `startTimeMs`    | [`UnixEpochMs`][5] |
| `user_id`        | `string`           |
| `username`       | `string`           |

#### Defined in

[types/global.d.ts:20][30]

---

### CorpusData

Ƭ **CorpusData**: `Object`

The shape of precomputed conversation corpus data.

#### Type declaration

| Name        | Type                           |
| :---------- | :----------------------------- |
| `dialogs`   | [`CorpusDialogLine`][10]\[]\[] |
| `usernames` | `string`\[]                    |

#### Defined in

[types/global.d.ts:307][31]

---

### CorpusDialogLine

Ƭ **CorpusDialogLine**: `Object`

The shape of a single line of precomputed conversation corpus data.

#### Type declaration

| Name    | Type           |
| :------ | :------------- |
| `actor` | `"A"` \| `"B"` |
| `line`  | `string`       |

#### Defined in

[types/global.d.ts:315][32]

---

### FriendRequestType

Ƭ **FriendRequestType**: `"incoming"` | `"outgoing"`

Available types of friend requests.

#### Defined in

[types/global.d.ts:302][33]

---

### FriendsWorkerOptions

Ƭ **FriendsWorkerOptions**: `Object`

The shape of the options object accepted by the friends worker.

#### Type declaration

| Name             | Type               |
| :--------------- | :----------------- |
| `debugNamespace` | `string`           |
| `startTimeMs`    | [`UnixEpochMs`][5] |
| `user_id`        | `string`           |
| `username`       | `string`           |

#### Defined in

[types/global.d.ts:30][34]

---

### ImgurApiResponse

Ƭ **ImgurApiResponse**: `Object`

The shape of an imgur image upload response.

**`see`** [https://apidocs.imgur.com][35]

#### Type declaration

| Name          | Type     |
| :------------ | :------- |
| `data`        | `Object` |
| `data.error?` | `string` |
| `data.link?`  | `string` |

#### Defined in

[types/global.d.ts:62][36]

---

### InteractionsWorkerOptions

Ƭ **InteractionsWorkerOptions**: `Object`

The shape of the options object accepted by the interactions worker.

#### Type declaration

| Name             | Type               |
| :--------------- | :----------------- |
| `debugNamespace` | `string`           |
| `friend_ids`     | `string`\[]        |
| `startTimeMs`    | [`UnixEpochMs`][5] |
| `user_id`        | `string`           |
| `username`       | `string`           |

#### Defined in

[types/global.d.ts:40][37]

---

### InternalApiKey

Ƭ **InternalApiKey**: `Object`

The shape of an API key.

#### Type declaration

| Name    | Type     |
| :------ | :------- |
| `key`   | `string` |
| `owner` | `string` |

#### Defined in

[types/global.d.ts:323][38]

---

### InternalInfo

Ƭ **InternalInfo**: `Object`

The shape of API metadata stored in MongoDb.

#### Type declaration

| Name           | Type     |
| :------------- | :------- |
| `totalMemes`   | `number` |
| `totalUploads` | `number` |
| `totalUsers`   | `number` |

#### Defined in

[types/global.d.ts:80][39]

---

### InternalLimitedLogEntry

Ƭ **InternalLimitedLogEntry**: { `ip`: `string` | `null` ; `key?`: `never` ;
`until`: `number` } | { `ip?`: `never` ; `key`: `string` | `null` ; `until`:
`number` }

The shape of a limited log entry.

#### Defined in

[types/global.d.ts:343][40]

---

### InternalMeme

Ƭ **InternalMeme**: `Object`

The shape of a meme stored in MongoDb.

#### Type declaration

| Name                  | Type                       | Description                                                                                                                                  |
| :-------------------- | :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `createdAt`           | [`UnixEpochMs`][5]         | When this meme was created creation (milliseconds since unix epoch).                                                                         |
| `description`         | `string` \| `null`         | The utf-8 content of this meme.                                                                                                              |
| `expiredAt`           | [`UnixEpochMs`][5] \| `-1` | When this meme was created creation (milliseconds since unix epoch).                                                                         |
| `imageUrl`            | `string` \| `null`         | The HTTP image url of this meme.                                                                                                             |
| `likes`               | [`UserId`][7]\[]           | A list of user IDs that liked this meme.                                                                                                     |
| `meta`                | `Object`                   | Metadata information only relevant to the server runtime and completely opaque to API consumers.                                             |
| `meta.creator`        | `string`                   | The API key responsible for creating this meme.                                                                                              |
| `meta.gregariousness` | `number`                   | Determines how likely machine users are to comment on (reply to) this meme.                                                                  |
| `meta.likeability`    | `number`                   | Determines how likely machine users are to take like-based actions on this meme.                                                             |
| `owner`               | [`UserId`][7]              | The ID of the user that created and owns this meme.                                                                                          |
| `private`             | `boolean`                  | If `true`, this meme should only be visible to authorized users.                                                                             |
| `receiver`            | [`UserId`][7] \| `null`    | The ID of the user that created and owns this meme.                                                                                          |
| `replyTo`             | [`MemeId`][4] \| `null`    | The ID of the meme this meme was created in response to.                                                                                     |
| `totalLikes`          | `number`                   | Integer number of likes this meme has received. We'll cache this data instead of calculating it via the aggregation for performance reasons. |

#### Defined in

[types/global.d.ts:89][41]

---

### InternalRequestLogEntry

Ƭ **InternalRequestLogEntry**: `Object`

The shape of a request log entry.

#### Type declaration

| Name            | Type               |
| :-------------- | :----------------- |
| `ip`            | `string` \| `null` |
| `key`           | `string` \| `null` |
| `method`        | `string` \| `null` |
| `resStatusCode` | `number`           |
| `route`         | `string` \| `null` |
| `time`          | `number`           |

#### Defined in

[types/global.d.ts:331][42]

---

### InternalUpload

Ƭ **InternalUpload**: `Object`

The shape of upload metadata LRU cache stored in MongoDb.

#### Type declaration

| Name         | Type               | Description                                                          |
| :----------- | :----------------- | :------------------------------------------------------------------- |
| `hash`       | `string`           | The sha1 hash of the base64 image data.                              |
| `lastUsedAt` | [`UnixEpochMs`][5] | Updated whenever the record is used (milliseconds since unix epoch). |
| `uri`        | `string`           | The imgur uri for the image.                                         |

#### Defined in

[types/global.d.ts:224][43]

---

### InternalUser

Ƭ **InternalUser**: `Object`

The shape of a user stored in MongoDb.

#### Type declaration

| Name                | Type               | Description                                                                                         |
| :------------------ | :----------------- | :-------------------------------------------------------------------------------------------------- |
| `deleted`           | `boolean`          | If `true`, the user is for all intents and purposes non-existent in the system. **`default`** false |
| `email`             | `string`           | Email address                                                                                       |
| `friends`           | [`UserId`][7]\[]   | A list of user IDs this user is friends with.                                                       |
| `imageUrl`          | `string` \| `null` | The HTTP image url of this user's profile pic.                                                      |
| `liked`             | [`MemeId`][4]\[]   | A list of meme IDs that this user has liked.                                                        |
| `meta`              | `Object`           | Metadata information only relevant to the server runtime and completely opaque to API consumers.    |
| `meta.creator`      | `string`           | The API key responsible for creating this meme.                                                     |
| `name`              | `string`           | User first, full, etc name                                                                          |
| `phone`             | `string` \| `null` | Phone number                                                                                        |
| `requests`          | `Object`           | A list of friend requests involving this user.                                                      |
| `requests.incoming` | [`UserId`][7]\[]   | Friend requests that have been sent to this user.                                                   |
| `requests.outgoing` | [`UserId`][7]\[]   | Friend requests this user has sent to others.                                                       |
| `username`          | `string`           | Username. Must be unique in the system.                                                             |

#### Defined in

[types/global.d.ts:160][44]

---

### MemesWorkerOptions

Ƭ **MemesWorkerOptions**: `Object`

The shape of the options object accepted by the memes worker.

#### Type declaration

| Name             | Type               |
| :--------------- | :----------------- |
| `debugNamespace` | `string`           |
| `startTimeMs`    | [`UnixEpochMs`][5] |
| `user_id`        | `string`           |
| `username`       | `string`           |

#### Defined in

[types/global.d.ts:51][45]

---

### NewMeme

Ƭ **NewMeme**: `Pick`<[`InternalMeme`][18], `"expiredAt"` | `"description"` |
`"private"` | `"imageUrl"`> & { `imageBase64`: `string` | `null` ; `owner`:
`string` ; `receiver`: `string` | `null` ; `replyTo`: `string` | `null` }

The shape of a newly received meme.

#### Defined in

[types/global.d.ts:268][46]

---

### NewUser

Ƭ **NewUser**: `Pick`<[`InternalUser`][21], `"name"` | `"email"` | `"phone"` |
`"username"`> & { `imageBase64`: `string` | `null` }

The shape of a newly received user.

#### Defined in

[types/global.d.ts:281][47]

---

### NextApiState

Ƭ **NextApiState**<`T`>: `Object`

A type combining NextApiRequest and NextApiResponse.

#### Type parameters

| Name | Type      |
| :--- | :-------- |
| `T`  | `unknown` |

#### Type declaration

| Name  | Type                   |
| :---- | :--------------------- |
| `req` | `NextApiRequest`       |
| `res` | `NextApiResponse`<`T`> |

#### Defined in

[types/global.d.ts:72][48]

---

### PatchMeme

Ƭ **PatchMeme**: `Object`

The shape of a received update to an existing meme.

#### Type declaration

| Name        | Type                                 |
| :---------- | :----------------------------------- |
| `expiredAt` | [`InternalMeme`][18]\[`"expiredAt"`] |

#### Defined in

[types/global.d.ts:288][49]

---

### PatchUser

Ƭ **PatchUser**: `Pick`<[`InternalUser`][21], `"name"` | `"email"` | `"phone"`>
& { `imageBase64?`: `string` | `null` }

The shape of a received update to an existing user.

#### Defined in

[types/global.d.ts:295][50]

---

### PublicMeme

Ƭ **PublicMeme**: `Pick`<[`InternalMeme`][18], `"createdAt"` | `"expiredAt"` |
`"description"` | `"private"` | `"imageUrl"`> & { `likes`:
[`InternalMeme`][18]\[`"totalLikes"`] ; `meme_id`: `string` ; `owner`: `string`
; `receiver`: `string` | `null` ; `replyTo`: `string` | `null` }

The shape of a publicly available meme.

#### Defined in

[types/global.d.ts:242][51]

---

### PublicUser

Ƭ **PublicUser**: `Pick`<[`InternalUser`][21], `"name"` | `"email"` | `"phone"`
\| `"username"` | `"deleted"` | `"imageUrl"`> & { `friends`: `number` ; `liked`:
`number` ; `user_id`: `string` }

The shape of a publicly available user.

#### Defined in

[types/global.d.ts:256][52]

[1]: ../README.md
[2]: ../interfaces/types_global.FriendId.md
[3]: ../interfaces/types_global.FriendRequestId.md
[4]: ../interfaces/types_global.MemeId.md
[5]: ../interfaces/types_global.UnixEpochMs.md
[6]: ../interfaces/types_global.UploadId.md
[7]: ../interfaces/types_global.UserId.md
[8]: types_global.md#chatsworkeroptions
[9]: types_global.md#corpusdata
[10]: types_global.md#corpusdialogline
[11]: types_global.md#friendrequesttype
[12]: types_global.md#friendsworkeroptions
[13]: types_global.md#imgurapiresponse
[14]: types_global.md#interactionsworkeroptions
[15]: types_global.md#internalapikey
[16]: types_global.md#internalinfo
[17]: types_global.md#internallimitedlogentry
[18]: types_global.md#internalmeme
[19]: types_global.md#internalrequestlogentry
[20]: types_global.md#internalupload
[21]: types_global.md#internaluser
[22]: types_global.md#memesworkeroptions
[23]: types_global.md#newmeme
[24]: types_global.md#newuser
[25]: types_global.md#nextapistate
[26]: types_global.md#patchmeme
[27]: types_global.md#patchuser
[28]: types_global.md#publicmeme
[29]: types_global.md#publicuser
[30]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L20
[31]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L307
[32]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L315
[33]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L302
[34]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L30
[35]: https://apidocs.imgur.com
[36]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L62
[37]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L40
[38]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L323
[39]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L80
[40]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L343
[41]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L89
[42]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L331
[43]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L224
[44]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L160
[45]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L51
[46]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L268
[47]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L281
[48]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L72
[49]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L288
[50]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L295
[51]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L242
[52]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/331c113/types/global.d.ts#L256
