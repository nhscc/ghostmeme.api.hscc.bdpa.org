/* eslint-disable no-await-in-loop */
import { WithId, ObjectId } from 'mongodb';
import { toss } from 'toss-expression';
import * as Backend from 'universe/backend';
import { getEnv } from 'universe/backend/env';
import { setupTestDb, dummyDbData } from 'testverse/db';
import { mockEnvFactory, toPublicUser, toPublicMeme } from 'testverse/setup';
import { itemToObjectId, itemToStringId } from 'universe/backend/db';
import { GuruMeditationError } from 'universe/backend/error';

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  InternalRequestLogEntry,
  InternalLimitedLogEntry,
  InternalInfo,
  InternalUser,
  InternalMeme,
  UserId,
  MemeId,
  NewMeme,
  NewUser,
  PatchMeme,
  PatchUser,
  InternalApiKey
} from 'types/global';

const { getDb } = setupTestDb();

const withMockedEnv = mockEnvFactory({}, { replace: false });

describe('::getSystemInfo', () => {
  it('returns summary system metadata', async () => {
    expect.hasAssertions();
    expect(await Backend.getSystemInfo()).toStrictEqual<InternalInfo>({
      totalMemes: dummyDbData.info.totalMemes,
      totalUsers: dummyDbData.info.totalUsers
    });
  });

  it('functions when the database is empty', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection('info')
      .updateOne({}, { $set: { totalMemes: 0, totalUsers: 0 } });

    expect(await Backend.getSystemInfo()).toStrictEqual<InternalInfo>({
      totalMemes: 0,
      totalUsers: 0
    });
  });
});

describe('::getMemes', () => {
  it('returns one or more memes by ID', async () => {
    expect.hasAssertions();

    const testMemes = [[], [dummyDbData.memes[0]], dummyDbData.memes.slice(10, 20)];

    await Promise.all(
      testMemes.map((memes) =>
        expect(
          Backend.getMemes({ meme_ids: memes.map((b) => b._id) })
        ).resolves.toIncludeSameMembers(memes.map(toPublicMeme))
      )
    );
  });

  it('rejects if meme_ids not found', async () => {
    expect.hasAssertions();

    await expect(Backend.getMemes({ meme_ids: [new ObjectId()] })).rejects.toMatchObject({
      message: expect.stringContaining('some or all')
    });
  });

  it('functions when database is empty', async () => {
    expect.hasAssertions();

    const db = await getDb();
    await db.collection('memes').deleteMany({});
    await db.collection('users').deleteMany({});

    await expect(
      Backend.getMemes({ meme_ids: [dummyDbData.memes[0]._id] })
    ).rejects.toMatchObject({
      message: expect.stringContaining('some or all')
    });
  });

  it('rejects if too many meme_ids requested', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        await expect(
          Backend.getMemes({ meme_ids: [new ObjectId(), new ObjectId()] })
        ).rejects.toMatchObject({
          message: expect.stringContaining('too many')
        });
      },
      { RESULTS_PER_PAGE: '1' }
    );
  });
});

describe('::updateMemes', () => {
  it('updates one or more memes', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const testIds = [[], [dummyDbData.memes[0]], dummyDbData.memes.slice(10, 20)].map(
      (memes) => memes.map((meme) => meme._id)
    );

    await db
      .collection('memes')
      .updateMany({ _id: { $in: testIds.flat() } }, { $set: { expiredAt: -10 } });

    await Promise.all(
      testIds.map((meme_ids) => Backend.updateMemes({ meme_ids, data: { expiredAt: 0 } }))
    );

    expect(
      await db
        .collection('memes')
        .find({ _id: { $in: testIds.flat() }, expiredAt: -10 })
        .count()
    ).toStrictEqual(0);
  });

  it('leaves summary system metadata unchanged', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const testIds = itemToObjectId(dummyDbData.memes.slice(0, 10));

    await Backend.updateMemes({ meme_ids: testIds, data: { expiredAt: -1 } });

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalMemes)
    ).toStrictEqual(dummyDbData.info.totalMemes);
  });

  it('does not reject if meme_ids not found', async () => {
    expect.hasAssertions();

    await expect(
      Backend.updateMemes({ meme_ids: [new ObjectId()], data: { expiredAt: -1 } })
    ).resolves.toBeUndefined();
  });

  it('rejects if too many meme_id requested', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        await expect(
          Backend.updateMemes({
            meme_ids: [new ObjectId(), new ObjectId()],
            data: { expiredAt: -1 }
          })
        ).rejects.toMatchObject({
          message: expect.stringContaining('too many')
        });
      },
      { RESULTS_PER_PAGE: '1' }
    );
  });
});

describe('::getMemeLikesUserIds', () => {
  it('returns user_ids that liked a meme', async () => {
    expect.hasAssertions();

    const memes = dummyDbData.memes.map<[ObjectId, UserId[]]>((b) => [b._id, b.likes]);

    for (const [meme_id, expectedIds] of memes) {
      expect(await Backend.getMemeLikesUserIds({ meme_id, after: null })).toStrictEqual(
        itemToStringId(expectedIds)
      );
    }
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    const meme_id = dummyDbData.memes[10]._id;

    await (await getDb())
      .collection<InternalMeme>('memes')
      .updateOne(
        { _id: meme_id },
        { $set: { likes: itemToObjectId(dummyDbData.users) } }
      );

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getMemeLikesUserIds({
            meme_id: dummyDbData.memes[10]._id,
            after: dummyDbData.users[2]._id
          })
        ).toStrictEqual(itemToStringId(dummyDbData.users.slice(3, 6)));
      },
      { RESULTS_PER_PAGE: '3' }
    );
  });

  it('rejects if meme_id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(
      Backend.getMemeLikesUserIds({ meme_id: id, after: null })
    ).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });
});

