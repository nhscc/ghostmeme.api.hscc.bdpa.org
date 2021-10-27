/* eslint-disable no-await-in-loop */
import { wrapHandler } from 'universe/backend/middleware';
import { testApiHandler } from 'next-test-api-route-handler';
import { ObjectId } from 'mongodb';

import {
  asMockedFunction,
  asMockedNextApiMiddleware,
  itemFactory
} from 'testverse/setup';

import {
  DUMMY_KEY as KEY,
  getAllUsers,
  createUser,
  getUser,
  getMemeLikesUserIds,
  getUserLikedMemeIds,
  isMemeLiked,
  getUserFriendsUserIds,
  isUserAFriend,
  getFriendRequestsOfType,
  isFriendRequestOfType
} from 'universe/backend';

import EndpointUsers, { config as ConfigUsers } from 'universe/pages/api/v1/users';

import EndpointUsersId, {
  config as ConfigUsersId
} from 'universe/pages/api/v1/users/[user_id]';

import EndpointUsersIdLiked, {
  config as ConfigUsersIdLiked
} from 'universe/pages/api/v1/users/[user_id]/liked';

import EndpointUsersIdLikedId, {
  config as ConfigUsersIdLikedId
} from 'universe/pages/api/v1/users/[user_id]/liked/[meme_id]';

import EndpointUsersIdFriends, {
  config as ConfigUsersIdFriends
} from 'universe/pages/api/v1/users/[user_id]/friends';

import EndpointUsersIdFriendsId, {
  config as ConfigUsersIdFriendsId
} from 'universe/pages/api/v1/users/[user_id]/friends/[friend_id]';

import EndpointUsersIdRequestsType, {
  config as ConfigUsersIdRequestsType
} from 'universe/pages/api/v1/users/[user_id]/requests/[request_type]';

import EndpointUsersIdRequestsTypeId, {
  config as ConfigUsersIdRequestsTypeId
} from 'universe/pages/api/v1/users/[user_id]/requests/[request_type]/[target_id]';

import type { FriendRequestType, PublicUser } from 'types/global';

jest.mock('universe/backend');
jest.mock('universe/backend/middleware');

const mockedGetAllUsers = asMockedFunction(getAllUsers);
const mockedCreateUser = asMockedFunction(createUser);
const mockedGetUser = asMockedFunction(getUser);
const mockedGetMemeLikesUserIds = asMockedFunction(getMemeLikesUserIds);
const mockedGetUserLikedMemeIds = asMockedFunction(getUserLikedMemeIds);
const mockedIsMemeLiked = asMockedFunction(isMemeLiked);
const mockedGetUserFriendsUserIds = asMockedFunction(getUserFriendsUserIds);
const mockedIsUserAFriend = asMockedFunction(isUserAFriend);
const mockedGetFriendRequestsOfType = asMockedFunction(getFriendRequestsOfType);
const mockedIsFriendRequestOfType = asMockedFunction(isFriendRequestOfType);

const api = {
  users: EndpointUsers as typeof EndpointUsers & { config?: typeof ConfigUsers },
  usersId: EndpointUsersId as typeof EndpointUsersId & {
    config?: typeof ConfigUsersId;
  },
  usersIdLiked: EndpointUsersIdLiked as typeof EndpointUsersIdLiked & {
    config?: typeof ConfigUsersIdLiked;
  },
  usersIdLikedId: EndpointUsersIdLikedId as typeof EndpointUsersIdLikedId & {
    config?: typeof ConfigUsersIdLikedId;
  },
  usersIdFriends: EndpointUsersIdFriends as typeof EndpointUsersIdFriends & {
    config?: typeof ConfigUsersIdFriends;
  },
  usersIdFriendsId: EndpointUsersIdFriendsId as typeof EndpointUsersIdFriendsId & {
    config?: typeof ConfigUsersIdFriendsId;
  },
  usersIdRequestsType:
    EndpointUsersIdRequestsType as typeof EndpointUsersIdRequestsType & {
      config?: typeof ConfigUsersIdRequestsType;
    },
  usersIdRequestsTypeId:
    EndpointUsersIdRequestsTypeId as typeof EndpointUsersIdRequestsTypeId & {
      config?: typeof ConfigUsersIdRequestsTypeId;
    }
};

