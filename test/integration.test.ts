/* eslint-disable jest/require-hook */
import { testApiHandler } from 'next-test-api-route-handler';
import { get as dotPath } from 'dot-prop';
import { toss } from 'toss-expression';
import { GuruMeditationError } from 'universe/backend/error';
import { mockEnvFactory } from 'testverse/setup';
import { setupTestDb } from 'testverse/db';
import { getFixtures } from 'testverse/integration.fixtures';
import { BANNED_KEY, DUMMY_KEY } from 'universe/backend';

import EndpointMemes, { config as ConfigMemes } from 'universe/pages/api/v1/memes';
import EndpointUsers, { config as ConfigUsers } from 'universe/pages/api/v1/users';
import EndpointInfo, { config as ConfigInfo } from 'universe/pages/api/v1/info';

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

import EndpointUsersId, {
  config as ConfigUsersId
} from 'universe/pages/api/v1/users/[user_id]';

import EndpointUsersIdFriends, {
  config as ConfigUsersIdFriends
} from 'universe/pages/api/v1/users/[user_id]/friends';

import EndpointUsersIdFriendsId, {
  config as ConfigUsersIdFriendsId
} from 'universe/pages/api/v1/users/[user_id]/friends/[friend_id]';

import EndpointUsersIdLiked, {
  config as ConfigUsersIdLiked
} from 'universe/pages/api/v1/users/[user_id]/liked';

import EndpointUsersIdLikedId, {
  config as ConfigUsersIdLikedId
} from 'universe/pages/api/v1/users/[user_id]/liked/[meme_id]';

import EndpointUsersIdRequestsType, {
  config as ConfigUsersIdRequestsType
} from 'universe/pages/api/v1/users/[user_id]/requests/[request_type]';

import EndpointUsersIdRequestsTypeId, {
  config as ConfigUsersIdRequestsTypeId
} from 'universe/pages/api/v1/users/[user_id]/requests/[request_type]/[target_id]';

import type {
  NextApiHandlerMixin,
  TestResultset,
  TestResult
} from 'testverse/integration.fixtures';

// ? Setup and hydrate the in-memory mongo instance (we're gonna need it)
setupTestDb(true);

const api = {
  info: EndpointInfo as NextApiHandlerMixin,
  memes: EndpointMemes as NextApiHandlerMixin,
  memesIds: EndpointMemesIds as NextApiHandlerMixin,
  memesSearch: EndpointMemesSearch as NextApiHandlerMixin,
  memesIdLikes: EndpointMemesIdLikes as NextApiHandlerMixin,
  memesIdLikesId: EndpointMemesIdLikesId as NextApiHandlerMixin,
  users: EndpointUsers as NextApiHandlerMixin,
  usersId: EndpointUsersId as NextApiHandlerMixin,
  usersIdLiked: EndpointUsersIdLiked as NextApiHandlerMixin,
  usersIdLikedId: EndpointUsersIdLikedId as NextApiHandlerMixin,
  usersIdFriends: EndpointUsersIdFriends as NextApiHandlerMixin,
  usersIdFriendsId: EndpointUsersIdFriendsId as NextApiHandlerMixin,
  usersIdRequestsType: EndpointUsersIdRequestsType as NextApiHandlerMixin,
  usersIdRequestsTypeId: EndpointUsersIdRequestsTypeId as NextApiHandlerMixin
};

api.users.config = ConfigUsers;
api.usersId.config = ConfigUsersId;
api.usersIdLiked.config = ConfigUsersIdLiked;
api.usersIdLikedId.config = ConfigUsersIdLikedId;
api.usersIdFriends.config = ConfigUsersIdFriends;
api.usersIdFriendsId.config = ConfigUsersIdFriendsId;
api.usersIdRequestsType.config = ConfigUsersIdRequestsType;
api.usersIdRequestsTypeId.config = ConfigUsersIdRequestsTypeId;
api.memes.config = ConfigMemes;
api.memesIds.config = ConfigMemesIds;
api.memesSearch.config = ConfigMemesSearch;
api.memesIdLikes.config = ConfigMemesIdLikes;
api.memesIdLikesId.config = ConfigMemesIdLikesId;
api.info.config = ConfigInfo;

api.users.url = '/users';
api.usersId.url = '/users/:user_id';
api.usersIdLiked.url = '/users/:user_id/liked';
api.usersIdLikedId.url = '/users/:user_id/liked/:meme_id';
api.usersIdFriends.url = '/users/:user_id/friends';
api.usersIdFriendsId.url = '/users/:user_id/friends/:friend_id';
api.usersIdRequestsType.url = '/users/:user_id/requests/:request_type';
api.usersIdRequestsTypeId.url = '/users/:user_id/requests/:request_type/:target_id';
api.memes.url = '/memes';
api.memesIds.url = '/memes/:meme_id1/:meme_id2/.../:meme_idN';
api.memesSearch.url = '/memes/search';
api.memesIdLikes.url = '/memes/:meme_id/likes';
api.memesIdLikesId.url = '/memes/:meme_id/likes/:user_id';
api.info.url = '/info';

const withMockedEnv = mockEnvFactory({}, { replace: false });