describe('::getUserLikedMemeIds', () => {
  it('returns meme_id of memes that a user liked', async () => {
    expect.hasAssertions();

    const users = dummyDbData.users.map<[ObjectId, MemeId[]]>((u) => [u._id, u.liked]);

    for (const [user_id, expectedIds] of users) {
      expect(await Backend.getUserLikedMemeIds({ user_id, after: null })).toStrictEqual(
        itemToStringId(expectedIds)
      );
    }
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getUserLikedMemeIds({
            user_id: dummyDbData.users[0]._id,
            after: dummyDbData.users[0].liked[3]
          })
        ).toStrictEqual(itemToStringId(dummyDbData.users[0].liked.slice(4, 7)));
      },
      { RESULTS_PER_PAGE: '3' }
    );
  });

  it('functions when user has no liked memes', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne({ _id: dummyDbData.users[0]._id }, { $set: { liked: [] } });

    expect(
      await Backend.getUserLikedMemeIds({
        user_id: dummyDbData.users[0]._id,
        after: null
      })
    ).toStrictEqual([]);
  });

  it('rejects if user_id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(
      Backend.getUserLikedMemeIds({ user_id: id, after: null })
    ).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });
});

describe('::isMemeLiked', () => {
  it('returns true iff the meme is liked by the specified user', async () => {
    expect.hasAssertions();

    const items: [UserId, MemeId, boolean][] = [
      [dummyDbData.users[0]._id, dummyDbData.memes[0]._id, false],
      [dummyDbData.users[0]._id, new ObjectId(dummyDbData.users[0].liked[0]), true]
    ];

    await Promise.all(
      items.map(([user_id, meme_id, expectedTruth]) =>
        expect(Backend.isMemeLiked({ user_id, meme_id })).resolves.toStrictEqual(
          expectedTruth
        )
      )
    );
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, MemeId, number][] = [
      [new ObjectId(), dummyDbData.memes[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, meme_id, ndx]) =>
        expect(Backend.isMemeLiked({ user_id, meme_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : meme_id))
        })
      )
    );
  });
});

describe('::removeLikedMeme', () => {
  it('unlikes a meme and updates meme and user metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const memes = await db.collection<InternalMeme>('memes');
    const users = await db.collection<InternalUser>('users');
    const testMemes = itemToObjectId(dummyDbData.users[0].liked);

    expect(
      await users.findOne({ _id: dummyDbData.users[0]._id }).then((r) => r?.liked)
    ).not.toStrictEqual([]);

    expect(
      await memes
        .find({ _id: { $in: testMemes }, likes: dummyDbData.users[0]._id })
        .count()
    ).not.toStrictEqual(0);

    const totalLikes =
      (await memes
        .find({ _id: testMemes[0] })
        .project<{ totalLikes: number }>({ totalLikes: true })
        .next()
        .then((r) => r?.totalLikes)) ?? toss(new GuruMeditationError());

    await Promise.all(
      testMemes.map((id) =>
        Backend.removeLikedMeme({ user_id: dummyDbData.users[0]._id, meme_id: id })
      )
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[0]._id }).then((r) => r?.liked)
    ).toStrictEqual([]);

    expect(
      await memes
        .find({ _id: { $in: testMemes }, likes: dummyDbData.users[0]._id })
        .count()
    ).toStrictEqual(0);

    expect(
      await memes
        .find({ _id: testMemes[0] })
        .project({ _id: false, totalLikes: true })
        .next()
    ).toStrictEqual({ totalLikes: totalLikes - 1 });
  });

  it('does not error if the user never liked the meme', async () => {
    expect.hasAssertions();

    await expect(
      Backend.removeLikedMeme({
        user_id: dummyDbData.users[0]._id,
        meme_id: dummyDbData.memes[0]._id
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, MemeId, number][] = [
      [new ObjectId(), dummyDbData.memes[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, meme_id, ndx]) =>
        expect(Backend.removeLikedMeme({ user_id, meme_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : meme_id))
        })
      )
    );
  });
});

describe('::addLikedMeme', () => {
  it('likes a meme and updates meme and user metadata properly', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const memes = await db.collection<WithId<InternalMeme>>('memes');
    const users = await db.collection<InternalUser>('users');
    const originallyLikedMemes = itemToObjectId(dummyDbData.users[0].liked);
    const newlyLikedMemes = dummyDbData.memes
      .filter(
        (meme) => !itemToStringId(originallyLikedMemes).includes(itemToStringId(meme))
      )
      .map<ObjectId>(itemToObjectId);

    expect(
      await users
        .findOne({ _id: dummyDbData.users[0]._id })
        .then((r) => itemToObjectId(r?.liked))
    ).toIncludeSameMembers(originallyLikedMemes);

    expect(
      await memes
        .find({ _id: { $in: newlyLikedMemes }, likes: dummyDbData.users[0]._id })
        .toArray()
    ).toIncludeSameMembers([]);

    const totalLikes =
      (await memes
        .find({ _id: newlyLikedMemes[0] })
        .project<{ totalLikes: number }>({ totalLikes: true })
        .next()
        .then((r) => r?.totalLikes)) ?? toss(new GuruMeditationError());

    await Promise.all(
      newlyLikedMemes.map((id) =>
        Backend.addLikedMeme({ user_id: dummyDbData.users[0]._id, meme_id: id })
      )
    );

    expect(
      await users
        .findOne({ _id: dummyDbData.users[0]._id })
        .then((r) => itemToObjectId(r?.liked))
    ).toIncludeSameMembers([...originallyLikedMemes, ...newlyLikedMemes]);

    expect(
      await memes
        .find({ _id: { $in: newlyLikedMemes }, likes: dummyDbData.users[0]._id })
        .toArray()
        .then((b) => itemToObjectId(b))
    ).toIncludeSameMembers(newlyLikedMemes);

    expect(
      await memes
        .find({ _id: newlyLikedMemes[0] })
        .project({ _id: false, totalLikes: true })
        .next()
    ).toStrictEqual({ totalLikes: totalLikes + 1 });
  });

  it('does not error if the user already liked the meme', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addLikedMeme({
        user_id: dummyDbData.users[0]._id,
        meme_id: dummyDbData.users[0].liked[0]
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, MemeId, number][] = [
      [new ObjectId(), dummyDbData.memes[1]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, meme_id, ndx]) =>
        expect(Backend.addLikedMeme({ user_id, meme_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : meme_id))
        })
      )
    );
  });
});

