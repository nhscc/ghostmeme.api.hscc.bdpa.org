/* eslint-disable no-await-in-loop */
import { WithId, ObjectId } from 'mongodb';
import { toss } from 'toss-expression';
import cloneDeep from 'clone-deep';
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

// ? A mock-typed version of backend.handleImageUpload
let mockHandleImageUpload: jest.MockedFunction<typeof Backend.handleImageUpload>;

jest.mock('universe/backend', () => {
  type mockBackend = typeof import('universe/backend');
  const backend = jest.requireActual('universe/backend') as mockBackend & {
    _handleImageUpload: mockBackend['handleImageUpload'];
  };

  backend._handleImageUpload = backend.handleImageUpload;
  backend.handleImageUpload = jest.fn();
  return backend;
});

const { getDb } = setupTestDb();

const withMockedEnv = mockEnvFactory({}, { replace: false });

beforeEach(() => {
  mockHandleImageUpload = (
    Backend.handleImageUpload as unknown as typeof mockHandleImageUpload
  ).mockImplementation(() => Promise.resolve(null));
});

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
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: null,
        private: false,
        replyTo: null,
        imageUrl: 'https://meme.url',
        imageBase64: null
      },
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: null,
        private: false,
        replyTo: null,
        imageUrl: null,
        imageBase64: 'pretend-base64'
      },
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: '1',
        private: false,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      },
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: dummyDbData.users[0]._id.toString(),
        expiredAt: Date.now(),
        description: '2',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      },
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: '3',
        private: true,
        replyTo: dummyDbData.memes[0]._id.toString(),
        imageUrl: null,
        imageBase64: null
      },
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: '4',
        private: true,
        replyTo: null,
        imageUrl: 'https://meme.url',
        imageBase64: null
      },
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: Array.from({ length: 500 })
          .map(() => '5')
          .join(''),
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: 'not-base64'
      }
    ];

    const newMemes = await Promise.all(
      items.map((data) => Backend.createMeme({ creatorKey: Backend.DUMMY_KEY, data }))
    );

    const removeImageBase64 = (item: NewMeme): Omit<NewMeme, 'imageBase64'> => {
      const { imageBase64: _, ...remaining } = item;
      return remaining;
    };

    expect(newMemes).toIncludeSameMembers(
      items.map((item) => expect.objectContaining(removeImageBase64(item)))
    );

    const expectedInternalMemes = items.map<InternalMeme>((item) => {
      const internal: InternalMeme & { imageBase64?: string | null } = {
        ...item,
        _id: expect.any(ObjectId),
        owner: new ObjectId(item.owner),
        receiver: item.receiver ? new ObjectId(item.receiver) : null,
        createdAt: expect.any(Number),
        likes: [],
        totalLikes: 0,
        replyTo: item.replyTo ? new ObjectId(item.replyTo) : null,
        meta: expect.objectContaining({
          creator: Backend.DUMMY_KEY,
          likeability: expect.any(Number),
          gregariousness: expect.any(Number)
        })
      } as InternalMeme;

      delete internal.imageBase64;
      return internal;
    });

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

    const userId = dummyDbData.users[0]._id.toHexString();
    const memeId = dummyDbData.memes[0]._id.toHexString();

    const items: [NewMeme, string][] = [
      [undefined as unknown as NewMeme, 'only JSON'],
      ['string data' as unknown as NewMeme, 'only JSON'],
      [{} as unknown as NewMeme, 'non-zero length string'],
      [{ data: 1 } as unknown as NewMeme, 'non-zero length string'],
      [
        { description: '', createdAt: Date.now() } as unknown as NewMeme,
        'non-zero length string'
      ],
      [
        {
          owner: '',
          description: '',
          private: false
        } as unknown as NewMeme,
        'non-zero length string'
      ],
      [
        {
          owner: 'fds',
          description: 'fds',
          receiver: null,
          replyTo: null
        } as unknown as NewMeme,
        'boolean'
      ],
      [
        {
          owner: userId,
          description: 'fds2',
          private: false,
          receiver: null,
          imageUrl: null,
          imageBase64: null,
          replyTo: null
        } as unknown as NewMeme,
        'must be a number'
      ],
      [
        {
          owner: userId,
          description: 'fds3',
          private: false,
          receiver: null,
          replyTo: null
        } as unknown as NewMeme,
        'must be a string or null'
      ],
      [
        {
          owner: userId,
          description: 'fds4',
          private: false,
          receiver: null,
          imageUrl: null,
          replyTo: null
        } as unknown as NewMeme,
        'string, data uri, or null'
      ],
      [
        {
          owner: userId,
          description: 'fds5',
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: 'something',
          imageUrl: 'https://some.url'
        } as unknown as NewMeme,
        'at the same time'
      ],
      [
        {
          owner: userId,
          description: 'abc1',
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: null,
          imageUrl: 'https://some.url',
          expiredAt: true
        } as unknown as NewMeme,
        'a number'
      ],
      [
        {
          owner: 'bad',
          description: 'abc2',
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: null,
          imageUrl: 'https://some.url',
          expiredAt: -1
        } as unknown as NewMeme,
        'for `owner`'
      ],
      [
        {
          owner: userId,
          description: 'abc3',
          private: false,
          receiver: 'bad',
          replyTo: null,
          imageBase64: 'pretend-its-base64',
          imageUrl: null,
          expiredAt: -1
        } as unknown as NewMeme,
        'for `receiver`'
      ],
      [
        {
          owner: userId,
          description: 'abc4',
          private: false,
          receiver: null,
          replyTo: 'bad',
          imageBase64: 'pretend-its-base64',
          imageUrl: null,
          expiredAt: -1
        } as unknown as NewMeme,
        'for `replyTo`'
      ],
      [
        {
          owner: userId,
          description: 'abc5',
          private: true,
          receiver: new ObjectId().toHexString(),
          replyTo: memeId,
          imageBase64: 'pretend-its-base64',
          imageUrl: null,
          expiredAt: -1
        } as unknown as NewMeme,
        'illegal receiver-private-replyTo combination'
      ],
      [
        {
          owner: userId,
          description: 'abc6',
          private: false,
          receiver: new ObjectId().toHexString(),
          replyTo: null,
          imageBase64: 'pretend-its-base64',
          imageUrl: null,
          expiredAt: 123456789
        } as unknown as NewMeme,
        'illegal receiver-private-replyTo combination'
      ],
      [
        {
          owner: userId,
          description: 'abc7',
          private: false,
          receiver: null,
          replyTo: memeId,
          imageBase64: 'pretend-its-base64',
          imageUrl: null,
          expiredAt: -1
        } as unknown as NewMeme,
        'illegal receiver-private-replyTo combination'
      ],
      [
        {
          owner: userId,
          description: Array.from({ length: 501 })
            .map(() => 'x')
            .join(''),
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: 'pretend-its-base64',
          imageUrl: null,
          expiredAt: -1
        } as unknown as NewMeme,
        '<= 500'
      ],
      [
        {
          owner: userId,
          description: 'hi',
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: 'pretend-its-base64',
          imageUrl: null,
          expiredAt: -1,
          extraProp: true
        } as unknown as NewMeme,
        'unexpected prop'
      ],
      [
        {
          owner: '',
          description: 'abc8',
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: null,
          imageUrl: 'https://some.url',
          expiredAt: -1
        } as unknown as NewMeme,
        '`owner`'
      ],
      [
        {
          description: 'abc82',
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: null,
          imageUrl: 'https://some.url',
          expiredAt: -1
        } as unknown as NewMeme,
        '`owner`'
      ],
      [
        {
          owner: new ObjectId().toHexString(),
          description: 'abc9',
          private: false,
          receiver: null,
          replyTo: null,
          imageBase64: null,
          imageUrl: 'https://some.url',
          expiredAt: -1
        } as unknown as NewMeme,
        'not found'
      ],
      [
        {
          owner: userId,
          description: 'abc10',
          private: true,
          receiver: new ObjectId().toHexString(),
          replyTo: null,
          imageBase64: null,
          imageUrl: 'https://some.url',
          expiredAt: -1
        } as unknown as NewMeme,
        'not found'
      ],
      [
        {
          owner: userId,
          description: 'abc11',
          private: true,
          receiver: null,
          replyTo: new ObjectId().toHexString(),
          imageBase64: null,
          imageUrl: 'https://some.url',
          expiredAt: -1
        } as unknown as NewMeme,
        'not found'
      ],
      [
        {
          owner: dummyDbData.users[0]._id.toString(),
          receiver: null,
          expiredAt: -1,
          description: null,
          private: false,
          replyTo: null,
          imageUrl: null,
          imageBase64: null
        } as unknown as NewMeme,
        'empty'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.createMeme({ creatorKey: Backend.DUMMY_KEY, data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('updates user and summary system metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();
    await Backend.createMeme({
      creatorKey: Backend.DUMMY_KEY,
      data: {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: '1',
        private: false,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }
    }).then((b) => new ObjectId(b.meme_id));

    await Backend.createMeme({
      creatorKey: Backend.DUMMY_KEY,
      data: {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: '1',
        private: false,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }
    });

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalMemes)
    ).toStrictEqual(dummyDbData.info.totalMemes + 2);
  });

  it('handles imageBase64 uploads', async () => {
    expect.hasAssertions();

    const items: NewMeme[] = [
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: null,
        private: false,
        replyTo: null,
        imageUrl: null,
        imageBase64: (await import('testverse/images')).image17KB
      },
      {
        owner: dummyDbData.users[0]._id.toString(),
        receiver: null,
        expiredAt: -1,
        description: null,
        private: false,
        replyTo: null,
        imageUrl: null,
        imageBase64: (await import('testverse/images')).image5MB
      }
    ];

    const newMemes = await Promise.all(
      items.map((data) => Backend.createMeme({ creatorKey: Backend.DUMMY_KEY, data }))
    );

    const removeImageBase64 = (item: NewMeme): Omit<NewMeme, 'imageBase64'> => {
      const { imageBase64: _, ...remaining } = item;
      return remaining;
    };

    expect(newMemes).toIncludeSameMembers(
      items.map((item) => expect.objectContaining(removeImageBase64(item)))
    );

    const expectedInternalMemes = items.map<InternalMeme>((item) => {
      const internal: InternalMeme & { imageBase64?: string | null } = {
        ...item,
        _id: expect.any(ObjectId),
        owner: new ObjectId(item.owner),
        receiver: item.receiver ? new ObjectId(item.receiver) : null,
        createdAt: expect.any(Number),
        likes: [],
        totalLikes: 0,
        imageUrl: expect.stringContaining('https://i.imgur.com/'),
        replyTo: item.replyTo ? new ObjectId(item.replyTo) : null,
        meta: expect.objectContaining({
          creator: Backend.DUMMY_KEY,
          likeability: expect.any(Number),
          gregariousness: expect.any(Number)
        })
      } as InternalMeme;

      delete internal.imageBase64;
      return internal;
    });

    expect(
      await (
        await getDb()
      )
        .collection<InternalMeme>('memes')
        .find({ _id: { $in: newMemes.map((b) => new ObjectId(b.meme_id)) } })
        .toArray()
    ).toIncludeSameMembers(expectedInternalMemes);
  });
});

