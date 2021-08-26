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
  createMeme,
  getMemes,
  getMemeLikesUserIds,
  isMemeLiked,
  searchMemes
} from 'universe/backend';

import EndpointMemes, { config as ConfigMemes } from 'universe/pages/api/v1/memes';
import EndpointMemesIds, {
  config as ConfigMemesIds
} from 'universe/pages/api/v1/memes/[...meme_ids]';

import EndpointMemesSearch, {
  config as ConfigMemesSearch
} from 'universe/pages/api/v1/memes/search';

import EndpointMemesIdLikes, {
  config as ConfigMemesIdLikes
} from 'universe/pages/api/v1/memes/[meme_id]/likes';

import EndpointMemesIdLikesId, {
  config as ConfigMemesIdLikesId
} from 'universe/pages/api/v1/memes/[meme_id]/likes/[user_id]';

import type { PublicMeme, PublicUser } from 'types/global';

jest.mock('universe/backend');
jest.mock('universe/backend/middleware');

const mockedCreateMeme = asMockedFunction(createMeme);
const mockedGetMemes = asMockedFunction(getMemes);
const mockedGetMemeLikesUserIds = asMockedFunction(getMemeLikesUserIds);
const mockedIsMemeLiked = asMockedFunction(isMemeLiked);
const mockedSearchMemes = asMockedFunction(searchMemes);

const api = {
  memes: EndpointMemes as typeof EndpointMemes & { config?: typeof ConfigMemes },
  memesIds: EndpointMemesIds as typeof EndpointMemesIds & {
    config?: typeof ConfigMemesIds;
  },
  memesSearch: EndpointMemesSearch as typeof EndpointMemesSearch & {
    config?: typeof ConfigMemesSearch;
  },
  memesIdLikes: EndpointMemesIdLikes as typeof EndpointMemesIdLikes & {
    config?: typeof ConfigMemesIdLikes;
  },
  memesIdLikesId: EndpointMemesIdLikesId as typeof EndpointMemesIdLikesId & {
    config?: typeof ConfigMemesIdLikesId;
  }
};

api.memes.config = ConfigMemes;
api.memesIds.config = ConfigMemesIds;
api.memesSearch.config = ConfigMemesSearch;
api.memesIdLikes.config = ConfigMemesIdLikes;
api.memesIdLikesId.config = ConfigMemesIdLikesId;

beforeEach(() => {
  asMockedNextApiMiddleware(wrapHandler);
  mockedIsMemeLiked.mockReturnValue(Promise.resolve(false));
  mockedGetMemes.mockReturnValue(Promise.resolve([]));
  mockedGetMemeLikesUserIds.mockReturnValue(Promise.resolve([]));
  mockedIsMemeLiked.mockReturnValue(Promise.resolve(false));
  mockedSearchMemes.mockReturnValue(Promise.resolve([]));
  mockedCreateMeme.mockReturnValue(Promise.resolve({} as unknown as PublicMeme));
});