describe('::createMeme', () => {
  it('creates and returns a new meme', async () => {
    expect.hasAssertions();

    const items: NewMeme[] = [
      {
        owner: dummyDbData.users[0]._id,
        content: '1',
        private: false,
        memebackTo: null,
        rememeOf: null
      },
      {
        owner: dummyDbData.users[0]._id,
        content: '3',
        private: false,
        memebackTo: dummyDbData.memes[0]._id,
        rememeOf: null
      },
      {
        owner: dummyDbData.users[0]._id,
        content: '4',
        private: false,
        memebackTo: null,
        rememeOf: dummyDbData.memes[0]._id
      },
      {
        owner: dummyDbData.users[0]._id,
        content: '5',
        private: true,
        memebackTo: null,
        rememeOf: null
      },
      {
        owner: dummyDbData.users[0]._id,
        content: Array.from({ length: 280 })
          .map(() => '6')
          .join(''),
        private: true,
        memebackTo: null,
        rememeOf: null
      }
    ];

    const newMemes = await Promise.all(
      items.map((data) => Backend.createMeme({ key: Backend.DUMMY_KEY, data }))
    );

    const expectedInternalMemes = items.map<InternalMeme>((item) => ({
      ...item,
      _id: expect.any(ObjectId),
      totalMemebacks: 0,
      totalRememes: 0,
      totalLikes: 0,
      createdAt: expect.any(Number),
      deleted: false,
      likes: [],
      meta: expect.objectContaining({
        creator: Backend.DUMMY_KEY,
        likeability: expect.any(Number),
        rememeability: expect.any(Number),
        memebackability: expect.any(Number)
      })
    }));

    expect(newMemes).toIncludeSameMembers(
      items.map((item) => expect.objectContaining(item))
    );

    expect(
      await (
        await getDb()
      )
        .collection<InternalMeme>('memes')
        .find({ _id: { $in: newMemes.map((b) => new ObjectId(b.meme_id)) } })
        .toArray()
    ).toIncludeSameMembers(expectedInternalMemes);
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();

    const items: [NewMeme, string][] = [
      [undefined as unknown as NewMeme, 'only JSON'],
      ['string data' as unknown as NewMeme, 'only JSON'],
      [{} as unknown as NewMeme, 'non-zero length string'],
      [{ data: 1 } as unknown as NewMeme, 'non-zero length string'],
      [
        { content: '', createdAt: Date.now() } as unknown as NewMeme,
        'non-zero length string'
      ],
      [
        {
          owner: '',
          content: '',
          private: false
        } as unknown as NewMeme,
        'non-zero length string'
      ],
      [
        {
          owner: 'fds',
          content: 'fds',
          private: false,
          memebackTo: null,
          rememeOf: null
        } as unknown as NewMeme,
        'invalid'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: '',
          private: false,
          memebackTo: null,
          rememeOf: null
        } as unknown as NewMeme,
        'non-zero length string'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: '',
          private: false,
          memebackTo: null,
          rememeOf: null
        } as unknown as NewMeme,
        'non-zero length string'
      ],
      [
        {
          owner: new ObjectId(),
          content: 'abc',
          private: false,
          memebackTo: null,
          rememeOf: null
        } as unknown as NewMeme,
        'not found'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: '123',
          private: false,
          memebackTo: new ObjectId(),
          rememeOf: null
        } as unknown as NewMeme,
        'not found'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: 'xyz',
          private: false,
          memebackTo: null,
          rememeOf: new ObjectId()
        } as unknown as NewMeme,
        'not found'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: 'def',
          private: false,
          memebackTo: dummyDbData.memes[0]._id,
          rememeOf: dummyDbData.memes[1]._id
        } as unknown as NewMeme,
        'memes must be'
      ],
      [
        {
          owner: dummyDbData.users[0]._id,
          content: Array.from({ length: 281 })
            .map(() => 'x')
            .join(''),
          private: false,
          memebackTo: null,
          rememeOf: null
        } as unknown as NewMeme,
        '<= 280'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.createMeme({ key: Backend.DUMMY_KEY, data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('updates user and summary system metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const meme_id = await Backend.createMeme({
      key: Backend.DUMMY_KEY,
      data: {
        owner: dummyDbData.users[0]._id,
        content: '1',
        private: false,
        memebackTo: null,
        rememeOf: null
      }
    }).then((b) => new ObjectId(b.meme_id));

    expect(
      await db
        .collection<InternalMeme>('memes')
        .findOne({ _id: meme_id })
        .then((r) => [r?.totalMemebacks, r?.totalRememes])
    ).toStrictEqual([0, 0]);

    await Backend.createMeme({
      key: Backend.DUMMY_KEY,
      data: {
        owner: dummyDbData.users[0]._id,
        content: '2',
        private: false,
        memebackTo: meme_id,
        rememeOf: null
      }
    });

    await Backend.createMeme({
      key: Backend.DUMMY_KEY,
      data: {
        owner: dummyDbData.users[0]._id,
        content: '2',
        private: false,
        memebackTo: null,
        rememeOf: meme_id
      }
    });

    expect(
      await db
        .collection<InternalMeme>('memes')
        .findOne({ _id: meme_id })
        .then((r) => [r?.totalMemebacks, r?.totalRememes])
    ).toStrictEqual([1, 1]);

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalMemes)
    ).toStrictEqual(dummyDbData.info.totalMemes + 3);
  });
});