describe('::updateMeme', () => {
  it('updates an existing meme in the database', async () => {
    expect.hasAssertions();

    const memes = (await getDb()).collection<WithId<InternalUser>>('memes');

    const items: [MemeId[], PatchMeme][] = [
      [[dummyDbData.memes[0]._id], { expiredAt: -1 }],
      [dummyDbData.memes.slice(4, 6).map((m) => m._id), { expiredAt: 0 }],
      [dummyDbData.memes.slice(40, 60).map((m) => m._id), { expiredAt: Date.now() * 2 }]
    ];

    await Promise.all(
      items.map(([meme_ids, data]) => Backend.updateMemes({ meme_ids, data }))
    );

    await Promise.all(
      items.map(async ([meme_ids, { expiredAt }]) =>
        expect(
          await memes
            .find({ _id: { $in: meme_ids }, expiredAt })
            .toArray()
            .then((r) => r.map((m) => m._id))
        ).toIncludeSameMembers(meme_ids)
      )
    );
  });

  it('errors if request body is invalid', async () => {
    expect.hasAssertions();

    const items: [PatchMeme, string][] = [
      [undefined as unknown as PatchMeme, 'only JSON'],
      ['string data' as unknown as PatchMeme, 'only JSON'],
      [{} as unknown as PatchMeme, 'must be a number'],
      [{ data: 1 } as unknown as PatchMeme, 'must be a number'],
      [{ expiredAt: null } as unknown as PatchMeme, 'must be a number'],
      [{ expiredAt: true } as unknown as PatchMeme, 'must be a number']
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.updateMemes({ meme_ids: [dummyDbData.memes[1]._id], data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );

    await expect(
      Backend.updateMemes({
        meme_ids: [new ObjectId(), 'bad-id' as unknown as ObjectId, new ObjectId()],
        data: { expiredAt: -1 }
      })
    ).rejects.toMatchObject({ message: expect.stringContaining('invalid ObjectId') });

    await expect(
      Backend.updateMemes({
        meme_ids: Array.from({ length: getEnv().RESULTS_PER_PAGE + 1 }).map(
          () => new ObjectId()
        ),
        data: { expiredAt: -1 }
      })
    ).rejects.toMatchObject({ message: expect.stringContaining('too many') });
  });

  it('does not reject if a meme_id does not exist', async () => {
    expect.hasAssertions();

    await expect(
      Backend.updateMemes({
        meme_ids: [new ObjectId()],
        data: { expiredAt: -1 }
      })
    ).resolves.toBeUndefined();
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
  it('returns user by user_id', async () => {
    expect.hasAssertions();

    expect(await Backend.getUser({ user_id: dummyDbData.users[0]._id })).toStrictEqual(
      toPublicUser(dummyDbData.users[0])
    );
  });

  it('returns user by username', async () => {
    expect.hasAssertions();

    expect(
      await Backend.getUser({ username: dummyDbData.users[0].username })
    ).toStrictEqual(toPublicUser(dummyDbData.users[0]));
  });

  it('rejects if id not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(Backend.getUser({ user_id: id })).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });

  it('rejects if id and username not passed', async () => {
    expect.hasAssertions();

    await expect(Backend.getUser({})).rejects.toMatchObject({
      message: 'must provide either user_id or username'
    });
  });

  it('rejects if username not found', async () => {
    expect.hasAssertions();

    const id = new ObjectId();

    await expect(Backend.getUser({ username: id.toString() })).rejects.toMatchObject({
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
  it("returns a user's friends", async () => {
    expect.hasAssertions();

    const users = dummyDbData.users.map<[ObjectId, UserId[]]>((u) => [u._id, u.friends]);

    for (const [user_id, expectedIds] of users) {
      expect(
        await Backend.getUserFriendsUserIds({
          user_id,
          after: null
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
            after: dummyDbData.users[9].friends[0]
          })
        ).toStrictEqual(
          [
            itemToStringId(dummyDbData.users[9].friends.slice(1)),
            itemToStringId(extraUsers)
          ]
            .flat()
            .slice(0, 4)
        );
      },
      { RESULTS_PER_PAGE: '4' }
    );
  });

  it('functions when user is not friends with anyone', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne({ _id: dummyDbData.users[9]._id }, { $set: { friends: [] } });

    expect(
      await Backend.getUserFriendsUserIds({
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
        expect(Backend.getUserFriendsUserIds({ user_id, after })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
        })
      )
    );
  });
});

describe('::isUserAFriend', () => {
  it('returns true iff the specified users are friends', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, boolean][] = [
      [dummyDbData.users[0]._id, dummyDbData.users[0]._id, false],
      [dummyDbData.users[0]._id, new ObjectId(dummyDbData.users[0].friends[0]), true]
    ];

    await Promise.all(
      items.map(([user_id, friend_id, expectedTruth]) =>
        expect(Backend.isUserAFriend({ user_id, friend_id })).resolves.toStrictEqual(
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
      items.map(([user_id, friend_id, ndx]) =>
        expect(Backend.isUserAFriend({ user_id, friend_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : friend_id))
        })
      )
    );
  });
});

describe('::removeUserAsFriend', () => {
  it('removes the specified user as a friend of another', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const users = await db.collection<InternalUser>('users');
    const testUsers = itemToObjectId(dummyDbData.users[9].friends);

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.friends)
    ).not.toStrictEqual([]);

    await Promise.all(
      testUsers.map((friend_id) =>
        Backend.removeUserAsFriend({ user_id: dummyDbData.users[9]._id, friend_id })
      )
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.friends)
    ).toStrictEqual([]);
  });

  it('does not error if the users were never friends', async () => {
    expect.hasAssertions();

    await expect(
      Backend.removeUserAsFriend({
        user_id: dummyDbData.users[0]._id,
        friend_id: dummyDbData.users[5]._id
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
      items.map(([user_id, friend_id, ndx]) =>
        expect(Backend.removeUserAsFriend({ user_id, friend_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : friend_id))
        })
      )
    );
  });
});

describe('::addUserAsFriend', () => {
  it('assigns the specified users as friends', async () => {
    expect.hasAssertions();

    const users = await (await getDb()).collection<InternalUser>('users');
    const friend_id = itemToObjectId(dummyDbData.users[6]);

    expect(
      await users
        .findOne({ _id: dummyDbData.users[0]._id })
        .then((r) => itemToStringId(r?.friends))
    ).not.toStrictEqual(expect.arrayContaining([friend_id.toString()]));

    await Backend.addUserAsFriend({ user_id: dummyDbData.users[0]._id, friend_id });

    expect(
      await users
        .findOne({ _id: dummyDbData.users[0]._id })
        .then((r) => itemToStringId(r?.friends))
    ).toStrictEqual(expect.arrayContaining([friend_id.toString()]));
  });

  it('does not error if the users are already friends', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addUserAsFriend({
        user_id: dummyDbData.users[0]._id,
        friend_id: dummyDbData.users[0].friends[0]
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
      items.map(([user_id, friend_id, ndx]) =>
        expect(Backend.addUserAsFriend({ user_id, friend_id })).rejects.toMatchObject({
          message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : friend_id))
        })
      )
    );
  });

  it('user cannot be a friend of themselves', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addUserAsFriend({
        user_id: dummyDbData.users[0]._id,
        friend_id: dummyDbData.users[0]._id
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining('cannot friend themselves')
    });
  });
});