describe('api/v1/memes', () => {
  describe('/ [GET]', () => {
    it('returns memes', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.memes,
        test: async ({ fetch }) => {
          const json = await fetch({ headers: { KEY } }).then((r) => r.json());

          expect(json.success).toBeTrue();
          expect(json.memes).toBeArray();
        }
      });
    });

    it('supports pagination', async () => {
      expect.hasAssertions();

      await testApiHandler({
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.memes,
        test: async ({ fetch }) => {
          const json = await fetch().then((r) => r.json());

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
        handler: api.memes,
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
    it('accepts a new meme schema; returns a meme', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.memes,
        test: async ({ fetch }) => {
          expect(
            await fetch({
              method: 'POST',
              headers: { KEY, 'content-type': 'application/json' },
              body: JSON.stringify({})
            }).then(async (r) => [r.status, await r.json()])
          ).toStrictEqual([200, expect.objectContaining({ meme: expect.anything() })]);
        }
      });
    });
  });

  describe('/:meme_id1/:meme_id2/.../:meme_idN [GET]', () => {
    it('accepts multiple meme_ids; returns memes', async () => {
      expect.hasAssertions();

      const items = [
        [new ObjectId().toString()],
        [new ObjectId().toString(), new ObjectId().toString()]
      ];

      const params = { meme_ids: [] as string[] };

      await testApiHandler({
        params,
        handler: api.memesIds,
        test: async ({ fetch }) => {
          // ? fetch is async, so to use params we need to wait
          for (const item of items) {
            params.meme_ids = item;

            mockedGetMemes.mockReturnValue(
              Promise.resolve(params.meme_ids) as unknown as ReturnType<
                typeof mockedGetMemes
              >
            );

            expect(await fetch({ headers: { KEY } }).then((r) => r.json())).toStrictEqual(
              { success: true, memes: expect.any(Array) }
            );
          }
        }
      });
    });

    it('errors if getMemes returns a different number of memes than requested', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { meme_ids: [new ObjectId().toString()] },
        handler: api.memesIds,
        test: async ({ fetch }) => {
          mockedGetMemes.mockReturnValue(
            Promise.resolve([]) as unknown as ReturnType<typeof mockedGetMemes>
          );

          expect(await fetch().then((r) => r.status)).toStrictEqual(404);
        }
      });
    });

    it('errors if invalid meme_ids given', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { meme_ids: ['invalid-id'] },
        handler: api.memesIds,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toStrictEqual(
            400
          );
        }
      });
    });
  });

  describe('/:meme_id1/:meme_id2/.../:meme_idN [PUT]', () => {
    it('accepts multiple meme_ids', async () => {
      expect.hasAssertions();

      const items = [
        [new ObjectId().toString()],
        [new ObjectId().toString(), new ObjectId().toString()]
      ];

      items.push([items[0][0], items[0][0]]);

      const params = { meme_ids: [] as string[] };

      await testApiHandler({
        params,
        handler: api.memesIds,
        test: async ({ fetch }) => {
          // ? fetch is async, so to use params we need to wait
          for (const item of items) {
            params.meme_ids = item;

            const json = await fetch({ method: 'PUT', headers: { KEY } }).then((r) =>
              r.json()
            );

            expect(json.success).toBeTrue();
          }
        }
      });
    });

    it('errors if invalid meme_ids given', async () => {
      expect.hasAssertions();

      await testApiHandler({
        params: { meme_ids: ['invalid-id'] },
        handler: api.memesIds,
        test: async ({ fetch }) => {
          expect(
            await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
          ).toStrictEqual(400);
        }
      });
    });
  });

  describe('/:meme_id/likes [GET]', () => {
    it('accepts meme_id and returns user_ids; errors if invalid meme_id given', async () => {
      expect.hasAssertions();

      const factory = itemFactory([
        [{ meme_id: 'invalid-id' }, 400],
        [{ meme_id: new ObjectId().toString() }, 200]
      ]);

      const params = { meme_id: '' };

      await testApiHandler({
        params,
        handler: api.memesIdLikes,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch(expectedStatus != 200 ? { headers: { KEY } } : {}).then(
                async (r) => [r.status, await r.json()]
              )
            ).toStrictEqual([
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

      await testApiHandler<{ success: boolean; users: PublicUser[] }>({
        params: { meme_id: new ObjectId().toString() },
        requestPatcher: (req) => (req.url = `/?after=${new ObjectId()}`),
        handler: api.memesIdLikes,
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
        params: { meme_id: new ObjectId().toString() },
        handler: api.memesIdLikes,
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

  describe('/:meme_id/likes/:user_id [GET]', () => {
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
        handler: api.memesIdLikesId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(await fetch().then((r) => r.status)).toStrictEqual(expectedStatus);
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
        handler: api.memesIdLikesId,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.status)).toStrictEqual(
            404
          );
        }
      });
    });
  });

  describe('/:meme_id/likes/:user_id [DELETE]', () => {
    it('accepts meme_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

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
        handler: api.memesIdLikesId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'DELETE', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/:meme_id/likes/:user_id [PUT]', () => {
    it('accepts meme_id and user_id; errors if invalid IDs given', async () => {
      expect.hasAssertions();

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
        handler: api.memesIdLikesId,
        test: async ({ fetch }) => {
          for (const [expectedParams, expectedStatus] of factory) {
            Object.assign(params, expectedParams);
            expect(
              await fetch({ method: 'PUT', headers: { KEY } }).then((r) => r.status)
            ).toStrictEqual(expectedStatus);
          }
        }
      });
    });
  });

  describe('/search [GET]', () => {
    it('accepts various query params with pagination; returns memes', async () => {
      expect.hasAssertions();

      const encoded = encodeURIComponent(JSON.stringify({}));
      const factory = itemFactory([
        `/?after=${new ObjectId()}`,
        `/?match=${encoded}`,
        `/?regexMatch=${encoded}`,
        `/?match=${encoded}&regexMatch=${encoded}`,
        `/?match=${encoded}&regexMatch=${encoded}&after=${new ObjectId()}`,
        `/?dne=123`,
        `/`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        handler: api.memesSearch,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch({ headers: { KEY } }).then((r) => r.status);
            })
          );

          expect(responses).toStrictEqual(
            Array.from({ length: factory.count }).map(() => 200)
          );
        }
      });
    });

    it('handles invalid query params', async () => {
      expect.hasAssertions();

      const encoded = encodeURIComponent(JSON.stringify({}));
      const factory = itemFactory([
        `/?after=xyz`,
        `/?match={abc:123}`,
        `/?regexMatch={abc:123}`,
        `/?match={abc:123}&regexMatch=${encoded}`,
        `/?match=${encoded}&regexMatch={abc:123}&after=${new ObjectId()}`
      ]);

      await testApiHandler({
        requestPatcher: (req) => (req.url = factory()),
        handler: api.memesSearch,
        test: async ({ fetch }) => {
          const responses = await Promise.all(
            Array.from({ length: factory.count }).map((_) => {
              return fetch().then((r) => r.status);
            })
          );

          expect(responses).toStrictEqual(
            Array.from({ length: factory.count }).map(() => 400)
          );
        }
      });
    });
  });
});