describe('::getAllUsers', () => {
  const reversedUsers = dummyDbData.users.reverse();

  it('returns all users', async () => {
    expect.hasAssertions();

    expect(await Backend.getAllUsers({ after: null })).toStrictEqual(
      reversedUsers.map(toPublicUser)
    );
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getAllUsers({
            after: reversedUsers[1]._id
          }).then((users) => users)
        ).toStrictEqual(reversedUsers.slice(2, 5).map(toPublicUser));
      },
      { RESULTS_PER_PAGE: '3' }
    );
  });

  it('functions when database is empty', async () => {
    expect.hasAssertions();

    const db = await getDb();
    await db.collection('memes').deleteMany({});
    await db.collection('users').deleteMany({});

    expect(await Backend.getAllUsers({ after: null })).toStrictEqual([]);
  });
});

describe('::getUser', () => {
  it('returns user', async () => {
    expect.hasAssertions();

    expect(await Backend.getUser({ user_id: dummyDbData.users[0]._id })).toStrictEqual(
      toPublicUser(dummyDbData.users[0])
    );
  });

  it('rejects if id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(Backend.getUser({ user_id: id })).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });
});

describe('::deleteUser', () => {
  it('deletes a user', async () => {
    expect.hasAssertions();

    const users = (await getDb()).collection('users');
    const user_id = dummyDbData.users[1]._id;

    await users.updateOne({ _id: user_id }, { $set: { deleted: false } });
    await Backend.deleteUser({ user_id });

    expect(await users.find({ _id: user_id, deleted: false }).count()).toStrictEqual(0);
  });

  it('updates summary system metadata', async () => {
    expect.hasAssertions();

    await Backend.deleteUser({ user_id: dummyDbData.users[1]._id });

    expect(
      await (
        await getDb()
      )
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalUsers)
    ).toStrictEqual(dummyDbData.info.totalUsers - 1);
  });

  it('rejects if id not found', async () => {
    expect.hasAssertions();

    const user_id = new ObjectId();

    await expect(Backend.deleteUser({ user_id })).rejects.toMatchObject({
      message: expect.stringContaining(user_id.toString())
    });
  });
});

describe('::getUserFriendsUserIds', () => {
  it('returns users that a user is (directly) following', async () => {
    expect.hasAssertions();

    const users = dummyDbData.users.map<[ObjectId, UserId[]]>((u) => [
      u._id,
      u.following
    ]);

    for (const [user_id, expectedIds] of users) {
      expect(
        await Backend.getUserFriendsUserIds({
          user_id,
          after: null,
          includeIndirect: false
        })
      ).toStrictEqual(itemToStringId(expectedIds));
    }
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    const extraUsers = dummyDbData.users.slice(2, 7);

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne(
        { _id: dummyDbData.users[9]._id },
        { $push: { following: { $each: itemToObjectId(extraUsers) } } }
      );

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getUserFriendsUserIds({
            user_id: dummyDbData.users[9]._id,
            after: dummyDbData.users[9].following[0],
            includeIndirect: false
          })
        ).toStrictEqual(
          [
            itemToStringId(dummyDbData.users[9].following.slice(1)),
            itemToStringId(extraUsers)
          ]
            .flat()
            .slice(0, 4)
        );
      },
      { RESULTS_PER_PAGE: '4' }
    );
  });

  it('functions when user is not following anyone', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne({ _id: dummyDbData.users[9]._id }, { $set: { following: [] } });

    expect(
      await Backend.getUserFriendsUserIds({
        user_id: dummyDbData.users[9]._id,
        after: null,
        includeIndirect: false
      })
    ).toStrictEqual([]);
  });

  it('?includeIndirect returns direct and indirect followed users_ids', async () => {
    expect.hasAssertions();

    const users = await Promise.all(
      dummyDbData.users.map(
        async (u) => [u._id, await getAllFollowers(u._id)] as [ObjectId, UserId[]]
      )
    );

    for (const [user_id, expectedIds] of users) {
      expect(
        await Backend.getUserFriendsUserIds({
          user_id,
          after: null,
          includeIndirect: true
        })
      ).toStrictEqual(itemToStringId(expectedIds));
    }
  });

  it('supports pagination with ?includeIndirect', async () => {
    expect.hasAssertions();

    const target = dummyDbData.users[9]._id;
    const expectedIds = await getAllFollowers(target);

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getUserFriendsUserIds({
            user_id: target,
            after: null,
            includeIndirect: true
          })
        ).toStrictEqual(itemToStringId([expectedIds[0]]));

        expect(
          await Backend.getUserFriendsUserIds({
            user_id: target,
            after: expectedIds[0],
            includeIndirect: true
          })
        ).toStrictEqual(itemToStringId([expectedIds[1]]));

        expect(
          await Backend.getUserFriendsUserIds({
            user_id: target,
            after: expectedIds[1],
            includeIndirect: true
          })
        ).toStrictEqual(itemToStringId([expectedIds[2]]));
      },
      { RESULTS_PER_PAGE: '1' }
    );
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, after, ndx]) =>
        expect(
          Backend.getUserFriendsUserIds({ user_id, after, includeIndirect: false })
        ).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
        })
      )
    );
  });
});

describe('::isUserAFriend', () => {
  it('returns true iff the specified user is following the other', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, boolean][] = [
      [dummyDbData.users[0]._id, dummyDbData.users[0]._id, false],
      [dummyDbData.users[0]._id, new ObjectId(dummyDbData.users[0].following[0]), true]
    ];

    await Promise.all(
      items.map(([user_id, followed_id, expectedTruth]) =>
        expect(Backend.isUserFollowing({ user_id, followed_id })).resolves.toStrictEqual(
          expectedTruth
        )
      )
    );
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, followed_id, ndx]) =>
        expect(Backend.isUserFollowing({ user_id, followed_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : followed_id)
          )
        })
      )
    );
  });
});