// ? Memory of the results of past fixture runs.
const memory: TestResultset = [
  { status: Infinity, json: {} }
] as unknown as TestResultset;

memory.latest = memory[0];
memory.getResultAt = () => memory[0];
memory.idMap = {};

// ? Fail fast and early
let lastRunSuccess = true;

describe('generic correctness tests', () => {
  Object.values(api).forEach((endpoint) => {
    it(`${endpoint.url} fails on bad authentication`, async () => {
      expect.hasAssertions();

      await withMockedEnv(
        async () => {
          await testApiHandler({
            handler: endpoint,
            test: async ({ fetch }) => {
              await expect(fetch().then((r) => r.status)).resolves.toBe(401);
            }
          });
        },
        {
          REQUESTS_PER_CONTRIVED_ERROR: '10',
          IGNORE_RATE_LIMITS: 'true'
        }
      );
    });

    it(`${endpoint.url} fails if rate limited`, async () => {
      expect.hasAssertions();

      await withMockedEnv(
        async () => {
          await testApiHandler({
            handler: endpoint,
            test: async ({ fetch }) => {
              await expect(
                fetch({ headers: { key: BANNED_KEY } }).then((r) => r.status)
              ).resolves.toBe(429);
            }
          });
        },
        {
          REQUESTS_PER_CONTRIVED_ERROR: '10',
          IGNORE_RATE_LIMITS: 'false'
        }
      );
    });
  });
});

let countSkippedTests = 0;

afterAll(() => {
  if (countSkippedTests)
    // eslint-disable-next-line no-console
    console.warn(`${countSkippedTests} tests were skipped!`);
});

getFixtures(api).forEach(
  ({ displayIndex, subject, handler, method, response, body, id, params, invisible }) => {
    if (!displayIndex) {
      throw new GuruMeditationError(
        'fixture is missing required property "displayIndex"'
      );
    }

    const shouldSkip =
      !subject ||
      !handler ||
      !method ||
      (!invisible && (!response || typeof response.status != 'number'));

    // eslint-disable-next-line jest/prefer-expect-assertions
    it(`${shouldSkip ? '<SKIPPED> ' : ''}${
      displayIndex <= 0 ? '###' : '#' + displayIndex
    } ${method ? '[' + method + '] ' : ''}${handler?.url ? handler.url + ' ' : ''}${
      subject || ''
    }`, async () => {
      if (shouldSkip || (!lastRunSuccess && process.env.FAIL_FAST)) {
        countSkippedTests++;
        return;
      }

      expect.hasAssertions();
      lastRunSuccess = false;

      memory.getResultAt = <T = unknown>(
        index: number | string,
        prop?: string
      ): TestResult<T> | T => {
        const result: TestResult<T> =
          typeof index == 'string'
            ? memory.idMap[index]
            : memory[index + (index < 0 ? displayIndex : 1)];

        const retval = prop ? dotPath<T>(result?.json, prop) : result;

        if (!result) {
          throw new GuruMeditationError(`no result at index "${index}"`);
        } else if (retval === undefined) {
          throw new GuruMeditationError(
            `${prop ? 'prop path "' + prop + '" ' : ''}return value cannot be undefined`
          );
        }

        return retval;
      };

      const requestParams = typeof params == 'function' ? await params(memory) : params;
      const requestBody = typeof body == 'function' ? await body(memory) : body;

      await withMockedEnv(
        async () => {
          await testApiHandler({
            handler: handler || toss(new GuruMeditationError()),
            params: requestParams,
            requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
            test: async ({ fetch }) => {
              const res = await fetch({
                method: method,
                ...(requestBody
                  ? {
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify(requestBody)
                    }
                  : {})
              });

              const expectedStatus =
                typeof response?.status == 'function'
                  ? await response.status(res.status, memory)
                  : response?.status;

              let json: ReturnType<typeof JSON.parse>;

              try {
                const jsonText = await res.text();
                json = `<invalid JSON>${jsonText}`;
                json = JSON.parse(jsonText);
              } catch {}

              if (expectedStatus) {
                if (res.status != expectedStatus) {
                  // eslint-disable-next-line no-console
                  console.warn('unexpected status for result:', json);
                }

                // eslint-disable-next-line jest/no-conditional-expect
                expect(res.status).toBe(expectedStatus);
                // eslint-disable-next-line jest/no-conditional-expect
                expect(json.success)[res.status == 200 ? 'toBeTrue' : 'toBeFalsy']();
                delete json.success;
              }

              const expectedJson =
                typeof response?.json == 'function'
                  ? await response.json(json, memory)
                  : response?.json;

              if (expectedJson) {
                // eslint-disable-next-line jest/no-conditional-expect
                expect(json).toStrictEqual(expectedJson);
              }

              const memorize = { status: res.status, json } as TestResult;

              if (id) memory.idMap[id] = memorize;
              memory[displayIndex] = memorize;
              memory.latest = memorize;
              lastRunSuccess = true;
            }
          });
        },
        {
          REQUESTS_PER_CONTRIVED_ERROR: '10',
          IGNORE_RATE_LIMITS: 'true'
        }
      );
    });
  }
);
