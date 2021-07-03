import sha256 from 'crypto-js/sha256';
import { ObjectId } from 'mongodb';
import { randomInt } from 'crypto';
import { toss } from 'toss-expression';
import { getClientIp } from 'request-ip';
import { isPlainObject } from 'is-plain-object';
import { getEnv } from 'universe/backend/env';
import { getDb, itemExists, itemToObjectId, itemToStringId } from 'universe/backend/db';

import {
  InvalidIdError,
  InvalidKeyError,
  ValidationError,
  GuruMeditationError,
  NotFoundError,
  ItemNotFoundError
} from 'universe/backend/error';

import type { NextApiRequest } from 'next';
import type { WithId } from 'mongodb';

import type {
  NextApiState,
  InternalRequestLogEntry,
  InternalLimitedLogEntry,
  InternalApiKey,
  InternalInfo,
  InternalMeme,
  InternalUser,
  UserId,
  MemeId,
  FriendRequestId,
  FriendRequestType,
  PublicMeme,
  PublicUser,
  NewMeme,
  NewUser,
  PatchMeme,
  PatchUser
} from 'types/global';

const nameRegex = /^[a-zA-Z0-9 -]+$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phoneRegex =
  /^(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?$/;
const usernameRegex = /^[a-zA-Z0-9_-]{5,20}$/;

/**
 * Global (but only per serverless function instance) request counting state
 */
let requestCounter = 0;

/**
 * This key is guaranteed never to appear in the system and can be checked
 * against.
 */
export const NULL_KEY = '00000000-0000-0000-0000-000000000000';

/**
 * This key is only valid when running in a Jest test environment.
 */
export const DUMMY_KEY = '12349b61-83a7-4036-b060-213784b491';

/**
 * This key is guaranteed to be rate limited.
 */
export const BANNED_KEY = 'banned-h54e-6rt7-gctfh-hrftdygct0';

/**
 * Meme properties that can be matched against with `searchMemes()`.
 */
const matchableStrings = [
  'owner',
  'receiver',
  'createdAt',
  'expiredAt',
  'description',
  'totalLikes',
  'private',
  'replyTo'
]; /* as const */

/**
 * Whitelisted MongoDB sub-matchers that can be used with `searchMemes()`, not
 * including the special "$or" sub-matcher.
 */
const matchableSubStrings = ['$gt', '$lt', '$gte', '$lte'];

export const publicMemeProjection = {
  _id: false,
  meme_id: '$_id',
  owner: true,
  receiver: true,
  createdAt: true,
  expiredAt: true,
  description: true,
  likes: '$totalLikes',
  private: true,
  replyTo: true,
  imageUrl: true
};

export const publicUserProjection = {
  _id: false,
  user_id: '$_id',
  name: true,
  email: true,
  phone: true,
  username: true,
  friends: { $size: '$friends' },
  liked: { $size: '$liked' },
  deleted: true,
  imageUrl: true
};

export async function getSystemInfo(): Promise<InternalInfo> {
  return (
    (await (await getDb())
      .collection<InternalInfo>('info')
      .find()
      .project({ _id: false })
      .next()) ?? toss(new GuruMeditationError())
  );
}

export async function createMeme({
  creatorKey,
  data
}: {
  creatorKey: string;
  data: Partial<NewMeme>;
}): Promise<PublicMeme> {
  if (!isPlainObject(data)) {
    throw new ValidationError('only JSON content is allowed');
  } else if (
    typeof data.content != 'string' ||
    !data.content.length ||
    data.content.length > 280
  ) {
    throw new ValidationError(
      '`content` must be a non-zero length string <= 280 characters'
    );
  } else if (typeof data.private != 'boolean') {
    throw new ValidationError('`private` must be a boolean');
  } else if (!creatorKey || typeof creatorKey != 'string') {
    throw new InvalidKeyError();
  }

  try {
    data.owner = new ObjectId(data.owner);
  } catch {
    throw new ValidationError('invalid user_id for `owner`');
  }

  if (data.replyTo) {
    try {
      data.replyTo = new ObjectId(data.replyTo);
    } catch {
      throw new ValidationError('invalid user_id for `replyTo`');
    }
  } else data.replyTo = null;

  if (data.rememeOf) {
    try {
      data.rememeOf = new ObjectId(data.rememeOf);
    } catch {
      throw new ValidationError('invalid user_id for `rememeOf`');
    }
  } else data.rememeOf = null;

  const { owner, content, private: p, replyTo, rememeOf, ...rest } = data;

  const db = await getDb();
  const memes = db.collection<InternalMeme>('memes');
  const users = db.collection<InternalUser>('users');

  if (Object.keys(rest).length > 0) {
    throw new ValidationError('unexpected properties encountered');
  } else if (replyTo && rememeOf) {
    throw new ValidationError('memes must be either a meme-back or a rememe');
  } else if (!(await itemExists(users, owner))) {
    throw new ItemNotFoundError(owner);
  } else if (replyTo && !(await itemExists(memes, replyTo))) {
    throw new ItemNotFoundError(replyTo);
  } else if (rememeOf && !(await itemExists(memes, rememeOf))) {
    throw new ItemNotFoundError(rememeOf);
  }

  // * At this point, we can finally trust this data is not malicious
  const newMeme: InternalMeme = {
    owner,
    content,
    createdAt: Date.now(),
    likes: [],
    totalLikes: 0,
    totalRememes: 0,
    totalMemebacks: 0,
    deleted: false,
    private: p,
    replyTo,
    rememeOf,
    meta: {
      creator: creatorKey,
      likeability: 1 / randomInt(100),
      rememeability: 1 / randomInt(100),
      memebackability: 1 / randomInt(100)
    }
  };

  await memes.insertOne(newMeme);
  await db.collection<InternalInfo>('info').updateOne({}, { $inc: { totalMemes: 1 } });

  if (replyTo) {
    await memes.updateOne({ _id: replyTo }, { $inc: { totalMemebacks: 1 } });
  } else if (rememeOf) {
    await memes.updateOne({ _id: rememeOf }, { $inc: { totalRememes: 1 } });
  }

  return getMemes({ meme_ids: [(newMeme as WithId<InternalMeme>)._id] }).then(
    (ids) => ids[0]
  );
}

export async function updateMemes({
  meme_ids,
  data
}: {
  meme_ids: MemeId[];
  data: Partial<PatchMeme>;
}): Promise<void> {
  if (!Array.isArray(meme_ids)) {
    throw new InvalidIdError();
  } else if (meme_ids.length > getEnv().RESULTS_PER_PAGE) {
    throw new ValidationError('too many meme_ids specified');
  } else if (!meme_ids.every((id) => id instanceof ObjectId)) {
    throw new InvalidIdError();
  } else if (meme_ids.length) {
    const db = await getDb();
    const numUpdated = await db
      .collection<InternalMeme>('memes')
      .updateMany({ _id: { $in: meme_ids }, deleted: false }, { $set: { deleted: true } })
      .then((r) => r.matchedCount);

    await db
      .collection<InternalInfo>('info')
      .updateOne({}, { $inc: { totalMemes: -numUpdated } });
  }
}

export async function getMemes({
  meme_ids
}: {
  meme_ids: MemeId[];
}): Promise<PublicMeme[]> {
  if (!Array.isArray(meme_ids)) {
    throw new InvalidIdError();
  } else if (meme_ids.length > getEnv().RESULTS_PER_PAGE) {
    throw new ValidationError('too many meme_ids specified');
  } else if (!meme_ids.every((id) => id instanceof ObjectId)) {
    throw new InvalidIdError();
  } else if (!meme_ids.length) {
    return [];
  } else {
    const memes = await (
      await getDb()
    )
      .collection<InternalMeme>('memes')
      .find({ _id: { $in: meme_ids } })
      .sort({ _id: -1 })
      .limit(getEnv().RESULTS_PER_PAGE)
      .project<PublicMeme>(publicMemeProjection)
      .toArray();

    if (memes.length != meme_ids.length) {
      throw new NotFoundError('some or all meme_ids could not be found');
    } else return memes;
  }
}

export async function getMemeLikesUserIds({
  meme_id,
  after
}: {
  meme_id: MemeId;
  after: UserId | null;
}): Promise<string[]> {
  if (!(meme_id instanceof ObjectId)) {
    throw new InvalidIdError(meme_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const memes = db.collection<InternalMeme>('memes');
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(memes, meme_id))) {
      throw new ItemNotFoundError(meme_id);
    } else if (after && !(await itemExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await memes
        .find({ _id: meme_id })
        .project<{ likes: UserId[] }>({
          likes: {
            $slice: [
              '$likes',
              after ? { $sum: [{ $indexOfArray: ['$likes', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.likes))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function getUserLikedMemeIds({
  user_id,
  after
}: {
  user_id: UserId;
  after: MemeId | null;
}): Promise<string[]> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');
    const memes = db.collection<InternalMeme>('memes');

    if (!(await itemExists(users, user_id))) {
      throw new ItemNotFoundError(user_id);
    } else if (after && !(await itemExists(memes, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await users
        .find({ _id: user_id })
        .project<{ likes: MemeId[] }>({
          likes: {
            $slice: [
              '$liked',
              after ? { $sum: [{ $indexOfArray: ['$liked', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.likes))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function isMemeLiked({
  meme_id,
  user_id
}: {
  meme_id: MemeId;
  user_id: UserId;
}): Promise<boolean> {
  if (!(meme_id instanceof ObjectId)) {
    throw new InvalidIdError(meme_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const memes = db.collection<InternalMeme>('memes');
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(memes, meme_id))) throw new ItemNotFoundError(meme_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    return (
      (await memes
        .find({ _id: meme_id })
        .project<{ liked: boolean }>({
          liked: { $in: [user_id, '$likes'] }
        })
        .next()
        .then((r) => r?.liked)) ?? toss(new GuruMeditationError())
    );
  }
}

export async function removeLikedMeme({
  meme_id,
  user_id
}: {
  meme_id: MemeId;
  user_id: UserId;
}): Promise<void> {
  if (!(meme_id instanceof ObjectId)) {
    throw new InvalidIdError(meme_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const memes = db.collection<InternalMeme>('memes');
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(memes, meme_id))) throw new ItemNotFoundError(meme_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await Promise.all([
      users.updateOne({ _id: user_id }, { $pull: { liked: meme_id } }),
      memes.updateOne(
        { _id: meme_id, likes: { $in: [user_id] } },
        { $pull: { likes: user_id }, $inc: { totalLikes: -1 } }
      )
    ]);
  }
}

export async function addLikedMeme({
  meme_id,
  user_id
}: {
  meme_id: MemeId;
  user_id: UserId;
}): Promise<void> {
  if (!(meme_id instanceof ObjectId)) {
    throw new InvalidIdError(meme_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const memes = db.collection<InternalMeme>('memes');
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(memes, meme_id))) throw new ItemNotFoundError(meme_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await Promise.all([
      users.updateOne(
        { _id: user_id, liked: { $nin: [meme_id] } },
        { $push: { liked: { $each: [meme_id], $position: 0 } } }
      ),
      memes.updateOne(
        { _id: meme_id, likes: { $nin: [user_id] } },
        { $push: { likes: { $each: [user_id], $position: 0 } }, $inc: { totalLikes: 1 } }
      )
    ]);
  }
}

export async function createUser({
  creatorKey,
  data
}: {
  creatorKey: string;
  data: Partial<NewUser>;
}): Promise<PublicUser> {
  if (!isPlainObject(data)) {
    throw new ValidationError('only JSON content is allowed');
  } else if (
    typeof data.name != 'string' ||
    data.name.length < 3 ||
    data.name.length > 30 ||
    !nameRegex.test(data.name)
  ) {
    throw new ValidationError(
      '`name` must be an alphanumeric string between 3 and 30 characters'
    );
  } else if (
    typeof data.email != 'string' ||
    data.email.length < 5 ||
    data.email.length > 50 ||
    !emailRegex.test(data.email)
  ) {
    throw new ValidationError(
      '`email` must be a valid email address between 5 and 50 characters'
    );
  } else if (
    data.phone !== null &&
    (typeof data.phone != 'string' || !phoneRegex.test(data.phone))
  ) {
    throw new ValidationError('`phone` must be a valid phone number');
  } else if (typeof data.username != 'string' || !usernameRegex.test(data.username)) {
    throw new ValidationError(
      '`username` must be an alphanumeric string between 5 and 20 characters'
    );
  }

  const { email, name, phone, username, ...rest } = data;

  if (Object.keys(rest).length > 0) {
    throw new ValidationError('unexpected properties encountered');
  }

  const db = await getDb();
  const users = await db.collection<InternalUser>('users');

  if (await itemExists(users, username, 'username')) {
    throw new ValidationError('a user with that username already exists');
  } else if (await itemExists(users, email, 'email')) {
    throw new ValidationError('a user with that email address already exists');
  } else if (phone && (await itemExists(users, phone, 'phone'))) {
    throw new ValidationError('a user with that phone number already exists');
  }

  // * At this point, we can finally trust this data is not malicious
  const newUser: InternalUser = {
    name,
    email,
    phone,
    username,
    packmates: [],
    following: [],
    bookmarked: [],
    liked: [],
    deleted: false,
    meta: {
      creator: creatorKey,
      followability: 1 / randomInt(100),
      influence: 1 / randomInt(100)
    }
  };

  await users.insertOne(newUser);
  await db.collection<InternalInfo>('info').updateOne({}, { $inc: { totalUsers: 1 } });

  return getUser({ user_id: (newUser as WithId<InternalUser>)._id });
}

// TODO: factor out the validation code for both user creation and update (DRY)
export async function updateUser({
  user_id,
  data
}: {
  user_id: UserId;
  data: Partial<PatchUser>;
}): Promise<void> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (!isPlainObject(data)) {
    throw new ValidationError('only JSON content is allowed');
  } else if (
    typeof data.name != 'string' ||
    data.name.length < 3 ||
    data.name.length > 30 ||
    !nameRegex.test(data.name)
  ) {
    throw new ValidationError(
      '`name` must be an alphanumeric string between 3 and 30 characters'
    );
  } else if (
    typeof data.email != 'string' ||
    data.email.length < 5 ||
    data.email.length > 50 ||
    !emailRegex.test(data.email)
  ) {
    throw new ValidationError(
      '`email` must be a valid email address between 5 and 50 characters'
    );
  } else if (
    data.phone !== null &&
    (typeof data.phone != 'string' || !phoneRegex.test(data.phone))
  ) {
    throw new ValidationError('`phone` must be a valid phone number');
  }

  const { email, name, phone, ...rest } = data;

  if (Object.keys(rest).length > 0)
    throw new ValidationError('unexpected properties encountered');

  const db = await getDb();
  const users = db.collection<InternalUser>('users');

  if (await itemExists(users, email, 'email')) {
    throw new ValidationError('a user with that email address already exists');
  } else if (phone && (await itemExists(users, phone, 'phone'))) {
    throw new ValidationError('a user with that phone number already exists');
  }

  // * At this point, we can finally trust this data is not malicious
  const patchUser: PatchUser = { name, email, phone };

  if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);
  await users.updateOne({ _id: user_id }, { $set: patchUser });
}

export async function deleteUser({ user_id }: { user_id: UserId }): Promise<void> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError();
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    const numUpdated = await users
      .updateOne({ _id: user_id, deleted: false }, { $set: { deleted: true } })
      .then((r) => r.matchedCount);

    await db
      .collection<InternalInfo>('info')
      .updateOne({}, { $inc: { totalUsers: -numUpdated } });
  }
}

export async function getAllUsers({
  after
}: {
  after: UserId | null;
}): Promise<PublicUser[]> {
  if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (after && !(await itemExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    return users
      .find(after ? { _id: { $lt: after } } : {})
      .sort({ _id: -1 })
      .limit(getEnv().RESULTS_PER_PAGE)
      .project<PublicUser>(publicUserProjection)
      .toArray();
  }
}

export async function getUser({
  user_id,
  username
}: {
  user_id?: UserId;
  username?: string;
}): Promise<PublicUser> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    return (
      (await users
        .find({ _id: user_id })
        .project<PublicUser>(publicUserProjection)
        .next()) ?? toss(new ItemNotFoundError(user_id))
    );
  }
}

export async function getUserFriendsUserIds({
  user_id,
  after
}: {
  user_id: UserId;
  after: UserId | null;
}): Promise<string[]> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, user_id))) {
      throw new ItemNotFoundError(user_id);
    } else if (after && !(await itemExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    const result = await users
      .find({ _id: user_id })
      .project<{ friends: UserId[] }>({
        friends: {
          $slice: [
            '$friends',
            after ? { $sum: [{ $indexOfArray: ['$friends', after] }, 1] } : 0,
            getEnv().RESULTS_PER_PAGE
          ]
        }
      })
      .next()
      .then((r) => itemToStringId(r?.friends));

    return result ?? toss(new GuruMeditationError());
  }
}

export async function isUserAFriend({
  user_id,
  friend_id
}: {
  user_id: UserId;
  friend_id: UserId;
}): Promise<boolean> {
  if (!(friend_id instanceof ObjectId)) {
    throw new InvalidIdError(friend_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, friend_id))) throw new ItemNotFoundError(friend_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    return (
      (await users
        .find({ _id: user_id })
        .project<{ followed: boolean }>({
          followed: { $in: [friend_id, '$following'] }
        })
        .next()
        .then((r) => r?.followed)) ?? toss(new GuruMeditationError())
    );
  }
}

export async function removeUserAsFriend({
  user_id,
  friend_id
}: {
  user_id: UserId;
  friend_id: UserId;
}): Promise<void> {
  if (!(friend_id instanceof ObjectId)) {
    throw new InvalidIdError(friend_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, friend_id))) throw new ItemNotFoundError(friend_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne({ _id: user_id }, { $pull: { following: friend_id } });
  }
}

export async function addUserAsFriend({
  user_id,
  friend_id
}: {
  user_id: UserId;
  friend_id: UserId;
}): Promise<void> {
  if (!(followed_id instanceof ObjectId)) {
    throw new InvalidIdError(followed_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (user_id.equals(followed_id)) {
    throw new ValidationError('users cannot follow themselves');
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, followed_id))) throw new ItemNotFoundError(followed_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne(
      { _id: user_id, following: { $nin: [followed_id] } },
      { $push: { following: { $each: [followed_id], $position: 0 } } }
    );
  }
}

export async function getFriendRequestsOfType({
  user_id,
  request_type,
  after
}: {
  user_id: UserId;
  request_type: FriendRequestType;
  after: FriendRequestId | null;
}): Promise<string[]> {
  if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, user_id))) {
      throw new ItemNotFoundError(user_id);
    } else if (after && !(await itemExists(users, after))) {
      throw new ItemNotFoundError(after);
    }

    return (
      (await users
        .find({ _id: user_id })
        .project<{ requests: FriendRequestId[] }>({
          requests: {
            $slice: [
              '$requests',
              after ? { $sum: [{ $indexOfArray: ['$requests', after] }, 1] } : 0,
              getEnv().RESULTS_PER_PAGE
            ]
          }
        })
        .next()
        .then((r) => itemToStringId(r?.requests))) ?? toss(new GuruMeditationError())
    );
  }
}

export async function isFriendRequestOfType({
  user_id,
  request_type,
  target_id
}: {
  user_id: UserId;
  request_type: FriendRequestType;
  target_id: UserId;
}): Promise<boolean> {
  if (!(packmate_id instanceof ObjectId)) {
    throw new InvalidIdError(packmate_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, packmate_id))) throw new ItemNotFoundError(packmate_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    return (
      (await users
        .find({ _id: user_id })
        .project<{ packmate: boolean }>({
          packmate: { $in: [packmate_id, '$packmates'] }
        })
        .next()
        .then((r) => r?.packmate)) ?? toss(new GuruMeditationError())
    );
  }
}

export async function removeFriendRequest({
  user_id,
  request_type,
  target_id
}: {
  user_id: UserId;
  request_type: FriendRequestType;
  target_id: UserId;
}): Promise<void> {
  if (!(packmate_id instanceof ObjectId)) {
    throw new InvalidIdError(packmate_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, packmate_id))) throw new ItemNotFoundError(packmate_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne({ _id: user_id }, { $pull: { packmates: packmate_id } });
  }
}

export async function addFriendRequest({
  user_id,
  request_type,
  target_id
}: {
  user_id: UserId;
  request_type: FriendRequestType;
  target_id: UserId;
}): Promise<void> {
  if (!(packmate_id instanceof ObjectId)) {
    throw new InvalidIdError(packmate_id);
  } else if (!(user_id instanceof ObjectId)) {
    throw new InvalidIdError(user_id);
  } else if (user_id.equals(packmate_id)) {
    throw new ValidationError('users cannot add themselves to their own pack');
  } else {
    const db = await getDb();
    const users = db.collection<InternalUser>('users');

    if (!(await itemExists(users, packmate_id))) throw new ItemNotFoundError(packmate_id);
    if (!(await itemExists(users, user_id))) throw new ItemNotFoundError(user_id);

    await users.updateOne(
      { _id: user_id, packmates: { $nin: [packmate_id] } },
      { $push: { packmates: { $each: [packmate_id], $position: 0 } } }
    );
  }
}

export async function searchMemes({
  after,
  match,
  regexMatch
}: {
  after: MemeId | null;
  match: {
    [specifier: string]:
      | string
      | number
      | boolean
      | {
          [subspecifier in '$gt' | '$lt' | '$gte' | '$lte']?: number;
        };
  };
  regexMatch: {
    [specifier: string]: string;
  };
}) {
  // ? Initial validation

  if (after !== null && !(after instanceof ObjectId)) {
    throw new InvalidIdError(after);
  } else if (!isPlainObject(match) || !isPlainObject(regexMatch)) {
    throw new ValidationError('match and regexMatch must be objects');
  } else if (match._id || match.meme_id || match.user_id) {
    throw new ValidationError('match object has illegal id-related specifier');
  } else if (regexMatch._id || regexMatch.meme_id || regexMatch.user_id) {
    throw new ValidationError('regexMatch object has illegal id-related specifier');
  }

  const matchIds: {
    owner?: UserId[];
    receiver?: UserId[];
    replyTo?: MemeId[];
  } = {};

  const split = (str: string) => str.toString().split('|');

  [regexMatch, match].forEach((matchSpec) => {
    // ? Transform all the "or" queries that might appear in the match objects

    if (matchSpec.owner) {
      matchIds.owner = itemToObjectId(split(matchSpec.owner.toString()));
      delete matchSpec.owner;
    }

    if (matchSpec.replyTo) {
      matchIds.replyTo = itemToObjectId(split(matchSpec.replyTo.toString()));
      delete matchSpec.replyTo;
    }

    if (matchSpec.rememeOf) {
      matchIds.rememeOf = itemToObjectId(split(matchSpec.rememeOf.toString()));
      delete matchSpec.rememeOf;
    }

    // ? Handle aliasing/proxying

    if (matchSpec.likes) {
      matchSpec.totalLikes = matchSpec.likes;
      delete matchSpec.likes;
    }

    if (matchSpec.rememes) {
      matchSpec.totalRememes = matchSpec.rememes;
      delete matchSpec.rememes;
    }

    if (matchSpec.memebacks) {
      matchSpec.totalMemebacks = matchSpec.memebacks;
      delete matchSpec.memebacks;
    }
  });

  // ? Next, we validate everything

  // * Validate id matchers

  if ((matchIds.owner?.length || 0) > getEnv().RESULTS_PER_PAGE) {
    throw new ValidationError(`match object validation failed on "owner": too many ids`);
  }

  if ((matchIds.replyTo?.length || 0) > getEnv().RESULTS_PER_PAGE) {
    throw new ValidationError(
      `match object validation failed on "replyTo": too many ids`
    );
  }

  if ((matchIds.rememeOf?.length || 0) > getEnv().RESULTS_PER_PAGE) {
    throw new ValidationError(
      `match object validation failed on "rememeOf": too many ids`
    );
  }

  // * Validate the match object
  for (const [key, val] of Object.entries(match)) {
    const err = (error?: string) => {
      throw new ValidationError(`match object validation failed on "${key}": ${error}`);
    };

    if (!matchableStrings.includes(key)) err('invalid specifier');
    if (Array.isArray(val)) err('invalid value type: cannot be array');

    if (isPlainObject(val)) {
      let valNotEmpty = false;

      for (const [subkey, subval] of Object.entries(val)) {
        valNotEmpty = true;
        if (!matchableSubStrings.includes(subkey)) err('invalid sub-specifier');
        if (typeof subval != 'number') err('invalid sub-value type');
      }

      if (!valNotEmpty) err('invalid value type: cannot be empty object');
    } else if (val !== null && !['number', 'string', 'boolean'].includes(typeof val)) {
      err('invalid value type; must be number, string, or boolean');
    }
  }

  // * Validate the regexMatch object
  for (const [key, val] of Object.entries(regexMatch)) {
    const err = (error?: string) => {
      throw new ValidationError(
        `regexMatch object validation failed on "${key}": ${error}`
      );
    };

    if (!matchableStrings.includes(key)) err('invalid specifier');
    if (!val || typeof val != 'string') {
      err('invalid value type; must be non-empty (regex) string');
    }
  }

  // ? Finally, we construct the pristine params objects and perform the search

  const finalRegexMatch = {} as Record<string, unknown>;

  Object.entries(regexMatch).forEach(([k, v]) => {
    finalRegexMatch[k] = { $regex: v, $options: 'i' };
  });

  const primaryMatchStage = {
    $match: {
      ...(after ? { _id: { $lt: after } } : {}),
      ...match,
      ...finalRegexMatch
    }
  };

  const aggregation = [
    ...(Object.keys(primaryMatchStage).length ? [primaryMatchStage] : []),
    ...Object.entries(matchIds).map(([k, v]) => ({ $match: { [k]: { $in: v } } })),
    { $sort: { _id: -1 } },
    { $limit: getEnv().RESULTS_PER_PAGE },
    { $project: publicMemeProjection }
  ];

  return (await getDb())
    .collection<InternalMeme>('memes')
    .aggregate<PublicMeme>(aggregation)
    .toArray();
}

export async function isKeyAuthentic(key: string) {
  if (!key || typeof key != 'string') throw new InvalidKeyError();

  return (await getDb())
    .collection<InternalApiKey>('keys')
    .findOne({ key })
    .then((r) => !!r);
}

export async function isRateLimited(req: NextApiRequest) {
  const ip = getClientIp(req);
  const key = req.headers?.key?.toString() || null;

  const limited = await (
    await getDb()
  )
    .collection<InternalLimitedLogEntry>('limited-log-mview')
    .find({
      $or: [...(ip ? [{ ip }] : []), ...(key ? [{ key }] : [])],
      until: { $gt: Date.now() } // ? Skip the recently unbanned
    })
    .sort({ until: -1 })
    .limit(1)
    .next();

  return {
    limited: !!limited,
    retryAfter: Math.max(0, (limited?.until || Date.now()) - Date.now())
  };
}

/**
 * Note that this is a per-serverless-function request counter and not global
 * across all Vercel virtual machines.
 */
export function isDueForContrivedError() {
  const reqPerErr = getEnv().REQUESTS_PER_CONTRIVED_ERROR;

  if (reqPerErr && ++requestCounter >= reqPerErr) {
    requestCounter = 0;
    return true;
  }

  return false;
}

/**
 * Note that this async function does not have to be awaited. It's fire and
 * forget!
 */
export async function addToRequestLog({ req, res }: NextApiState) {
  await (await getDb()).collection<InternalRequestLogEntry>('request-log').insertOne({
    ip: getClientIp(req),
    key: req.headers?.key?.toString() || null,
    method: req.method || null,
    route: req.url?.replace(/^\/api\//, '') || null,
    resStatusCode: res.statusCode,
    time: Date.now()
  });
}

export async function getApiKeys() {
  return (await getDb())
    .collection<InternalApiKey>('keys')
    .find()
    .sort({ _id: 1 })
    .project({
      _id: false
    })
    .toArray()
    .then((a) => a.map((apiKey) => ({ ...apiKey, key: sha256(apiKey.key).toString() })));
}