api.users.config = ConfigUsers;
api.usersId.config = ConfigUsersId;
api.usersIdLiked.config = ConfigUsersIdLiked;
api.usersIdLikedId.config = ConfigUsersIdLikedId;
api.usersIdFriends.config = ConfigUsersIdFriends;
api.usersIdFriendsId.config = ConfigUsersIdFriendsId;
api.usersIdRequestsType.config = ConfigUsersIdRequestsType;
api.usersIdRequestsTypeId.config = ConfigUsersIdRequestsTypeId;

beforeEach(() => {
  asMockedNextApiMiddleware(wrapHandler);

  mockedGetAllUsers.mockReturnValue(Promise.resolve([]));
  mockedCreateUser.mockReturnValue(Promise.resolve({} as unknown as PublicUser));
  mockedGetUser.mockReturnValue(Promise.resolve({} as unknown as PublicUser));
  mockedGetMemeLikesUserIds.mockReturnValue(Promise.resolve([]));
  mockedGetUserLikedMemeIds.mockReturnValue(Promise.resolve([]));
  mockedIsMemeLiked.mockReturnValue(Promise.resolve(false));
  mockedGetUserFriendsUserIds.mockReturnValue(Promise.resolve([]));
  mockedIsUserAFriend.mockReturnValue(Promise.resolve(false));
  mockedGetFriendRequestsOfType.mockReturnValue(Promise.resolve([]));
  mockedIsFriendRequestOfType.mockReturnValue(Promise.resolve(false));
});

