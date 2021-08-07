[ghostmeme.api.hscc.bdpa.org](../README.md) / types/global

# Module: types/global

## Table of contents

### Interfaces

- [FriendId](../interfaces/types_global.FriendId.md)
- [FriendRequestId](../interfaces/types_global.FriendRequestId.md)
- [MemeId](../interfaces/types_global.MemeId.md)
- [UnixEpochMs](../interfaces/types_global.UnixEpochMs.md)
- [UploadId](../interfaces/types_global.UploadId.md)
- [UserId](../interfaces/types_global.UserId.md)

### Type aliases

- [CorpusData](types_global.md#corpusdata)
- [CorpusDialogLine](types_global.md#corpusdialogline)
- [FriendRequestType](types_global.md#friendrequesttype)
- [InternalApiKey](types_global.md#internalapikey)
- [InternalInfo](types_global.md#internalinfo)
- [InternalLimitedLogEntry](types_global.md#internallimitedlogentry)
- [InternalMeme](types_global.md#internalmeme)
- [InternalRequestLogEntry](types_global.md#internalrequestlogentry)
- [InternalUpload](types_global.md#internalupload)
- [InternalUser](types_global.md#internaluser)
- [NewMeme](types_global.md#newmeme)
- [NewUser](types_global.md#newuser)
- [NextApiState](types_global.md#nextapistate)
- [PatchMeme](types_global.md#patchmeme)
- [PatchUser](types_global.md#patchuser)
- [PublicMeme](types_global.md#publicmeme)
- [PublicUser](types_global.md#publicuser)

## Type aliases

### CorpusData

Ƭ **CorpusData**: `Object`

The shape of precomputed conversation corpus data.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dialogs` | [`CorpusDialogLine`](types_global.md#corpusdialogline)[][] |
| `usernames` | `string`[] |

#### Defined in

[types/global.d.ts:255](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L255)

___

### CorpusDialogLine

Ƭ **CorpusDialogLine**: `Object`

The shape of a single line of precomputed conversation corpus data.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `actor` | ``"A"`` \| ``"B"`` |
| `line` | `string` |

#### Defined in

[types/global.d.ts:263](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L263)

___

### FriendRequestType

Ƭ **FriendRequestType**: ``"incoming"`` \| ``"outgoing"``

Available types of friend requests.

#### Defined in

[types/global.d.ts:250](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L250)

___

### InternalApiKey

Ƭ **InternalApiKey**: `Object`

The shape of an API key.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `owner` | `string` |

#### Defined in

[types/global.d.ts:271](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L271)

___

### InternalInfo

Ƭ **InternalInfo**: `Object`

The shape of API metadata stored in MongoDb.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `totalMemes` | `number` |
| `totalUploads` | `number` |
| `totalUsers` | `number` |

#### Defined in

[types/global.d.ts:28](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L28)

___

### InternalLimitedLogEntry

Ƭ **InternalLimitedLogEntry**: { `ip`: `string` \| ``null`` ; `key?`: `never` ; `until`: `number`  } \| { `ip?`: `never` ; `key`: `string` \| ``null`` ; `until`: `number`  }

The shape of a limited log entry.

#### Defined in

[types/global.d.ts:291](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L291)

___

### InternalMeme

Ƭ **InternalMeme**: `Object`

The shape of a meme stored in MongoDb.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `createdAt` | [`UnixEpochMs`](../interfaces/types_global.UnixEpochMs.md) | When this meme was created creation (milliseconds since unix epoch). |
| `description` | `string` \| ``null`` | The utf-8 content of this meme. |
| `expiredAt` | [`UnixEpochMs`](../interfaces/types_global.UnixEpochMs.md) \| ``-1`` | When this meme was created creation (milliseconds since unix epoch). |
| `imageUrl` | `string` \| ``null`` | The HTTP image url of this meme. |
| `likes` | [`UserId`](../interfaces/types_global.UserId.md)[] | A list of user IDs that liked this meme. |
| `meta` | `Object` | Metadata information only relevant to the server runtime and completely opaque to API consumers. |
| `meta.creator` | `string` | The API key responsible for creating this meme. |
| `meta.gregariousness` | `number` | Determines how likely machine users are to comment on (reply to) this meme. |
| `meta.likeability` | `number` | Determines how likely machine users are to take like-based actions on this meme. |
| `owner` | [`UserId`](../interfaces/types_global.UserId.md) | The ID of the user that created and owns this meme. |
| `private` | `boolean` | If `true`, this meme should only be visible to authorized users. |
| `receiver` | [`UserId`](../interfaces/types_global.UserId.md) \| ``null`` | The ID of the user that created and owns this meme. |
| `replyTo` | [`MemeId`](../interfaces/types_global.MemeId.md) \| ``null`` | The ID of the meme this meme was created in response to. |
| `totalLikes` | `number` | Integer number of likes this meme has received. We'll cache this data instead of calculating it via the aggregation for performance reasons. |

#### Defined in

[types/global.d.ts:37](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L37)

___

### InternalRequestLogEntry

Ƭ **InternalRequestLogEntry**: `Object`

The shape of a request log entry.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ip` | `string` \| ``null`` |
| `key` | `string` \| ``null`` |
| `method` | `string` \| ``null`` |
| `resStatusCode` | `number` |
| `route` | `string` \| ``null`` |
| `time` | `number` |

#### Defined in

[types/global.d.ts:279](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L279)

___

### InternalUpload

Ƭ **InternalUpload**: `Object`

The shape of upload metadata LRU cache stored in MongoDb.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `hash` | `string` | The sha1 hash of the base64 image data. |
| `lastUsedAt` | [`UnixEpochMs`](../interfaces/types_global.UnixEpochMs.md) | Updated whenever the record is used (milliseconds since unix epoch). |
| `uri` | `string` | The imgur uri for the image. |

#### Defined in

[types/global.d.ts:172](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L172)

___

### InternalUser

Ƭ **InternalUser**: `Object`

The shape of a user stored in MongoDb.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `deleted` | `boolean` | If `true`, the user is for all intents and purposes non-existent in the system.  **`default`** false |
| `email` | `string` | Email address |
| `friends` | [`UserId`](../interfaces/types_global.UserId.md)[] | A list of user IDs this user is friends with. |
| `imageUrl` | `string` \| ``null`` | The HTTP image url of this user's profile pic. |
| `liked` | [`MemeId`](../interfaces/types_global.MemeId.md)[] | A list of meme IDs that this user has liked. |
| `meta` | `Object` | Metadata information only relevant to the server runtime and completely opaque to API consumers. |
| `meta.creator` | `string` | The API key responsible for creating this meme. |
| `name` | `string` | User first, full, etc name |
| `phone` | `string` \| ``null`` | Phone number |
| `requests` | `Object` | A list of friend requests involving this user. |
| `requests.incoming` | [`UserId`](../interfaces/types_global.UserId.md)[] | Friend requests that have been sent to this user. |
| `requests.outgoing` | [`UserId`](../interfaces/types_global.UserId.md)[] | Friend requests this user has sent to others. |
| `username` | `string` | Username. Must be unique in the system. |

#### Defined in

[types/global.d.ts:108](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L108)

___

### NewMeme

Ƭ **NewMeme**: `Pick`<[`InternalMeme`](types_global.md#internalmeme), ``"expiredAt"`` \| ``"description"`` \| ``"private"`` \| ``"imageUrl"``\> & { `imageBase64`: `string` \| ``null`` ; `owner`: `string` ; `receiver`: `string` \| ``null`` ; `replyTo`: `string` \| ``null``  }

The shape of a newly received meme.

#### Defined in

[types/global.d.ts:216](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L216)

___

### NewUser

Ƭ **NewUser**: `Pick`<[`InternalUser`](types_global.md#internaluser), ``"name"`` \| ``"email"`` \| ``"phone"`` \| ``"username"``\> & { `imageBase64`: `string` \| ``null``  }

The shape of a newly received user.

#### Defined in

[types/global.d.ts:229](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L229)

___

### NextApiState

Ƭ **NextApiState**<`T`\>: `Object`

A type combining NextApiRequest and NextApiResponse.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse`<`T`\> |

#### Defined in

[types/global.d.ts:20](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L20)

___

### PatchMeme

Ƭ **PatchMeme**: `Object`

The shape of a received update to an existing meme.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `expiredAt` | [`InternalMeme`](types_global.md#internalmeme)[``"expiredAt"``] |

#### Defined in

[types/global.d.ts:236](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L236)

___

### PatchUser

Ƭ **PatchUser**: `Pick`<[`InternalUser`](types_global.md#internaluser), ``"name"`` \| ``"email"`` \| ``"phone"``\> & { `imageBase64?`: `string` \| ``null``  }

The shape of a received update to an existing user.

#### Defined in

[types/global.d.ts:243](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L243)

___

### PublicMeme

Ƭ **PublicMeme**: `Pick`<[`InternalMeme`](types_global.md#internalmeme), ``"createdAt"`` \| ``"expiredAt"`` \| ``"description"`` \| ``"private"`` \| ``"imageUrl"``\> & { `likes`: [`InternalMeme`](types_global.md#internalmeme)[``"totalLikes"``] ; `meme_id`: `string` ; `owner`: `string` ; `receiver`: `string` \| ``null`` ; `replyTo`: `string` \| ``null``  }

The shape of a publicly available meme.

#### Defined in

[types/global.d.ts:190](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L190)

___

### PublicUser

Ƭ **PublicUser**: `Pick`<[`InternalUser`](types_global.md#internaluser), ``"name"`` \| ``"email"`` \| ``"phone"`` \| ``"username"`` \| ``"deleted"`` \| ``"imageUrl"``\> & { `friends`: `number` ; `liked`: `number` ; `user_id`: `string`  }

The shape of a publicly available user.

#### Defined in

[types/global.d.ts:204](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/types/global.d.ts#L204)