describe('::addUserAsFriend', () => {
  it('assigns the specified user as a follower of another', async () => {
    expect.hasAssertions();

    const users = await (await getDb()).collection<InternalUser>('users');
    const followed_id = itemToObjectId(dummyDbData.users[5]);

    expect(
      await users
        .findOne({ _id: dummyDbData.users[0]._id })
        .then((r) => itemToStringId(r?.following))
    ).not.toStrictEqual(expect.arrayContaining([followed_id.toString()]));

    await Backend.addFriendRequest({ user_id: dummyDbData.users[0]._id, followed_id });

    expect(
      await users
        .findOne({ _id: dummyDbData.users[0]._id })
        .then((r) => itemToStringId(r?.following))
    ).toStrictEqual(expect.arrayContaining([followed_id.toString()]));
  });

  it('does not error if the user is already a follower', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addFriendRequest({
        user_id: dummyDbData.users[0]._id,
        followed_id: dummyDbData.users[0].following[0]
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, followed_id, ndx]) =>
        expect(Backend.addFriendRequest({ user_id, followed_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : followed_id)
          )
        })
      )
    );
  });

  it('user cannot follow themselves', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addFriendRequest({
        user_id: dummyDbData.users[0]._id,
        followed_id: dummyDbData.users[0]._id
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining('cannot follow themselves')
    });
  });
});

describe('::removeUserAsFriend', () => {
  it('removes the specified user as a follower of another', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const users = await db.collection<InternalUser>('users');
    const testUsers = itemToObjectId(dummyDbData.users[9].following);

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.following)
    ).not.toStrictEqual([]);

    await Promise.all(
      testUsers.map((followed_id) =>
        Backend.unfollowUser({ user_id: dummyDbData.users[9]._id, followed_id })
      )
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.following)
    ).toStrictEqual([]);
  });

  it('does not error if the user was never a follower', async () => {
    expect.hasAssertions();

    await expect(
      Backend.unfollowUser({
        user_id: dummyDbData.users[0]._id,
        followed_id: dummyDbData.users[5]._id
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, followed_id, ndx]) =>
        expect(Backend.unfollowUser({ user_id, followed_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : followed_id)
          )
        })
      )
    );
  });
});

describe('::getFriendRequestsOfType', () => {
  it('returns packmates', async () => {
    expect.hasAssertions();

    const users = dummyDbData.users.map<[ObjectId, UserId[]]>((u) => [
      u._id,
      u.packmates
    ]);

    for (const [user_id, expectedIds] of users) {
      expect(
        await Backend.getRequestsOfType({
          user_id,
          after: null
        })
      ).toStrictEqual(itemToStringId(expectedIds));
    }
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    const extraUsers = dummyDbData.users.slice(2, 5);

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne(
        { _id: dummyDbData.users[9]._id },
        { $push: { packmates: { $each: itemToObjectId(extraUsers) } } }
      );

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getRequestsOfType({
            user_id: dummyDbData.users[9]._id,
            after: dummyDbData.users[9].packmates[0]
          })
        ).toStrictEqual(itemToStringId(extraUsers.slice(0, 2)));
      },
      { RESULTS_PER_PAGE: '2' }
    );
  });

  it('functions when user has no packmates', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne({ _id: dummyDbData.users[9]._id }, { $set: { packmates: [] } });

    expect(
      await Backend.getRequestsOfType({
        user_id: dummyDbData.users[9]._id,
        after: null
      })
    ).toStrictEqual([]);
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, after, ndx]) =>
        expect(Backend.getRequestsOfType({ user_id, after })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
        })
      )
    );
  });
});

describe('::isFriendRequestOfType', () => {
  it('returns true iff a user is in the pack', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, boolean][] = [
      [dummyDbData.users[0]._id, dummyDbData.users[0]._id, false],
      [dummyDbData.users[0]._id, new ObjectId(dummyDbData.users[0].packmates[0]), true]
    ];

    await Promise.all(
      items.map(([user_id, packmate_id, expectedTruth]) =>
        expect(Backend.isUserAFriend({ user_id, packmate_id })).resolves.toStrictEqual(
          expectedTruth
        )
      )
    );
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, packmate_id, ndx]) =>
        expect(Backend.isUserAFriend({ user_id, packmate_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : packmate_id)
          )
        })
      )
    );
  });
});

describe('::addFriendRequest', () => {
  it('adds a user to the pack', async () => {
    expect.hasAssertions();

    const users = await (await getDb()).collection<InternalUser>('users');
    const target = dummyDbData.users[0];
    const originalPackmates = itemToObjectId(target.packmates);
    const newPackmates = dummyDbData.users
      .filter(
        (user) =>
          !user._id.equals(target._id) &&
          !itemToStringId(originalPackmates).includes(itemToStringId(user))
      )
      .map<ObjectId>(itemToObjectId);

    expect(
      await users.findOne({ _id: target._id }).then((r) => itemToObjectId(r?.packmates))
    ).toIncludeSameMembers(originalPackmates);

    await Promise.all(
      newPackmates.map((packmate_id) =>
        Backend.addFriend({ user_id: target._id, packmate_id })
      )
    );

    expect(
      await users.findOne({ _id: target._id }).then((r) => itemToObjectId(r?.packmates))
    ).toIncludeSameMembers([...originalPackmates, ...newPackmates]);
  });

  it('does not error if the user is already a packmate', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addFriend({
        user_id: dummyDbData.users[0]._id,
        packmate_id: dummyDbData.users[0].packmates[0]
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, packmate_id, ndx]) =>
        expect(Backend.addFriend({ user_id, packmate_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : packmate_id)
          )
        })
      )
    );
  });

  it('user cannot add themselves to their own pack', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addFriend({
        user_id: dummyDbData.users[0]._id,
        packmate_id: dummyDbData.users[0]._id
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining('cannot add themselves to')
    });
  });
});