describe('api/v1/users', () => {
  describe('/ [GET]', () => {
    it('returns users', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.users,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.users,
        test: async ({ fetch }) => {
          const json = await fetch().then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        handler: api.users,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/ [POST]', () => {
    it('accepts a new user schema; returns a meme', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.users,
        test: async ({ fetch }) => {
          await expect(
            fetch({
              method: 'POST',
              headers: { KEY, 'content-type': 'application/json' },
              body: JSON.stringify({})
            }).then(async (r) => [r.status, await r.json()])
          ).resolves.toStrictEqual([
            200,
            expect.objectContaining({ user: expect.anything() })
          ]);
        }
      });
    });
  });

  describe('/:user_id [GET]', () => {
    it('accepts a user_id and returns a user; errors on invalid user_id', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        handler: api.usersId,
        test: async ({ fetch }) => {
          mockedGetUser.mockReturnValue(
            Promise.resolve({}) as ReturnType<typeof mockedGetUser>
          );

          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(mockedGetUser).toBeCalledWith({ user_id: expect.anything() });
          expect(json.success).toBeTrue();
          expect(json.user).toBeObject();
        }
      });

      await testApiHandler({
        params: { user_id: '' },
        handler: api.usersId,
        test: async ({ fetch }) =>
          expect(fetch().then((r) => r.status)).resolves.toBe(400)
      });
    });
  });

  describe('/:username [GET]', () => {
    it('accepts a username and returns a user; errors on empty username/missing params', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: 'faker' },
        handler: api.usersId,
        test: async ({ fetch }) => {
          mockedGetUser.mockReturnValue(
            Promise.resolve({}) as ReturnType<typeof mockedGetUser>
          );

          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(mockedGetUser).toBeCalledWith({ username: expect.anything() });
          expect(json.success).toBeTrue();
          expect(json.user).toBeObject();
        }
      });
    });
  });

  describe('/:user_id [DELETE]', () => {
    it('accepts a user_id; errors on invalid user_id', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: new ObjectId().toString() }, 200],
        [{ user_id: 'invalid-id' }, 400]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            mockedGetUser.mockReturnValue(
              Promise.resolve({}) as ReturnType<typeof mockedGetUser>
            );

            Object.assign(params, expectedParams);

            await expect(
              fetch({
                method: 'DELETE',
                ...(expectedStatus == 200 ? { headers: { KEY } } : {})
              }).then(async (r) => [r.status, await r.json()])
            ).resolves.toStrictEqual([
              expectedStatus,
              expect.objectContaining({ success: expectedStatus == 200 })
            ]);
          }
        }
      });
    });
  });

  describe('/:user_id [PUT]', () => {
    it('accepts a user_id and patch user; errors on invalid user_id', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: new ObjectId().toString() }, 200],
        [{ user_id: 'invalid-id' }, 400]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch({
                method: 'PUT',
                headers: {
                  ...(expectedStatus == 200 ? { KEY } : {}),
                  'content-type': 'application/json'
                },
                body: JSON.stringify({})
              }).then(async (r) => [r.status, await r.json()])
            ).resolves.toStrictEqual([
              expectedStatus,
              expect.objectContaining({ success: expectedStatus == 200 })
            ]);
          }
        }
      });
    });
  });

  describe('/:user_id/liked [GET]', () => {
    it('accepts user_id and returns memes; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: 'invalid-id' }, 400],
        [{ user_id: new ObjectId().toString() }, 200]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdLiked,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(async (r) => [
                r.status,
                await r.json()
              ])
            ).resolves.toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, memes: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.usersIdLiked,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.memes).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        params: { user_id: new ObjectId().toString() },
        handler: api.usersIdLiked,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/:user_id/liked/:meme_id [GET]', () => {
    it('accepts meme_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsMemeLiked.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [{ meme_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ meme_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ meme_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            meme_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { meme_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdLikedId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(fetch().then((r) => r.status)).resolves.toStrictEqual(
              expectedStatus
            );
          }
        }
      });
    });

    it('404s if the user has not liked the meme', async () => {
      expect.hasAssertions();

      mockedIsMemeLiked.mockReturnValue(Promise.resolve(false));

      await testApiHandler({
        params: {
          meme_id: new ObjectId().toString(),
          user_id: new ObjectId().toString()
        },
        handler: api.usersIdLikedId,
        test: async ({ fetch }) => {
          await expect(fetch({ headers: { KEY } }).then((r) => r.status)).resolves.toBe(
            404
          );
        }
      });
    });
  });

  describe('/:user_id/friends [GET]', () => {
    it('accepts user_id and returns users; errors if invalid user_id given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: 'invalid-id' }, 400],
        [{ user_id: new ObjectId().toString() }, 200]
      ]);

      const params = { user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFriends,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(async (r) => [
                r.status,
                await r.json()
              ])
            ).resolves.toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, users: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.usersIdFriends,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        params: { user_id: new ObjectId().toString() },
        handler: api.usersIdFriends,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/:user_id/friends/:friend_id [GET]', () => {
    it('accepts friend_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsUserAFriend.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [{ friend_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ friend_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ friend_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            friend_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { friend_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFriendsId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(fetch().then((r) => r.status)).resolves.toStrictEqual(
              expectedStatus
            );
          }
        }
      });
    });

    it('404s if the users are not friends', async () => {
      expect.hasAssertions();

      mockedIsUserAFriend.mockReturnValue(Promise.resolve(false));

      await testApiHandler({
        params: {
          user_id: new ObjectId().toString(),
          friend_id: new ObjectId().toString()
        },
        handler: api.usersIdFriendsId,
        test: async ({ fetch }) => {
          await expect(fetch({ headers: { KEY } }).then((r) => r.status)).resolves.toBe(
            404
          );
        }
      });
    });
  });

  describe('/:user_id/friends/:friend_id [DELETE]', () => {
    it('accepts friend_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ friend_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ friend_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ friend_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            friend_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { friend_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFriendsId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
            ).resolves.toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/friends/:friend_id [PUT]', () => {
    it('accepts friend_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ friend_id: 'invalid-id', user_id: new ObjectId().toString() }, 400],
        [{ friend_id: new ObjectId().toString(), user_id: 'invalid-id' }, 400],
        [{ friend_id: 'invalid-id', user_id: 'invalid-id' }, 400],
        [
          {
            friend_id: new ObjectId().toString(),
            user_id: new ObjectId().toString()
          },
          200
        ]
      ]);

      const params = { friend_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdFriendsId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
            ).resolves.toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/requests/:request_type [GET]', () => {
    it('accepts user_id and request_type and returns users', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: new ObjectId().toString(), request_type: 'outgoing' }, 200],
        [{ user_id: new ObjectId().toString(), request_type: 'incoming' }, 200]
      ]);

      const params = {} as { user_id: string; request_type: FriendRequestType };

      await testApiHandler({
        params,
        handler: api.usersIdRequestsType,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(async (r) => [
                r.status,
                await r.json()
              ])
            ).resolves.toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, users: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('errors if invalid user_id or request_type given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ user_id: 'invalid-id', request_type: 'incoming' }, 400],
        [{ user_id: new ObjectId().toString(), request_type: 'bad' }, 400]
      ]);

      const params = {} as { user_id: string; request_type: FriendRequestType };

      await testApiHandler({
        params,
        handler: api.usersIdRequestsType,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(async (r) => [
                r.status,
                await r.json()
              ])
            ).resolves.toStrictEqual([
              expectedStatus,
              expectedStatus == 200
                ? { success: true, users: expect.any(Array) }
                : expect.objectContaining({ success: false })
            ]);
          }
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { user_id: new ObjectId().toString(), request_type: 'incoming' },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.usersIdRequestsType,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.users).toBeArray();
        }
      });
    });

    it('handles invalid offsets during pagination', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        `/?after=-5`,
        `/?after=a`,
        `/?after=@($)`,
        `/?after=xyz`,
        `/?after=123`,
        `/?after=(*$)`,
        `/?dne=123`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        params: { user_id: new ObjectId().toString(), request_type: 'incoming' },
        handler: api.usersIdRequestsType,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toIncludeSameMembers([
            ...Array.from({ length: factory.count - 1 }).map(() => 400),
            200
          ]);
        }
      });
    });
  });

  describe('/:user_id/requests/:request_type/:target_id [GET]', () => {
    it('accepts target_id, user_id, and request_type; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      mockedIsFriendRequestOfType.mockReturnValue(Promise.resolve(true));

      const factory = itemFactory([
        [
          {
            target_id: 'invalid-id',
            user_id: new ObjectId().toString(),
            request_type: 'incoming'
          },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: 'invalid-id',
            request_type: 'incoming'
          },
          400
        ],
        [
          { target_id: 'invalid-id', user_id: 'invalid-id', request_type: 'incoming' },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: new ObjectId().toString(),
            request_type: 'invalid-type'
          },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: new ObjectId().toString(),
            request_type: 'incoming'
          },
          200
        ]
      ]);

      const params = { target_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdRequestsTypeId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(fetch().then((r) => r.status)).resolves.toStrictEqual(
              expectedStatus
            );
          }
        }
      });
    });

    it('404s if the friend request does not exist', async () => {
      expect.hasAssertions();

      mockedIsFriendRequestOfType.mockReturnValue(Promise.resolve(false));

      await testApiHandler({
        params: {
          user_id: new ObjectId().toString(),
          target_id: new ObjectId().toString(),
          request_type: 'incoming'
        },
        handler: api.usersIdRequestsTypeId,
        test: async ({ fetch }) => {
          await expect(fetch({ headers: { KEY } }).then((r) => r.status)).resolves.toBe(
            404
          );
        }
      });
    });
  });

  describe('/:user_id/requests/:request_type/:target_id [DELETE]', () => {
    it('accepts target_id, user_id, and request_type; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [
          {
            target_id: 'invalid-id',
            user_id: new ObjectId().toString(),
            request_type: 'outgoing'
          },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: 'invalid-id',
            request_type: 'outgoing'
          },
          400
        ],
        [
          { target_id: 'invalid-id', user_id: 'invalid-id', request_type: 'outgoing' },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: new ObjectId().toString(),
            request_type: 'faker'
          },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: new ObjectId().toString(),
            request_type: 'outgoing'
          },
          200
        ]
      ]);

      const params = { target_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdRequestsTypeId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
            ).resolves.toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:user_id/requests/:request_type/:target_id [PUT]', () => {
    it('accepts target_id, user_id, and request_type; errors if invalid IDs given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [
          {
            target_id: 'invalid-id',
            user_id: new ObjectId().toString(),
            request_type: 'outgoing'
          },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: 'invalid-id',
            request_type: 'outgoing'
          },
          400
        ],
        [
          { target_id: 'invalid-id', user_id: 'invalid-id', request_type: 'outgoing' },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: new ObjectId().toString(),
            request_type: 'bad'
          },
          400
        ],
        [
          {
            target_id: new ObjectId().toString(),
            user_id: new ObjectId().toString(),
            request_type: 'outgoing'
          },
          200
        ]
      ]);

      const params = { target_id: '', user_id: '' };

      await testApiHandler({
        params,
        handler: api.usersIdRequestsTypeId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            await expect(
              fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
            ).resolves.toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });
});
