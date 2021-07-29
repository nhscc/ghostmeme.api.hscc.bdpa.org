[ghostmeme.api.hscc.bdpa.org][1] / types/global

# Module: types/global

## Table of contents

### Interfaces

- [FriendId][2]
- [FriendRequestId][3]
- [MemeId][4]
- [UnixEpochMs][5]
- [UserId][6]

### Type aliases

- [CorpusData][7]
- [CorpusDialogLine][8]
- [FriendRequestType][9]
- [InternalApiKey][10]
- [InternalInfo][11]
- [InternalLimitedLogEntry][12]
- [InternalMeme][13]
- [InternalRequestLogEntry][14]
- [InternalUser][15]
- [NewMeme][16]
- [NewUser][17]
- [NextApiState][18]
- [PatchMeme][19]
- [PatchUser][20]
- [PublicMeme][21]
- [PublicUser][22]

## Type aliases

### CorpusData

Ƭ **CorpusData**: `Object`

The shape of precomputed conversation corpus data.

#### Type declaration

| Name        | Type                        |
| :---------- | :-------------------------- |
| `dialogs`   | [`CorpusDialogLine`][8][][] |
| `usernames` | `string`[]                  |

#### Defined in

[types/global.d.ts:231][23]

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

[types/global.d.ts:239][24]

---

### FriendRequestType

Ƭ **FriendRequestType**: `"incoming"` | `"outgoing"`

#### Defined in

[types/global.d.ts:226][25]

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

[types/global.d.ts:247][26]

---

### InternalInfo

Ƭ **InternalInfo**: `Object`

The shape of API metadata stored in MongoDb.

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `totalMemes` | `number` |
| `totalUsers` | `number` |

#### Defined in

[types/global.d.ts:26][27]

---

### InternalLimitedLogEntry

Ƭ **InternalLimitedLogEntry**: { `ip`: `string` | `null` ; `key?`: `never` ;
`until`: `number` } | { `ip?`: `never` ; `key`: `string` | `null` ; `until`:
`number` }

The shape of a limited log entry.

#### Defined in

[types/global.d.ts:267][28]

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
| `likes`               | [`UserId`][6][]            | A list of user IDs that liked this meme.                                                                                                     |
| `meta`                | `Object`                   | Metadata information only relevant to the server runtime and completely opaque to API consumers.                                             |
| `meta.creator`        | `string`                   | The API key responsible for creating this meme.                                                                                              |
| `meta.gregariousness` | `number`                   | Determines how likely machine users are to comment on (reply to) this meme.                                                                  |
| `meta.likeability`    | `number`                   | Determines how likely machine users are to take like-based actions on this meme.                                                             |
| `owner`               | [`UserId`][6]              | The ID of the user that created and owns this meme.                                                                                          |
| `private`             | `boolean`                  | If `true`, this meme should only be visible to authorized users.                                                                             |
| `receiver`            | [`UserId`][6] \| `null`    | The ID of the user that created and owns this meme.                                                                                          |
| `replyTo`             | [`MemeId`][4] \| `null`    | The ID of the meme this meme was created in response to.                                                                                     |
| `totalLikes`          | `number`                   | Integer number of likes this meme has received. We'll cache this data instead of calculating it via the aggregation for performance reasons. |

#### Defined in

[types/global.d.ts:34][29]

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

[types/global.d.ts:255][30]

---

### InternalUser

Ƭ **InternalUser**: `Object`

The shape of a user stored in MongoDb.

#### Type declaration

| Name                | Type               | Description                                                                                         |
| :------------------ | :----------------- | :-------------------------------------------------------------------------------------------------- |
| `deleted`           | `boolean`          | If `true`, the user is for all intents and purposes non-existent in the system. **`default`** false |
| `email`             | `string`           | Email address                                                                                       |
| `friends`           | [`UserId`][6][]    | A list of user IDs this user is friends with.                                                       |
| `imageUrl`          | `string` \| `null` | The HTTP image url of this user's profile pic.                                                      |
| `liked`             | [`MemeId`][4][]    | A list of meme IDs that this user has liked.                                                        |
| `meta`              | `Object`           | Metadata information only relevant to the server runtime and completely opaque to API consumers.    |
| `meta.creator`      | `string`           | The API key responsible for creating this meme.                                                     |
| `name`              | `string`           | User first, full, etc name                                                                          |
| `phone`             | `string` \| `null` | Phone number                                                                                        |
| `requests`          | `Object`           | A list of friend requests involving this user.                                                      |
| `requests.incoming` | [`UserId`][6][]    | Friend requests that have been sent to this user.                                                   |
| `requests.outgoing` | [`UserId`][6][]    | Friend requests this user has sent to others.                                                       |
| `username`          | `string`           | Username. Must be unique in the system.                                                             |