describe('::getFriendRequestsOfType', () => {
  it('returns friend requests with respect to type', async () => {
    expect.hasAssertions();

    const users = dummyDbData.users.map<[ObjectId, Record<string, UserId[]>]>((u) => [
      u._id,
      u.requests
    ]);

    for (const [user_id, expectedIds] of users) {
      expect(
        await Backend.getFriendRequestsOfType({
          user_id,
          request_type: 'incoming',
          after: null
        })
      ).toStrictEqual(itemToStringId(expectedIds.incoming));

      expect(
        await Backend.getFriendRequestsOfType({
          user_id,
          request_type: 'outgoing',
          after: null
        })
      ).toStrictEqual(itemToStringId(expectedIds.outgoing));
    }
  });

  it('supports pagination', async () => {
    expect.hasAssertions();

    const extraUsers = dummyDbData.users.slice(2, 5);

    await (await getDb()).collection<InternalUser>('users').updateOne(
      { _id: dummyDbData.users[9]._id },
      {
        $push: {
          'requests.incoming': { $each: itemToObjectId(extraUsers) },
          'requests.outgoing': { $each: itemToObjectId(extraUsers) }
        }
      }
    );

    await withMockedEnv(
      async () => {
        expect(
          await Backend.getFriendRequestsOfType({
            user_id: dummyDbData.users[9]._id,
            request_type: 'incoming',
            after: dummyDbData.users[0]._id
          })
        ).toStrictEqual(itemToStringId(extraUsers.slice(0, 2)));

        expect(
          await Backend.getFriendRequestsOfType({
            user_id: dummyDbData.users[9]._id,
            request_type: 'outgoing',
            after: dummyDbData.users[0]._id
          })
        ).toStrictEqual(itemToStringId(extraUsers.slice(0, 2)));
      },
      { RESULTS_PER_PAGE: '2' }
    );
  });

  it('functions when user has no friend requests', async () => {
    expect.hasAssertions();

    await (await getDb())
      .collection<InternalUser>('users')
      .updateOne(
        { _id: dummyDbData.users[9]._id },
        { $set: { incoming: [], outgoing: [] } }
      );

    expect(
      await Backend.getFriendRequestsOfType({
        user_id: dummyDbData.users[9]._id,
        request_type: 'incoming',
        after: null
      })
    ).toStrictEqual([]);

    expect(
      await Backend.getFriendRequestsOfType({
        user_id: dummyDbData.users[9]._id,
        request_type: 'outgoing',
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
      items
        .map(([user_id, after, ndx]) => {
          return [
            // eslint-disable-next-line jest/valid-expect
            expect(
              Backend.getFriendRequestsOfType({
                user_id,
                request_type: 'incoming',
                after
              })
            ).rejects.toMatchObject({
              message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
            }),
            // eslint-disable-next-line jest/valid-expect
            expect(
              Backend.getFriendRequestsOfType({
                user_id,
                request_type: 'incoming',
                after
              })
            ).rejects.toMatchObject({
              message: expect.stringContaining(itemToStringId(ndx == 0 ? user_id : after))
            })
          ];
        })
        .flat()
    );
  });
});

describe('::isFriendRequestOfType', () => {
  it('returns true iff the user has a friend request of the specified type', async () => {
    expect.hasAssertions();
    const userId = dummyDbData.users[5]._id;

    const items: [UserId, UserId, boolean][] = [
      [dummyDbData.users[0]._id, dummyDbData.users[6]._id, false],
      [dummyDbData.users[0]._id, userId, true]
    ];

    await (await getDb()).collection<InternalUser>('users').updateOne(
      { _id: dummyDbData.users[0]._id },
      {
        $push: {
          'requests.incoming': { $each: [userId] },
          'requests.outgoing': { $each: [userId] }
        }
      }
    );

    await Promise.all(
      items
        .map(([user_id, target_id, expectedTruth]) => {
          return [
            // eslint-disable-next-line jest/valid-expect
            expect(
              Backend.isFriendRequestOfType({
                user_id,
                request_type: 'incoming',
                target_id
              })
            ).resolves.toStrictEqual(expectedTruth),
            // eslint-disable-next-line jest/valid-expect
            expect(
              Backend.isFriendRequestOfType({
                user_id,
                request_type: 'outgoing',
                target_id
              })
            ).resolves.toStrictEqual(expectedTruth)
          ];
        })
        .flat()
    );
  });

  it('rejects if ids not found', async () => {
    expect.hasAssertions();

    const items: [UserId, UserId, number][] = [
      [new ObjectId(), dummyDbData.users[0]._id, 0],
      [dummyDbData.users[0]._id, new ObjectId(), 1]
    ];

    await Promise.all(
      items.map(([user_id, target_id, ndx]) => {
        return [
          // eslint-disable-next-line jest/valid-expect
          expect(
            Backend.isFriendRequestOfType({
              user_id,
              request_type: 'incoming',
              target_id
            })
          ).rejects.toMatchObject({
            message: expect.stringContaining(
              itemToStringId(ndx == 0 ? user_id : target_id)
            )
          }),
          // eslint-disable-next-line jest/valid-expect
          expect(
            Backend.isFriendRequestOfType({
              user_id,
              request_type: 'outgoing',
              target_id
            })
          ).rejects.toMatchObject({
            message: expect.stringContaining(
              itemToStringId(ndx == 0 ? user_id : target_id)
            )
          })
        ];
      })
    );
  });
});

describe('::removeFriendRequest', () => {
  it('removes a friend request of the specified type', async () => {
    expect.hasAssertions();

    const db = await getDb();
    const users = await db.collection<InternalUser>('users');
    const testUsers = itemToObjectId(dummyDbData.users);

    await (await getDb()).collection<InternalUser>('users').updateOne(
      { _id: dummyDbData.users[9]._id },
      {
        $push: {
          'requests.incoming': { $each: testUsers },
          'requests.outgoing': { $each: testUsers }
        }
      }
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.requests)
    ).not.toStrictEqual({ incoming: [], outgoing: [] });

    await Promise.all(
      testUsers
        .map((target_id) => {
          return [
            Backend.removeFriendRequest({
              user_id: dummyDbData.users[9]._id,
              request_type: 'incoming',
              target_id
            }),
            Backend.removeFriendRequest({
              user_id: dummyDbData.users[9]._id,
              request_type: 'outgoing',
              target_id
            })
          ];
        })
        .flat()
    );

    expect(
      await users.findOne({ _id: dummyDbData.users[9]._id }).then((r) => r?.requests)
    ).toStrictEqual({ incoming: [], outgoing: [] });
  });

  it('does not error if the friend request does not exist', async () => {
    expect.hasAssertions();

    await expect(
      Backend.removeFriendRequest({
        user_id: dummyDbData.users[0]._id,
        request_type: 'incoming',
        target_id: dummyDbData.users[0]._id
      })
    ).toResolve();

    await expect(
      Backend.removeFriendRequest({
        user_id: dummyDbData.users[0]._id,
        request_type: 'outgoing',
        target_id: dummyDbData.users[0]._id
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
      items.map(([user_id, target_id, ndx]) => {
        return [
          // eslint-disable-next-line jest/valid-expect
          expect(
            Backend.removeFriendRequest({ user_id, request_type: 'incoming', target_id })
          ).rejects.toMatchObject({
            message: expect.stringContaining(
              itemToStringId(ndx == 0 ? user_id : target_id)
            )
          }),
          // eslint-disable-next-line jest/valid-expect
          expect(
            Backend.removeFriendRequest({ user_id, request_type: 'outgoing', target_id })
          ).rejects.toMatchObject({
            message: expect.stringContaining(
              itemToStringId(ndx == 0 ? user_id : target_id)
            )
          })
        ];
      })
    );
  });
});

describe('::addFriendRequest', () => {
  it('creates a new friend request of the specified type', async () => {
    expect.hasAssertions();

    const users = await (await getDb()).collection<InternalUser>('users');
    const user = dummyDbData.users[0];
    const testUsers = itemToObjectId(dummyDbData.users.slice(1));

    await Promise.all(
      testUsers
        .map((target_id) => {
          return [
            Backend.addFriendRequest({
              user_id: user._id,
              request_type: 'incoming',
              target_id
            }),
            Backend.addFriendRequest({
              user_id: user._id,
              request_type: 'outgoing',
              target_id
            })
          ];
        })
        .flat()
    );

    expect(
      await users
        .findOne({ _id: user._id })
        .then((r) => itemToObjectId(r?.requests.incoming))
    ).toIncludeSameMembers(testUsers);

    expect(
      await users
        .findOne({ _id: user._id })
        .then((r) => itemToObjectId(r?.requests.outgoing))
    ).toIncludeSameMembers(testUsers);
  });

  it('does not error if the friend request already exists', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addFriendRequest({
        user_id: dummyDbData.users[0]._id,
        request_type: 'incoming',
        target_id: dummyDbData.users[1]._id
      })
    ).toResolve();

    await expect(
      Backend.addFriendRequest({
        user_id: dummyDbData.users[0]._id,
        request_type: 'incoming',
        target_id: dummyDbData.users[1]._id
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
      items
        .map(([user_id, target_id, ndx]) => {
          return [
            // eslint-disable-next-line jest/valid-expect
            expect(
              Backend.addFriendRequest({ user_id, request_type: 'incoming', target_id })
            ).rejects.toMatchObject({
              message: expect.stringContaining(
                itemToStringId(ndx == 0 ? user_id : target_id)
              )
            }),
            // eslint-disable-next-line jest/valid-expect
            expect(
              Backend.addFriendRequest({ user_id, request_type: 'outgoing', target_id })
            ).rejects.toMatchObject({
              message: expect.stringContaining(
                itemToStringId(ndx == 0 ? user_id : target_id)
              )
            })
          ];
        })
        .flat()
    );
  });

  it('user cannot send a friend request to themselves', async () => {
    expect.hasAssertions();

    await expect(
      Backend.addFriendRequest({
        user_id: dummyDbData.users[0]._id,
        request_type: 'incoming',
        target_id: dummyDbData.users[0]._id
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining('friend request to themselves')
    });

    await expect(
      Backend.addFriendRequest({
        user_id: dummyDbData.users[0]._id,
        request_type: 'outgoing',
        target_id: dummyDbData.users[0]._id
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining('friend request to themselves')
    });
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
        username: 'uzr-1',
        imageBase64: null
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null,
        username: 'uzr-2-12345678901234',
        imageBase64: null
      },
      {
        name: 'three name',
        email: '3-three@email.address',
        phone: '333.333.3333 x5467',
        username: 'user_3',
        imageBase64: 'pretend-base64'
      }
    ];

    const newUsers = await Promise.all(
      items.map((data) => Backend.createUser({ creatorKey: Backend.DUMMY_KEY, data }))
    );

    const expectedInternalUsers = items.map<InternalUser>((item) => {
      const { imageBase64: _, ...rest } = item;
      return {
        ...rest,
        _id: expect.any(ObjectId),
        deleted: false,
        liked: [],
        friends: [],
        requests: { incoming: [], outgoing: [] },
        imageUrl: null,
        meta: expect.objectContaining({
          creator: Backend.DUMMY_KEY
        })
      };
    });

    expect(newUsers).toIncludeSameMembers(
      items.map((item) => {
        const { imageBase64: _, ...rest } = item;
        return expect.objectContaining(rest);
      })
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
          imageBase64: false
        } as unknown as NewUser,
        'base64 string, data uri, or null'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          username: 'xunnamius',
          imageBase64: null,
          admin: true
        } as unknown as NewUser,
        'unexpected properties'
      ]
    ];

    await Promise.all(
      items.map(([data, message]) =>
        expect(
          Backend.createUser({ creatorKey: Backend.DUMMY_KEY, data })
        ).rejects.toMatchObject({ message: expect.stringContaining(message) })
      )
    );
  });

  it('updates summary system metadata', async () => {
    expect.hasAssertions();

    const db = await getDb();

    await Backend.createUser({
      creatorKey: Backend.DUMMY_KEY,
      data: {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        username: 'uzr-1',
        imageBase64: null
      }
    });

    expect(
      await db
        .collection<InternalInfo>('info')
        .findOne({})
        .then((r) => r?.totalUsers)
    ).toStrictEqual(dummyDbData.info.totalUsers + 1);
  });

  it('handles imageBase64 uploads', async () => {
    expect.hasAssertions();

    const items: NewUser[] = [
      {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        username: 'uzr-1',
        imageBase64: (await import('testverse/images')).image17KB
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null,
        username: 'uzr-2-12345678901234',
        imageBase64: (await import('testverse/images')).image5MB
      }
    ];

    const newUsers = await Promise.all(
      items.map((data) => Backend.createUser({ creatorKey: Backend.DUMMY_KEY, data }))
    );

    const expectedInternalUsers = items.map<InternalUser>((item) => {
      const { imageBase64: _, ...rest } = item;
      return {
        ...rest,
        _id: expect.any(ObjectId),
        deleted: false,
        liked: [],
        friends: [],
        requests: { incoming: [], outgoing: [] },
        imageUrl: expect.stringContaining('https://i.imgur.com/'),
        meta: expect.objectContaining({
          creator: Backend.DUMMY_KEY
        })
      };
    });

    expect(newUsers).toIncludeSameMembers(
      items.map((item) => {
        const { imageBase64: _, ...rest } = item;
        return expect.objectContaining(rest);
      })
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
});

describe('::updateUser', () => {
  it('updates an existing user in the database', async () => {
    expect.hasAssertions();

    const items: PatchUser[] = [
      {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        imageBase64: null
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null,
        imageBase64: 'pretend-base64'
      },
      {
        name: 'three name',
        email: '3-three@email.address',
        phone: '333.333.3333 x5467',
        imageBase64: null
      },
      {
        name: 'tre giles',
        email: 'valid@email.address',
        phone: '773-773-7773'
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
    ).toIncludeSameMembers(
      items.map((item) => {
        const { imageBase64: _, ...rest } = item;
        return expect.objectContaining(rest);
      })
    );
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
          imageBase64: null
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: 'tr',
          email: '',
          phone: '',
          imageBase64: null
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
          imageBase64: null
        } as unknown as PatchUser,
        '3 and 30'
      ],
      [
        {
          name: 'tre giles',
          email: '',
          phone: '',
          imageBase64: null
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: null,
          phone: '',
          imageBase64: null
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'invalid@email address',
          phone: '',
          imageBase64: null
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'bad-email-address.here',
          phone: '',
          imageBase64: null
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'validemailaddressbutitisway2big@who.woulddothis.com',
          phone: '',
          imageBase64: null
        } as unknown as PatchUser,
        '5 and 50'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '',
          imageBase64: null
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773',
          imageBase64: null
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-$*#-&$^#',
          imageBase64: null
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-773-773',
          imageBase64: null
        } as unknown as PatchUser,
        'valid phone number'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '773-773-7773',
          imageBase64: 5
        } as unknown as PatchUser,
        'string, data uri, or null'
      ],
      [
        {
          name: 'tre giles',
          email: 'valid@email.address',
          phone: '777-777-7777',
          imageBase64: 'fake-base64',
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
          phone: '111-111-1111',
          imageBase64: null
        }
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining(id.toString())
    });
  });

  it('handles imageBase64 uploads', async () => {
    expect.hasAssertions();

    const items: PatchUser[] = [
      {
        name: 'one name',
        email: '1-one@email.address',
        phone: '111-111-1111',
        imageBase64: (await import('testverse/images')).image17KB
      },
      {
        name: 'two name',
        email: '2-two@email.address',
        phone: null,
        imageBase64: (await import('testverse/images')).image5MB
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
    ).toIncludeSameMembers(
      items.map((item) => {
        const { imageBase64: _, ...rest } = item;
        return expect.objectContaining({
          rest,
          imageUrl: expect.stringContaining('https://i.imgur.com/')
        });
      })
    );
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

  it('searches with respect to match and regexMatch, handling proxying', async () => {
    expect.hasAssertions();

    const matchItems = [
      [
        { likes: { $gt: 20, $lt: 50 } },
        itemToStringId(
          dummyDbData.memes.filter((b) => b.totalLikes > 20 && b.totalLikes < 50)
        )
      ],
      [
        { likes: { $lt: 20 } },
        itemToStringId(dummyDbData.memes.filter((b) => b.totalLikes < 20))
      ],
      [
        { likes: { $gte: 20 } },
        itemToStringId(dummyDbData.memes.filter((b) => b.totalLikes >= 20))
      ],
      [
        { likes: { $lte: 20 } },
        itemToStringId(dummyDbData.memes.filter((b) => b.totalLikes <= 20))
      ]
    ] as [Parameters<typeof Backend.searchMemes>[0]['match'], string[]][];

    const regexMatchItems = [
      [
        { description: '@' },
        itemToStringId(dummyDbData.memes.filter((b) => /@/.test(b.description || '')))
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

  it('returns expected memes when matching ID-related fields', async () => {
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

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          likes: { $lt: 100 }
        },
        regexMatch: { owner: `${dummyDbData.users[0]._id}|${dummyDbData.users[1]._id}` }
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

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          likes: { $lt: 100 },
          receiver: `${dummyDbData.users[0]._id}|${dummyDbData.users[1]._id}`
        },
        regexMatch: {}
      }).then((r) => r.map((b) => b.meme_id.toString()))
    ).toIncludeSameMembers(
      itemToStringId(
        dummyDbData.memes.filter(
          (b) =>
            (
              [dummyDbData.users[0]._id, dummyDbData.users[1]._id] as (ObjectId | null)[]
            ).includes(b.receiver) && b.totalLikes < 100
        )
      )
    );

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          likes: { $lt: 100 }
        },
        regexMatch: {
          receiver: `${dummyDbData.users[0]._id}|${dummyDbData.users[1]._id}`
        }
      }).then((r) => r.map((b) => b.meme_id.toString()))
    ).toIncludeSameMembers(
      itemToStringId(
        dummyDbData.memes.filter(
          (b) =>
            (
              [dummyDbData.users[0]._id, dummyDbData.users[1]._id] as (ObjectId | null)[]
            ).includes(b.receiver) && b.totalLikes < 100
        )
      )
    );

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

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          likes: { $lt: 100 }
        },
        regexMatch: { owner: `${dummyDbData.users[0]._id}|${dummyDbData.users[1]._id}` }
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

  it('returns expected memes when searching conditioned on createdAt and expiredAt', async () => {
    expect.hasAssertions();

    const now = Date.now();

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          createdAt: { $lt: now, $gt: now / 2 }
        },
        regexMatch: {}
      }).then((r) => r.map((b) => b.meme_id.toString()))
    ).toIncludeSameMembers(
      itemToStringId(
        dummyDbData.memes.filter((b) => b.createdAt < now && b.createdAt > now / 2)
      )
    );

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          expiredAt: { $gte: now, $lte: now + now / 2 }
        },
        regexMatch: {}
      }).then((r) => r.map((b) => b.meme_id.toString()))
    ).toIncludeSameMembers(
      itemToStringId(
        dummyDbData.memes.filter(
          (b) => b.expiredAt >= now && b.expiredAt <= now + now / 2
        )
      )
    );
  });

  it('supports special "$or" sub-matcher', async () => {
    expect.hasAssertions();

    const now = Date.now();

    expect(
      await Backend.searchMemes({
        after: null,
        match: {
          createdAt: { $or: [{ $lt: now }, { $gt: now / 2 }] }
        },
        regexMatch: {}
      }).then((r) => r.map((b) => b.meme_id.toString()))
    ).toIncludeSameMembers(
      itemToStringId(
        dummyDbData.memes.filter((b) => b.createdAt < now || b.createdAt > now / 2)
      )
    );
  });

  it('match and regexMatch errors properly with bad inputs', async () => {
    expect.hasAssertions();

    const items = [
      ['wtf', 'match and regexMatch'],
      [['wtf'], 'match and regexMatch'],
      [null, 'match and regexMatch'],
      [undefined, 'match and regexMatch'],
      [{ meme_id: 5 }, 'illegal'],
      [{ _id: 5 }, 'illegal'],
      [{ user_id: 5 }, 'illegal'],
      [
        {
          owner: Array.from({ length: getEnv().RESULTS_PER_PAGE + 1 })
            .map(() => new ObjectId())
            .join('|')
        },
        '"owner": too many ids'
      ],
      [
        {
          receiver: Array.from({ length: getEnv().RESULTS_PER_PAGE + 1 })
            .map(() => new ObjectId())
            .join('|')
        },
        '"receiver": too many ids'
      ],
      [
        {
          replyTo: Array.from({ length: getEnv().RESULTS_PER_PAGE + 1 })
            .map(() => new ObjectId())
            .join('|')
        },
        '"replyTo": too many ids'
      ],
      [{ bad: 'super-bad' }, '"bad": invalid specifier'],
      [{ expiredAt: () => 'wtf' }, '"expiredAt": invalid value type'],
      [{ meta: {} }, '"meta": invalid specifier'],
      [{ likes: [] }, ['cannot be array', '(regex) string']],
      [{ likes: { $in: [5] } }, ['invalid sub-specifier "$in"', '(regex) string']],
      [{ likes: { $or: { bad: 'or' } } }, ['value must be array', '(regex) string']],
      [
        { likes: { $or: [{ bad: 5 }, { $lte: 5 }] } },
        ['sub-specifier at index 0: invalid sub-specifier "bad"', '(regex) string']
      ],
      [
        { likes: { $or: [{ $gt: 5 }, { $lte: 'bad' }] } },
        ['sub-specifier at index 1: "$lte" has invalid sub-value type', '(regex) string']
      ],
      [
        { likes: { $or: [{ $gt: 6 }, 'b'] } },
        ['sub-specifier at index 1: all array elements must be objects', '(regex) string']
      ],
      [
        { likes: { $or: [{ $gt: 6 }, { $gt: 6, $lte: 5 }] } },
        [
          'sub-specifier at index 1: only one sub-specifier allowed per array element',
          '(regex) string'
        ]
      ],
      [
        { likes: { $or: [{ $gt: 7 }, undefined] } },
        ['index 1: all array elements must be objects', '(regex) string']
      ],
      [{ likes: { $or: [{}, {}] } }, ['no empty objects allowed', '(regex) string']],
      [{ likes: {} }, ['no empty objects allowed', '(regex) string']],
      [{ likes: { $or: [] } }, ['must be exactly two', '(regex) string']],
      [
        { likes: { $or: [{ $gt: 5 }, { $gt: 5 }, { $gt: 5 }] } },
        ['must be exactly two', '(regex) string']
      ],
      [
        { likes: { $gte: 'bad' } },
        ['"totalLikes": "$gte" has invalid sub-value type', '(regex) string']
      ]
    ] as [Record<string, unknown>, string | string[]][];

    await Promise.all(
      (
        cloneDeep(items) as [
          Parameters<typeof Backend.searchMemes>[0]['match'],
          string | string[]
        ][]
      ).map(([match, expectedMessage]) =>
        expect(
          Backend.searchMemes({ after: null, match, regexMatch: {} })
        ).rejects.toMatchObject({
          message: expect.stringContaining(
            Array.isArray(expectedMessage) ? expectedMessage[0] : expectedMessage
          )
        })
      )
    );

    await Promise.all(
      (
        cloneDeep(items) as [
          Parameters<typeof Backend.searchMemes>[0]['regexMatch'],
          string
        ][]
      ).map(([regexMatch, expectedMessage]) =>
        expect(
          Backend.searchMemes({ after: null, regexMatch, match: {} })
        ).rejects.toMatchObject({
          message: expect.stringContaining(
            Array.isArray(expectedMessage) ? expectedMessage[1] : expectedMessage
          )
        })
      )
    );

    await expect(
      Backend.searchMemes({
        after: null,
        regexMatch: undefined as unknown as Record<string, string>,
        match: undefined as unknown as Record<string, string>
      })
    ).rejects.toMatchObject({ message: expect.stringContaining('match and regexMatch') });
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
        key: Backend.BANNED_KEY
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
      key: Backend.BANNED_KEY,
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
    const now = dummyDbData.generatedAt;
    Date.now = () => now;

    const req1 = await Backend.isRateLimited({
      headers: { 'x-forwarded-for': '1.2.3.4' },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest);

    const req2 = await Backend.isRateLimited({
      headers: {
        'x-forwarded-for': '8.8.8.8',
        key: Backend.BANNED_KEY
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
        key: Backend.BANNED_KEY
      },
      method: 'POST',
      url: '/api/route/path1'
    } as unknown as NextApiRequest);

    expect(req1.limited).toBeTrue();
    expect(req2.limited).toBeTrue();
    expect(req3.limited).toBeTrue();
    expect(req4.limited).toBeTrue();
    expect(req5.limited).toBeTrue();

    const minToMs = (minutes: number) => 1000 * 60 * minutes;
    expect(req1.retryAfter).toBeWithin(minToMs(15) - 1000, minToMs(15) + 1000);
    expect(req2.retryAfter).toBeWithin(minToMs(60) - 1000, minToMs(60) + 1000);
    expect(req3.retryAfter).toBeWithin(minToMs(15) - 1000, minToMs(15) + 1000);
    expect(req4.retryAfter).toBeWithin(minToMs(15) - 1000, minToMs(15) + 1000);
    // ? Should return greater of the two ban times (key time > ip time)
    expect(req5.retryAfter).toBeWithin(minToMs(60) - 1000, minToMs(60) + 1000);

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

describe('::handleImageUpload', () => {
  test.todo('unpacks base64 string to image and uploads it to imgur API');
  test.todo('duplicate uploads use LRU cache instead of imgur API, return same uri');
  test.todo('rejects badly formatted base64 strings');
  test.todo('handles imgur API errors gracefully');
});