describe('::removeFriendRequest', () => {
  it('removes a user from the pack', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const users = await db.collection<InternalUser>('users');
    const testUsers = itemToObjectId(dummyDbData.users[9].packmates);

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.packmates)
    ).not.toStrictEqual([]);

    await Promise.all(
      testUsers.map((packmate_id) =>
        Backend.removePackmate({ user_id: dummyDbData.users[9]._id, packmate_id })
      )
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.packmates)
    ).toStrictEqual([]);
  });

  it('does not error if the user was never in the pack', async () => {
    expect.hasAssertions();

    await expect(
      Backend.removePackmate({
        user_id: dummyDbData.users[0]._id,
        packmate_id: dummyDbData.users[0]._id
      })
    ).toResolve();
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, packmate_id, ndx]) =>
        expect(Backend.removePackmate({ user_id, packmate_id })).rejects.toMatchObject({
          message: expect.stringContaining(
            itemToStringId(ndx == 0 ? user_id : packmate_id)
          )
        })
      )
    );
  });
});

describe('::createUser', () => {
  it('creates and returns a new user', async () => {
    expect.hasAssertions();

    const items: NewUser[] = [
      {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        username: 'uzr-1'
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null,
        username: 'uzr-2-12345678901234'
      },
      {
        name: 'three name',
        email: '3-three@email.address',
        phone: '333.333.3333 x5467',
        username: 'user_3'
      }
    ];

    const newUsers = await Promise.all(
      items.map((data) => Backend.createUser({ key: Backend.DUMMY_KEY, data }))
    );

    const expectedInternalUsers = items.map<InternalUser>((item) => ({
      ...item,
      _id: expect.any(ObjectId),
      deleted: false,
      bookmarked: [],
      following: [],
      packmates: [],
      liked: [],
      meta: expect.objectContaining({
        creator: Backend.DUMMY_KEY,
        followability: expect.any(Number),
        influence: expect.any(Number)
      })
    }));

    expect(newUsers).toIncludeSameMembers(
      items.map((item) => expect.objectContaining(item))
    );

    expect(
      await (
        await getDb()
      )
        .collection<InternalUser>('users')
        .find({ _id: { $in: newUsers.map((b) => new ObjectId(b.user_id)) } })
        .toArray()
    ).toIncludeSameMembers(expectedInternalUsers);
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();

    const items: [NewUser, string][] = [
      [undefined as unknown as NewUser, 'only JSON'],
      ['string data' as unknown as NewUser, 'only JSON'],
      [{} as unknown as NewUser, '3 and 30'],
      [{ data: 1 } as unknown as NewUser, '3 and 30'],
      [{ name: null } as unknown as NewUser, '3 and 30'],
      [{ name: 'my supercool name' } as unknown as NewUser, '5 and 50'],
      [
        {
          name: '#&*@^(#@(^$&*#',
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '3 and 30'
      ],
      [
        {
          name: 'tr',
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '3 and 30'
      ],
      [
        {
          name: Array.from({ length: 31 })
            .map(() => 'x')
            .join(''),
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '3 and 30'
      ],
      [
        {
          name: 'tre giles',
          email: '',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: null,
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'invalid@email address',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'bad-email-address.here',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'validemailaddressbutitisway2big@who.woulddothis.com',
          phone: '',
          username: ''
        } as unknown as NewUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-$*#-&$^#',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-773-773',
          username: ''
        } as unknown as NewUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: ''
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: 'fjdk'
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: false
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: Array.from({ length: 21 })
            .map(() => 'x')
            .join('')
        } as unknown as NewUser,
        '5 and 20'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: 'xunnamius',
          admin: true
        } as unknown as NewUser,
        'unexpected properties'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.createUser({ key: Backend.DUMMY_KEY, data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('updates summary system metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();

    await Backend.createUser({
      key: Backend.DUMMY_KEY,
      data: {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        username: 'uzr-1'
      }
    });

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalUsers)
    ).toStrictEqual(dummyDbData.info.totalUsers + 1);
  });
});

describe('::updateUser', () => {
  it('updates an existing user in the database', async () => {
    expect.hasAssertions();

    const items: PatchUser[] = [
      {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111'
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null
      },
      {
        name: 'three name',
        email: '3-three@email.address',
        phone: '333.333.3333 x5467'
      }
    ];

    await Promise.all(
      items.map((data, ndx) =>
        Backend.updateUser({ user_id: dummyDbData.users[ndx]._id, data })
      )
    );

    const users = (await getDb()).collection<InternalUser>('users');
    const patchedUserIds = itemToObjectId(dummyDbData.users.slice(0, items.length));

    expect(
      await users.find({ _id: { $in: patchedUserIds } }).toArray()
    ).toIncludeSameMembers(items.map((item) => expect.objectContaining(item)));
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();

    const items: [PatchUser, string][] = [
      [undefined as unknown as PatchUser, 'only JSON'],
      ['string data' as unknown as PatchUser, 'only JSON'],
      [{} as unknown as PatchUser, '3 and 30'],
      [{ data: 1 } as unknown as PatchUser, '3 and 30'],
      [{ name: null } as unknown as PatchUser, '3 and 30'],
      [{ name: 'my supercool name' } as unknown as PatchUser, '5 and 50'],
      [
        {
          name: '#&*@^(#@(^$&*#',
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: 'tr',
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: Array.from({ length: 31 })
            .map(() => 'x')
            .join(''),
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: 'tre giles',
          email: '',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: null,
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'invalid@email address',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'bad-email-address.here',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'validemailaddressbutitisway2big@who.woulddothis.com',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-$*#-&$^#',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-773-773',
          username: ''
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: 'xunnamius'
        } as unknown as PatchUser,
        'unexpected properties'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.updateUser({ user_id: new ObjectId(), data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('rejects if user_id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(
      Backend.updateUser({
        user_id: id,
        data: {
          name: 'one name',
          email: '1-one@email.address',
          phone: '111-111-1111'
        }
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });
});

describe('::searchMemes', () => {
  const reversedMemes = dummyDbData.memes.reverse();

  it('returns all memes if no query params given', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        expect(
          await Backend.searchMemes({ after: null, match: {}, regexMatch: {} })
        ).toStrictEqual(reversedMemes.slice(0, 5).map(toPublicMeme));
      },
      { RESULTS_PER_PAGE: '5' }
    );
  });

  it('searches with respect to match and regexMatch, handles proxying and special ID regexMatches', async () => {
    expect.hasAssertions();

    const matchItems = [
      [
        { likes: { $gt: 20 } },
        itemToStringId(dummyDbData.memes.filter((b) => b.totalLikes > 20))
      ],
      [
        { rememes: { $lte: 50 } },
        itemToStringId(dummyDbData.memes.filter((b) => b.totalRememes <= 50))
      ],
      [
        { memebacks: dummyDbData.memes[0].totalMemebacks },
        itemToStringId(
          dummyDbData.memes.filter(
            (b) => b.totalMemebacks == dummyDbData.memes[0].totalMemebacks
          )
        )
      ]
    ] as [Parameters<typeof Backend.searchMemes>[0]['match'], string[]][];

    const regexMatchItems = [
      [
        { content: '^#\\d ' },
        itemToStringId(dummyDbData.memes.filter((b) => /^#\d /i.test(b.content)))
      ]
    ] as [Parameters<typeof Backend.searchMemes>[0]['regexMatch'], string[]][];

    await Promise.all([
      ...matchItems.map(([match, expectedMemes]) =>
        // eslint-disable-next-line jest/valid-expect-in-promise
        expect(
          Backend.searchMemes({ after: null, match, regexMatch: {} }).then((r) =>
            r.map((b) => b.meme_id.toString())
          )
        ).resolves.toIncludeSameMembers(expectedMemes)
      ),
      ...regexMatchItems.map(([regexMatch, expectedMemes]) =>
        // eslint-disable-next-line jest/valid-expect-in-promise
        expect(
          Backend.searchMemes({ after: null, regexMatch, match: {} }).then((r) =>
            r.map((b) => b.meme_id.toString())
          )
        ).resolves.toIncludeSameMembers(expectedMemes)
      )
    ]);
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        expect(
          await Backend.searchMemes({ after: null, match: {}, regexMatch: {} })
        ).toStrictEqual(reversedMemes.slice(0, 5).map(toPublicMeme));

        expect(
          await Backend.searchMemes({
            after: reversedMemes[4]._id,
            match: {},
            regexMatch: {}
          })
        ).toStrictEqual(reversedMemes.slice(5, 10).map(toPublicMeme));

        expect(
          await Backend.searchMemes({
            after: reversedMemes[9]._id,
            match: {},
            regexMatch: {}
          })
        ).toStrictEqual(reversedMemes.slice(10, 15).map(toPublicMeme));
      },
      { RESULTS_PER_PAGE: '5' }
    );
  });

  it('functions when database is empty', async () => {
    expect.hasAssertions();

    const db = await getDb();
    await db.collection('memes').deleteMany({});
    await db.collection('users').deleteMany({});

    expect(
      await Backend.searchMemes({ after: null, match: {}, regexMatch: {} })
    ).toStrictEqual([]);
  });

  it('returns expected memes when using match and regexMatch simultaneously', async () => {
    expect.hasAssertions();

    expect(
      await Backend.searchMemes({
        after: null,
        match: { likes: { $lt: 100 } },
        regexMatch: {
          owner: `${dummyDbData.users[0]._id}|${dummyDbData.users[1]._id}`
        }
      }).then((r) => r.map((b) => b.meme_id.toString()))
    ).toIncludeSameMembers(
      itemToStringId(
        dummyDbData.memes.filter(
          (b) =>
            [dummyDbData.users[0]._id, dummyDbData.users[1]._id].includes(b.owner) &&
            b.totalLikes < 100
        )
      )
    );
  });

  it('returns expected memes when using match for ID search', async () => {
    expect.hasAssertions();

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          likes: { $lt: 100 },
          owner: `${dummyDbData.users[0]._id}|${dummyDbData.users[1]._id}`
        },
        regexMatch: {}
      }).then((r) => r.map((b) => b.meme_id.toString()))
    ).toIncludeSameMembers(
      itemToStringId(
        dummyDbData.memes.filter(
          (b) =>
            [dummyDbData.users[0]._id, dummyDbData.users[1]._id].includes(b.owner) &&
            b.totalLikes < 100
        )
      )
    );
  });

  it('match and regexMatch errors properly with bad inputs', async () => {
    expect.hasAssertions();

    const items = [
      [{ likes: { $in: [5] } }, 'validation'],
      [{ bad: 'super-bad' }, 'validation'],
      [{ meta: {} }, 'validation'],
      [{ meme_id: 5 }, 'illegal'],
      [{ _id: 5 }, 'illegal'],
      [{ user_id: 5 }, 'illegal']
    ] as unknown;

    await Promise.all(
      (items as [Parameters<typeof Backend.searchMemes>[0]['match'], string][]).map(
        ([match, expectedMessage]) =>
          expect(
            Backend.searchMemes({ after: null, match, regexMatch: {} })
          ).rejects.toMatchObject({ message: expect.stringContaining(expectedMessage) })
      )
    );

    await Promise.all(
      (items as [Parameters<typeof Backend.searchMemes>[0]['regexMatch'], string][]).map(
        ([regexMatch, expectedMessage]) =>
          expect(
            Backend.searchMemes({ after: null, regexMatch, match: {} })
          ).rejects.toMatchObject({ message: expect.stringContaining(expectedMessage) })
      )
    );
  });
});

describe('::getApiKeys', () => {
  it('returns all API keys (SHA-256 hashed)', async () => {
    expect.hasAssertions();

    const keys = await Backend.getApiKeys();

    expect(keys).toStrictEqual(
      dummyDbData.keys.map(() => ({
        owner: expect.any(String),
        key: expect.any(String)
      }))
    );

    expect(keys).toSatisfyAll((k: InternalApiKey) => k.key.length == 64);
  });
});

describe('::isKeyAuthentic', () => {
  it('returns true iff an API key is found in the system', async () => {
    expect.hasAssertions();

    expect(await Backend.isKeyAuthentic(Backend.NULL_KEY)).toBeFalse();
    expect(await Backend.isKeyAuthentic(Backend.DUMMY_KEY)).toBeTrue();
  });
});

describe('::addToRequestLog', () => {
  it('adds request to log as expected', async () => {
    expect.hasAssertions();
    const req1 = {
      headers: { 'x-forwarded-for': '9.9.9.9' },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest;

    const req2 = {
      headers: {
        'x-forwarded-for': '8.8.8.8',
        key: Backend.DUMMY_KEY
      },
      method: 'GET',
      url: '/api/route/path2'
    } as unknown as NextApiRequest;

    const res1 = { statusCode: 1111 } as NextApiResponse;
    const res2 = { statusCode: 2222 } as NextApiResponse;

    const now = Date.now();
    const _now = Date.now;
    Date.now = () => now;

    await Backend.addToRequestLog({ req: req1, res: res1 });
    await Backend.addToRequestLog({ req: req2, res: res2 });

    Date.now = _now;

    const reqlog = (await getDb()).collection<WithId<InternalRequestLogEntry>>(
      'request-log'
    );

    const { _id: _, ...log1 } = (await reqlog.findOne({ resStatusCode: 1111 })) || {};
    const { _id: __, ...log2 } = (await reqlog.findOne({ resStatusCode: 2222 })) || {};

    expect(log1).toStrictEqual({
      ip: '9.9.9.9',
      key: null,
      route: 'route/path1',
      method: 'POST',
      time: now,
      resStatusCode: 1111
    });

    expect(log2).toStrictEqual({
      ip: '8.8.8.8',
      key: Backend.DUMMY_KEY,
      route: 'route/path2',
      method: 'GET',
      time: now,
      resStatusCode: 2222
    });
  });
});

describe('::isRateLimited', () => {
  it('returns true if ip or key are rate limited', async () => {
    expect.hasAssertions();
    const _now = Date.now;
    const now = Date.now();
    Date.now = () => now;

    const req1 = await Backend.isRateLimited({
      headers: { 'x-forwarded-for': '1.2.3.4' },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest);

    const req2 = await Backend.isRateLimited({
      headers: {
        'x-forwarded-for': '8.8.8.8',
        key: Backend.DUMMY_KEY
      },
      method: 'GET',
      url: '/api/route/path2'
    } as unknown as NextApiRequest);

    const req3 = await Backend.isRateLimited({
      headers: {
        'x-forwarded-for': '1.2.3.4',
        key: 'fake-key'
      },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest);

    const req4 = await Backend.isRateLimited({
      headers: {
        'x-forwarded-for': '5.6.7.8'
      },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest);

    const req5 = await Backend.isRateLimited({
      headers: {
        'x-forwarded-for': '1.2.3.4',
        key: Backend.DUMMY_KEY
      },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest);

    expect(req1.limited).toBeTrue();
    expect(req2.limited).toBeTrue();
    expect(req3.limited).toBeTrue();
    expect(req4.limited).toBeTrue();
    expect(req5.limited).toBeTrue();

    expect(req1.retryAfter).toBeWithin(1000 * 60 * 15 - 1000, 1000 * 60 * 15 + 1000);
    expect(req2.retryAfter).toBeWithin(1000 * 60 * 60 - 1000, 1000 * 60 * 60 + 1000);
    expect(req3.retryAfter).toBeWithin(1000 * 60 * 15 - 1000, 1000 * 60 * 15 + 1000);
    expect(req4.retryAfter).toBeWithin(1000 * 60 * 15 - 1000, 1000 * 60 * 15 + 1000);
    // ? Should return greater of the two ban times (key time > ip time)
    expect(req5.retryAfter).toBeWithin(1000 * 60 * 60 - 1000, 1000 * 60 * 60 + 1000);

    Date.now = _now;
  });

  it('returns false iff both ip and key (if provided) are not rate limited', async () => {
    expect.hasAssertions();
    const req1 = {
      headers: { 'x-forwarded-for': '1.2.3.5' },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest;

    const req2 = {
      headers: {
        'x-forwarded-for': '8.8.8.8',
        key: 'fake-key'
      },
      method: 'GET',
      url: '/api/route/path2'
    } as unknown as NextApiRequest;

    expect(await Backend.isRateLimited(req1)).toStrictEqual({
      limited: false,
      retryAfter: 0
    });
    expect(await Backend.isRateLimited(req2)).toStrictEqual({
      limited: false,
      retryAfter: 0
    });
  });

  it('returns false if "until" time has passed', async () => {
    expect.hasAssertions();
    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4' },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest;

    expect(await Backend.isRateLimited(req)).toContainEntry(['limited', true]);

    await (await getDb())
      .collection<InternalLimitedLogEntry>('limited-log-mview')
      .updateOne({ ip: '1.2.3.4' }, { $set: { until: Date.now() - 10 ** 5 } });

    expect(await Backend.isRateLimited(req)).toStrictEqual({
      limited: false,
      retryAfter: 0
    });
  });
});

describe('::isDueForContrivedError', () => {
  it('returns true after REQUESTS_PER_CONTRIVED_ERROR invocations', async () => {
    expect.hasAssertions();
    const rate = getEnv().REQUESTS_PER_CONTRIVED_ERROR;

    expect(
      Array.from({ length: rate * 2 }).map(() => Backend.isDueForContrivedError())
    ).toStrictEqual([
      ...Array.from({ length: rate - 1 }).map(() => false),
      true,
      ...Array.from({ length: rate - 1 }).map(() => false),
      true
    ]);
  });
});