#### Defined in

[types/global.d.ts:105][31]

---

### NewMeme

Ƭ **NewMeme**: `Pick`<[`InternalMeme`][13], `"expiredAt"` | `"description"` |
`"private"` | `"imageUrl"`> & { `imageBase64`: `string` | `null` ; `owner`:
`string` ; `receiver`: `string` | `null` ; `replyTo`: `string` | `null` }

The shape of a newly received meme.

#### Defined in

[types/global.d.ts:195][32]

---

### NewUser

Ƭ **NewUser**: `Pick`<[`InternalUser`][15], `"name"` | `"email"` | `"phone"` |
`"username"`> & { `imageBase64`: `string` | `null` }

The shape of a newly received user.

#### Defined in

[types/global.d.ts:208][33]

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

[types/global.d.ts:18][34]

---

### PatchMeme

Ƭ **PatchMeme**: `Object`

The shape of a received update to an existing meme.

#### Type declaration

| Name        | Type                                |
| :---------- | :---------------------------------- |
| `expiredAt` | [`InternalMeme`][13][`"expiredAt"`] |

#### Defined in

[types/global.d.ts:215][35]

---

### PatchUser

Ƭ **PatchUser**: `Pick`<[`InternalUser`][15], `"name"` | `"email"` | `"phone"`>
& { `imageBase64`: `string` | `null` }

The shape of a received update to an existing user.

#### Defined in

[types/global.d.ts:222][36]

---

### PublicMeme

Ƭ **PublicMeme**: `Pick`<[`InternalMeme`][13], `"createdAt"` | `"expiredAt"` |
`"description"` | `"private"` | `"imageUrl"`> & { `likes`:
[`InternalMeme`][13]\[`"totalLikes"`] ; `meme_id`: `string` ; `owner`: `string`
; `receiver`: `string` | `null` ; `replyTo`: `string` | `null` }

The shape of a publicly available meme.

#### Defined in

[types/global.d.ts:169][37]

---

### PublicUser

Ƭ **PublicUser**: `Pick`<[`InternalUser`][15], `"name"` | `"email"` | `"phone"`
| `"username"` | `"deleted"` | `"imageUrl"`> & { `friends`: `number` ; `liked`:
`number` ; `user_id`: `string` }

The shape of a publicly available user.

#### Defined in

[types/global.d.ts:183][38]

[1]: ../README.md
[2]: ../interfaces/types_global.FriendId.md
[3]: ../interfaces/types_global.FriendRequestId.md
[4]: ../interfaces/types_global.MemeId.md
[5]: ../interfaces/types_global.UnixEpochMs.md
[6]: ../interfaces/types_global.UserId.md
[7]: types_global.md#corpusdata
[8]: types_global.md#corpusdialogline
[9]: types_global.md#friendrequesttype
[10]: types_global.md#internalapikey
[11]: types_global.md#internalinfo
[12]: types_global.md#internallimitedlogentry
[13]: types_global.md#internalmeme
[14]: types_global.md#internalrequestlogentry
[15]: types_global.md#internaluser
[16]: types_global.md#newmeme
[17]: types_global.md#newuser
[18]: types_global.md#nextapistate
[19]: types_global.md#patchmeme
[20]: types_global.md#patchuser
[21]: types_global.md#publicmeme
[22]: types_global.md#publicuser
[23]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L231
[24]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L239
[25]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L226
[26]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L247
[27]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L26
[28]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L267
[29]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L34
[30]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L255
[31]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L105
[32]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L195
[33]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L208
[34]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L18
[35]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L215
[36]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L222
[37]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L169
[38]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/types/global.d.ts#L183
