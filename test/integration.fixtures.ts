import { name as pkgName } from 'package';
import { ObjectId } from 'mongodb';
import { toss } from 'toss-expression';
import { dummyDbData } from 'testverse/db';
import { GuruMeditationError } from 'universe/backend/error';
import { getEnv } from 'universe/backend/env';
import debugFactory from 'debug';
import { toPublicMeme } from './setup';

import type { PatchUser, PublicMeme, PublicUser } from 'types/global';
import type { NextApiHandler, PageConfig } from 'next';
import type { Promisable } from 'type-fest';

// TODO: XXX: turn a lot of this into some kind of package; needs to be generic
// TODO: XXX: enough to handle various use cases though :) Maybe
// TODO: XXX: @xunnamius/test-factory for the generic version, along with
// TODO: XXX: @xunnamius/test-factory-next, @xunnamius/test-factory-next-api (below),
// TODO: XXX: @xunnamius/test-factory-X plugins

// TODO: XXX: add an `id` param that allows getResultAt using that `id` (along with
// TODO: XXX: index)

// TODO: XXX: document functionality: RUN_ONLY='#, ##,###,...'
// TODO: XXX: "fail fast" should be optional

const debug = debugFactory(`${pkgName}:integration-fixtures`);

export type NextApiHandlerMixin = NextApiHandler<unknown> & {
  config?: PageConfig;
  url?: string;
};

/**
 * A single test result stored in `memory`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TestResult<T = any> = {
  status: number;
  json: T | undefined;
};

/**
 * Stored results from past fixtures runs made available for future fixtures
 * runs via `memory`.
 */
export type TestResultset = TestResult[] & {
  /**
   * A property containing a mapping between optional test ids and their
   * results.
   */
  idMap: Record<string, TestResult>;
  /**
   * A property containing the most previous resultset.
   */
  latest: TestResult;
  /**
   * Get the HTTP response status and json result from previously run tests by
   * index. You can pass a negative index to begin counting backwards from the
   * current test. Tests are zero-indexed, i.e. use `getResultAt(0)` to refer to
   * the very first resultset. `getResultAt(1)` will return the second
   * resultset. `getResultAt(-1)` will return the immediately previous resultset
   * (same as what the `latest` property returns).
   *
   * @param index Specify a previous test result index starting at 1 (not zero!)
   */
  getResultAt<T = unknown>(index: number): TestResult<T>;
  getResultAt<T = unknown>(index: number, prop: string): T;
  getResultAt<T = unknown>(index: string): TestResult<T>;
  getResultAt<T = unknown>(index: string, prop: string): T;
};

/**
 * Represents a test that executes an HTTP request and evaluate the response
 * for correctness.
 */
export type TestFixture = {
  /**
   * An optional id that can be used to reference the result from this fixture
   * directly as opposed to by index.
   *
   * @example getResultAt('my-id') === getResultAt(22)
   */
  id?: string;
  /**
   * The test index X (as in "#X") that is reported to the user when a test
   * fails.
   */
  displayIndex: number;
  /**
   * A very brief couple of words added to the end of the test title.
   */
  subject?: string;
  /**
   * The handler under test.
   */
  handler?: NextApiHandlerMixin;
  /**
   * The method of the mock request.
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /**
   * Represents mock "processed" dynamic route components and query params.
   */
  params?:
    | Record<string, string | string[]>
    | ((prevResults: TestResultset) => Promisable<Record<string, string | string[]>>);
  /**
   * The body of the mock request. Automatically stringified.
   */
  body?:
    | Record<string, unknown>
    | ((prevResults: TestResultset) => Promisable<Record<string, unknown>>);
  /**
   * The expected shape of the HTTP response.
   */
  response?: {
    /**
     * The expected response status. If status != 200, we expect `json.success`
     * to be `false`. Otherwise, we expect it to be `true`. All status-related
     * checks are skipped if if a callback is provided that returns `undefined`.
     */
    status?:
      | number
      | ((status: number, prevResults: TestResultset) => Promisable<number | undefined>);
    /**
     * The expected JSON response body. No need to test for `success` as that is
     * handled automatically (unless a status callback was used and it returned
     * `undefined`). Jest async matchers are also supported. All json-related
     * checks are skipped if a callback is provided that returns `undefined` or
     * `json` itself is `undefined`.
     */
    json?:
      | Record<string, unknown>
      | jest.AsymmetricMatcher
      | ((
          json: Record<string, unknown> | undefined,
          prevResults: TestResultset
        ) => Promisable<Record<string, unknown> | jest.AsymmetricMatcher | undefined>);
  };
};

export async function getFixtures(
  api: Record<string, NextApiHandlerMixin>
): Promise<TestFixture[]> {
  const initialMemeCount = dummyDbData.memes.length;
  const initialUserCount = dummyDbData.users.length;

  const runOnly = process.env.RUN_ONLY?.split(',')
    .flatMap((n) => {
      const range = n
        .split('-')
        .map((m) => parseInt(m))
        .filter((m) => !Number.isNaN(m));

      const min = Math.min(...range);
      const max = Math.max(...range);

      debug(`min: ${min}`);
      debug(`max: ${max}`);
      debug(`range: ${range}`);

      if (!(0 < min && min <= max && max < Infinity)) {
        throw new GuruMeditationError(`invalid RUN_ONLY range "${min}-${max}"`);
      } else {
        const finalRange = Array.from({ length: max - min + 1 }).map(
          (_, ndx) => min + ndx
        );
        debug(`final range: ${finalRange}`);
        return finalRange;
      }
    })
    .sort((a, b) => a - b);

  const fixtures: Omit<TestFixture, 'displayIndex'>[] = [
    {
      subject: 'get metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalMemes: initialMemeCount, totalUsers: initialUserCount }
      }
    },
    {
      id: 'user-hillary',
      subject: 'valid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Hillary Clinton',
        email: 'h@hillaryclinton.com',
        phone: '773-555-7777',
        username: 'the-hill',
        imageBase64: null
      },
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Hillary Clinton',
            email: 'h@hillaryclinton.com',
            phone: '773-555-7777',
            username: 'the-hill',
            friends: 0,
            liked: 0,
            deleted: false,
            imageUrl: null
          } as PublicUser
        }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalMemes: initialMemeCount, totalUsers: initialUserCount + 1 }
      }
    },
    {
      subject: 'fetch created user',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'GET',
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Hillary Clinton',
            email: 'h@hillaryclinton.com',
            phone: '773-555-7777',
            username: 'the-hill',
            friends: 0,
            liked: 0,
            deleted: false,
            imageUrl: null
          } as PublicUser
        }
      }
    },
    {
      id: 'user-test-1',
      subject: 'valid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '123-555-6666',
        username: 'test-user-1',
        imageBase64: null
      },
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Test User',
            email: 'test@test.com',
            phone: '123-555-6666',
            username: 'test-user-1',
            friends: 0,
            liked: 0,
            deleted: false,
            imageUrl: null
          } as PublicUser
        }
      }
    },
    {
      id: 'user-test-2',
      subject: 'valid create user',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'test2@test.com',
        phone: '555-666-7777',
        username: 'test-user-2',
        imageBase64: null
      },
      response: {
        status: 200,
        json: {
          user: {
            user_id: expect.any(String),
            name: 'Test User 2',
            email: 'test2@test.com',
            phone: '555-666-7777',
            username: 'test-user-2',
            friends: 0,
            liked: 0,
            deleted: false,
            imageUrl: null
          } as PublicUser
        }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalMemes: initialMemeCount, totalUsers: initialUserCount + 3 }
      }
    },
    {
      subject: 'invalid create user (username uniqueness upheld if mixed-case)',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Hillary Clinton',
        email: 'hXYZ@hillaryclinton.com',
        phone: '377-765-6654',
        username: 'THe-HIll',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that username') }
      }
    },
    {
      subject: 'invalid create user (email uniqueness upheld if mixed-case)',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Hillary Clinton',
        email: 'H@HILLARYclinton.com',
        phone: '377-765-6654',
        username: 'the-other-hill',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    },
    {
      subject: 'invalid create user #1',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User A',
        email: 'testA@test.com',
        phone: '555-000-1111',
        username: 'test-user-A'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('imageBase64') }
      }
    },
    {
      subject: 'invalid create user #2',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User A',
        email: 'testA@test.com',
        phone: '555-000-1111',
        username: 'test-user-A',
        imageBase64: ''
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('imageBase64') }
      }
    },
    {
      subject: 'invalid create user #3',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'test2@test.com',
        phone: '555-666-7777',
        username: 'test-user-2',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that username') }
      }
    },
    {
      subject: 'invalid create user #4',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'test2@test.com',
        phone: '555-666-7777',
        username: 'test-user-X',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    },
    {
      subject: 'invalid create user #5',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'testXXX@aol.com',
        phone: '555-666-7777',
        username: 'test-user-X',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that phone number') }
      }
    },
    {
      subject: 'invalid create user #6',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2!',
        email: 'testXXX@aol.com',
        phone: '555-666-7777',
        username: 'test-user-X'
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('alphanumeric') }
      }
    },
    {
      subject: 'invalid create user #7',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 400,
        json: { error: expect.stringContaining('`name`') }
      }
    },
    {
      subject: 'invalid create user #8',
      handler: api.users,
      method: 'POST',
      // @ts-expect-error: purposely using bad type here
      body: 'text',
      response: {
        status: 400,
        json: { error: expect.stringContaining('JSON') }
      }
    },
    {
      subject: 'invalid create user #9',
      handler: api.users,
      method: 'POST',
      body: {
        name: 'Test User 2',
        email: 'test2@test.com',
        phone: '555-666-7777',
        username: 'test-user-2',
        imageBase64: (await import('testverse/images')).image13MB
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('JSON') }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalMemes: initialMemeCount, totalUsers: initialUserCount + 3 }
      }
    },
    {
      subject: 'users returned in LIFO order',
      handler: api.users,
      method: 'GET',
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          const users =
            (json?.users as PublicUser[]) ||
            toss(new GuruMeditationError('missing "users" in result'));

          expect(users[0]).toStrictEqual({
            user_id: getResultAt<string>('user-test-2', 'user.user_id'),
            name: 'Test User 2',
            email: 'test2@test.com',
            phone: '555-666-7777',
            username: 'test-user-2',
            friends: 0,
            liked: 0,
            deleted: false,
            imageUrl: null
          });

          expect(users[1]).toStrictEqual({
            user_id: getResultAt<string>('user-test-1', 'user.user_id'),
            name: 'Test User',
            email: 'test@test.com',
            phone: '123-555-6666',
            username: 'test-user-1',
            friends: 0,
            liked: 0,
            deleted: false,
            imageUrl: null
          });

          expect(users[2]).toStrictEqual({
            user_id: getResultAt<string>('user-hillary', 'user.user_id'),
            name: 'Hillary Clinton',
            email: 'h@hillaryclinton.com',
            phone: '773-555-7777',
            username: 'the-hill',
            friends: 0,
            liked: 0,
            deleted: false,
            imageUrl: null
          });

          return undefined;
        }
      }
    },
    {
      subject: 'fetch invalid user',
      handler: api.usersId,
      params: { user_id: 'blah-blah-blah' },
      method: 'GET',
      response: {
        status: 404,
        json: { error: expect.stringContaining('"blah-blah-blah" was not found') }
      }
    },
    {
      subject: 'fetch non-existent user',
      handler: api.usersId,
      params: { user_id: new ObjectId().toHexString() },
      method: 'GET',
      response: {
        status: 404,
        json: { error: expect.stringContaining('was not found') }
      }
    },
    {
      subject: 'valid delete user',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'DELETE',
      response: { status: 200 }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalMemes: initialMemeCount, totalUsers: initialUserCount + 2 }
      }
    },
    {
      subject: 'get deleted user',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'GET',
      response: {
        status: 200,
        json: { user: expect.objectContaining({ deleted: true }) }
      }
    },
    {
      subject: 'delete deleted user (noop)',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-hillary', 'user.user_id')
      }),
      method: 'DELETE',
      response: { status: 200 }
    },
    {
      subject: 'deleted user no longer listed',
      handler: api.users,
      method: 'GET',
      response: {
        status: 200,
        json: { users: expect.not.objectContaining([{ email: 'h@hillaryclinton.com' }]) }
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalMemes: initialMemeCount, totalUsers: initialUserCount + 2 }
      }
    },
    {
      subject: 'new user properties (without imageBase64)',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        name: 'Elizabeth Warren',
        email: 'liz@ewarren.com',
        phone: '978-555-5555'
      } as PatchUser,
      response: { status: 200 }
    },
    {
      subject: 'new user properties (with imageBase64)',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        name: 'Elizabeth Warren',
        email: 'liz@ewarren.com',
        phone: '978-555-5555',
        imageBase64: (await import('testverse/images')).image17KB
      } as PatchUser,
      response: { status: 200 }
    },
    {
      subject: "can't change username",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        username: 'ewarren',
        name: 'Elizabeth Warren',
        email: 'liz@ewarren.com',
        phone: '978-555-5555',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('unexpected properties') }
      }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        email: 'test2@test.com',
        name: 'Elizabeth Warren',
        phone: '978-555-5555',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        email: 'h@hillaryclinton.com',
        name: 'Elizabeth Warren',
        phone: '978-555-5555',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    },
    {
      subject: "can't circumvent uniqueness constraint",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        name: 'Elizabeth Warren',
        phone: '555-666-7777',
        email: 'fake@email.com',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that phone number') }
      }
    },
    {
      subject: "can't upload image that's too big",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        name: 'Elizabeth Warren',
        email: 'liz@ewarren.com',
        phone: '978-555-5555',
        imageBase64: (await import('testverse/images')).image13MB
      } as PatchUser,
      response: { status: 200 }
    },
    {
      subject: "can't use invalid base64",
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        name: 'Elizabeth Warren',
        email: 'liz@ewarren.com',
        phone: '978-555-5555',
        imageBase64: 'bad-base64'
      } as PatchUser,
      response: { status: 200 }
    },
    {
      subject: 'get user like count',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'GET',
      response: {
        status: 200,
        json: {
          user: expect.objectContaining({ liked: 0 })
        }
      }
    },
    {
      id: 'meme-user-test-1',
      subject: 'valid create meme',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 200,
        json: (_, { getResultAt }) => ({
          meme: {
            meme_id: expect.any(String),
            owner: getResultAt<string>('user-test-1', 'user.user_id'),
            receiver: null,
            createdAt: expect.any(Number),
            expiredAt: 123,
            description: 'Hello, meme world!',
            likes: 0,
            private: true,
            replyTo: null,
            imageUrl: null
          }
        })
      }
    },
    {
      subject: 'confirm metadata',
      handler: api.info,
      method: 'GET',
      response: {
        status: 200,
        json: { totalMemes: initialMemeCount + 1, totalUsers: initialUserCount + 2 }
      }
    },
    {
      subject: 'invalid create meme #1',
      handler: api.memes,
      method: 'POST',
      body: {
        owner: '60d6501dc703d70008603dc9',
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      },
      response: {
        status: 404,
        json: {
          error: expect.stringContaining('"60d6501dc703d70008603dc9" was not found')
        }
      }
    },
    {
      subject: 'invalid create meme #2',
      handler: api.memes,
      method: 'POST',
      body: {
        owner: 'bad-key',
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('invalid') }
      }
    },
    {
      subject: 'invalid create meme #3',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: '60d6501dc703d70008603dc9',
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 404,
        json: {
          error: expect.stringContaining('"60d6501dc703d70008603dc9" was not found')
        }
      }
    },
    {
      subject: 'invalid create meme #4',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: 'bad-key',
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('invalid') }
      }
    },
    {
      subject: 'invalid create meme #5',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: '60d6501dc703d70008603dc9',
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 404,
        json: {
          error: expect.stringContaining('"60d6501dc703d70008603dc9" was not found')
        }
      }
    },
    {
      subject: 'invalid create meme #6',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: 'bad-key',
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('invalid') }
      }
    },
    {
      subject: 'invalid create meme #7',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: '',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('non-zero') }
      }
    },
    {
      subject: 'invalid create meme #8',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: null,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('must be a number') }
      }
    },
    {
      subject: 'invalid create meme #9',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: ''
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('imageBase64') }
      }
    },
    {
      subject: 'invalid create meme #10',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: null,
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('cannot create an empty meme') }
      }
    },
    {
      subject: 'invalid create meme #11',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: null,
        private: true,
        replyTo: null,
        imageUrl: '',
        imageBase64: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('cannot create an empty meme') }
      }
    },
    {
      subject: 'invalid create meme #12',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: Array.from({ length: 501 }).map((_) => 'x'),
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('<= 500') }
      }
    },
    {
      subject: 'invalid create meme #13',
      handler: api.memes,
      method: 'POST',
      body: ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null,
        extra: 'prop'
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('unexpected properties') }
      }
    },
    {
      subject: 'invalid create meme #14',
      handler: api.memes,
      method: 'POST',
      body: {
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('`owner`') }
      }
    },
    {
      subject: 'invalid create meme #15',
      handler: api.memes,
      method: 'POST',
      body: {
        owner: '',
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('`owner`') }
      }
    },
    {
      subject: 'invalid create meme #16',
      handler: api.memes,
      method: 'POST',
      body: async ({ getResultAt }) => ({
        owner: getResultAt<string>('user-test-1', 'user.user_id'),
        receiver: null,
        expiredAt: 123,
        description: 'Hello, meme world!',
        private: true,
        replyTo: null,
        imageUrl: null,
        imageBase64: (await import('testverse/images')).image13MB
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('`owner`') }
      }
    },
    {
      subject: 'like meme',
      handler: api.memesIdLikesId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'like liked meme (noop)',
      handler: api.memesIdLikesId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'confirm user liked count',
      handler: api.usersId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json) => {
          expect((json?.user as PublicUser).liked).toBe(1);
          return undefined;
        }
      }
    },
    {
      subject: 'confirm meme likes count',
      handler: api.memesIds,
      method: 'GET',
      params: ({ getResultAt }) => ({
        meme_ids: [getResultAt<string>('meme-user-test-1', 'meme.meme_id')]
      }),
      response: {
        status: 200,
        json: (json) => {
          const memes = json?.memes as PublicMeme[];
          expect(memes).toBeArrayOfSize(1);
          expect(memes[0]).toStrictEqual(expect.objectContaining({ likes: 1 }));
          return undefined;
        }
      }
    },
    {
      subject: 'get liked memes',
      handler: api.usersIdLiked,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.memes as string[]).toStrictEqual([
            getResultAt<string>('meme-user-test-1', 'meme.meme_id')
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'memes-is-liked endpoint 200s',
      handler: api.memesIdLikesId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'users-liked-meme endpoint 200s',
      handler: api.usersIdLikedId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'get users who liked meme',
      handler: api.memesIdLikes,
      method: 'GET',
      params: ({ getResultAt }) => ({
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.users).toStrictEqual([
            getResultAt<string>('user-test-1', 'user.user_id')
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'unlike meme',
      handler: api.memesIdLikesId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'unlike unliked meme (noop)',
      handler: api.memesIdLikesId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'get users who liked meme',
      handler: api.memesIdLikes,
      method: 'GET',
      params: ({ getResultAt }) => ({
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: {
        status: 200,
        json: { users: [] }
      }
    },
    {
      subject: 'memes-is-liked endpoint 404s',
      handler: api.memesIdLikesId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'users-liked-meme endpoint 404s',
      handler: api.usersIdLikedId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'confirm user liked count',
      handler: api.usersId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json) => {
          expect((json?.user as PublicUser).liked).toBe(0);
          return undefined;
        }
      }
    },
    {
      subject: 'confirm meme likes counts',
      handler: api.memesIds,
      method: 'GET',
      params: ({ getResultAt }) => ({
        meme_ids: [getResultAt<string>('meme-user-test-1', 'meme.meme_id')]
      }),
      response: {
        status: 200,
        json: (json) => {
          const memes = json?.memes as PublicMeme[];
          expect(memes).toBeArrayOfSize(1);
          expect(memes[0]).toStrictEqual(expect.objectContaining({ likes: 0 }));
          return undefined;
        }
      }
    },
    {
      subject: 'get liked memes',
      handler: api.usersIdLiked,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: { memes: [] }
      }
    },
    {
      subject: 'is-friend endpoint 404s',
      handler: api.usersIdFriendsId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'friend user',
      handler: api.usersIdFriendsId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'friend friended user (noop)',
      handler: api.usersIdFriendsId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'cannot friend self',
      handler: api.usersIdFriendsId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 400,
        json: {
          error: expect.stringContaining('cannot friend themselves')
        }
      }
    },
    {
      subject: 'is-friend endpoint 200s',
      handler: api.usersIdFriendsId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'confirm friended count',
      handler: api.usersId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json) => {
          expect((json?.user as PublicUser).friends).toBe(1);
          return undefined;
        }
      }
    },
    {
      subject: 'get friended users',
      handler: api.usersIdFriends,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.users as string[]).toStrictEqual([
            getResultAt<string>('user-test-2', 'user.user_id')
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'unfriend user',
      handler: api.usersIdFriendsId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'unfriend unfriended user (noop)',
      handler: api.usersIdFriendsId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'is-friend endpoint 404s',
      handler: api.usersIdFriendsId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        friend_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'confirm friended count',
      handler: api.usersId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: (json) => {
          expect((json?.user as PublicUser).friends).toBe(0);
          return undefined;
        }
      }
    },
    {
      subject: 'get friended users',
      handler: api.usersIdFriends,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 200,
        json: { users: [] }
      }
    },
    {
      subject: 'incoming-request endpoint 404s',
      handler: api.usersIdRequestsTypeId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'add incoming-request',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'add added incoming-request (noop)',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'cannot send request to self',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 400,
        json: {
          error: expect.stringContaining('friend request to themselves')
        }
      }
    },
    {
      subject: 'incoming-request endpoint 200s',
      handler: api.usersIdRequestsTypeId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'get incoming-requests',
      handler: api.usersIdRequestsType,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming'
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.users as string[]).toStrictEqual([
            getResultAt<string>('user-test-2', 'user.user_id')
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'remove incoming-request',
      handler: api.usersIdRequestsTypeId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'remove removed incoming-request (noop)',
      handler: api.usersIdRequestsTypeId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'incoming-request endpoint 404s',
      handler: api.usersIdRequestsTypeId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'get incoming-requests',
      handler: api.usersIdRequestsType,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'incoming'
      }),
      response: {
        status: 200,
        json: { users: [] }
      }
    },
    {
      subject: 'outgoing-request endpoint 404s',
      handler: api.usersIdRequestsTypeId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'add outgoing-request',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'add added outgoing-request (noop)',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'cannot send request to self',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      response: {
        status: 400,
        json: {
          error: expect.stringContaining('friend request to themselves')
        }
      }
    },
    {
      subject: 'outgoing-request endpoint 200s',
      handler: api.usersIdRequestsTypeId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'get outgoing-requests',
      handler: api.usersIdRequestsType,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing'
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.users as string[]).toStrictEqual([
            getResultAt<string>('user-test-2', 'user.user_id')
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'remove outgoing-request',
      handler: api.usersIdRequestsTypeId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'remove removed outgoing-request (noop)',
      handler: api.usersIdRequestsTypeId,
      method: 'DELETE',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 200 }
    },
    {
      subject: 'outgoing-request endpoint 404s',
      handler: api.usersIdRequestsTypeId,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing',
        target_id: getResultAt<string>('user-test-2', 'user.user_id')
      }),
      response: { status: 404 }
    },
    {
      subject: 'get outgoing-requests',
      handler: api.usersIdRequestsType,
      method: 'GET',
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id'),
        request_type: 'outgoing'
      }),
      response: {
        status: 200,
        json: { users: [] }
      }
    },
    {
      subject: 'pagination',
      handler: api.memes,
      method: 'GET',
      params: {
        after: dummyDbData.memes[29]._id.toHexString()
      },
      response: {
        status: 200,
        json: (json) => {
          expect((json?.memes as PublicMeme[])[0].meme_id).toEqual(
            dummyDbData.memes[28]._id.toHexString()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'page size = max id count',
      handler: api.memesIds,
      method: 'GET',
      params: {
        meme_ids: Array.from({ length: getEnv().RESULTS_PER_PAGE + 1 }).map(() =>
          new ObjectId().toHexString()
        )
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('too many') }
      }
    },
    {
      subject: 'LIFO pagination',
      handler: api.memesIdLikes,
      method: 'GET',
      params: {
        meme_id: dummyDbData.memes[29]._id.toHexString(),
        after: dummyDbData.memes[29].likes[0].toHexString()
      },
      response: {
        status: 200,
        json: (json) => {
          expect((json?.users as string[])[0]).toEqual(
            dummyDbData.memes[29].likes[1].toHexString()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'LIFO pagination',
      handler: api.users,
      method: 'GET',
      params: {
        after: dummyDbData.users[4]._id.toHexString()
      },
      response: {
        status: 200,
        json: (json) => {
          expect((json?.users as PublicUser[])[0].user_id).toEqual(
            dummyDbData.users[3]._id.toHexString()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'LIFO pagination',
      handler: api.usersIdLiked,
      method: 'GET',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        after: dummyDbData.users[4].liked[0].toHexString()
      },
      response: {
        status: 200,
        json: (json) => {
          expect((json?.memes as string[])[0]).toEqual(
            dummyDbData.users[4].liked[1].toHexString()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'LIFO pagination',
      handler: api.usersIdFriends,
      method: 'GET',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        after: dummyDbData.users[4].friends[0].toHexString()
      },
      response: {
        status: 200,
        json: (json) => {
          expect((json?.users as string[])[0]).toEqual(
            dummyDbData.users[4].friends[1].toHexString()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'add outgoing-request',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        request_type: 'outgoing',
        target_id: dummyDbData.users[3]._id.toHexString()
      },
      response: { status: 200 }
    },
    {
      subject: 'add another outgoing-request',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        request_type: 'outgoing',
        target_id: dummyDbData.users[2]._id.toHexString()
      },
      response: { status: 200 }
    },
    {
      subject: 'LIFO pagination (outgoing)',
      handler: api.usersIdRequestsType,
      method: 'GET',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        request_type: 'outgoing',
        after: dummyDbData.users[2]._id.toHexString()
      },
      response: {
        status: 200,
        json: { users: [dummyDbData.users[3]._id.toHexString()] }
      }
    },
    {
      subject: 'add incoming-request',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        request_type: 'incoming',
        target_id: dummyDbData.users[3]._id.toHexString()
      },
      response: { status: 200 }
    },
    {
      subject: 'add another incoming-request',
      handler: api.usersIdRequestsTypeId,
      method: 'PUT',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        request_type: 'incoming',
        target_id: dummyDbData.users[2]._id.toHexString()
      },
      response: { status: 200 }
    },
    {
      subject: 'LIFO pagination (incoming)',
      handler: api.usersIdRequestsType,
      method: 'GET',
      params: {
        user_id: dummyDbData.users[4]._id.toHexString(),
        request_type: 'incoming',
        after: dummyDbData.users[2]._id.toHexString()
      },
      response: {
        status: 200,
        json: { users: [dummyDbData.users[3]._id.toHexString()] }
      }
    },
    {
      subject: 'LIFO pagination',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        after: dummyDbData.memes[29]._id.toHexString()
      },
      response: {
        status: 200,
        json: (json) => {
          expect((json?.memes as PublicMeme[])[0].meme_id).toEqual(
            dummyDbData.memes[28]._id.toHexString()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search via match',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({
          description: dummyDbData.memes[0].description || toss(new GuruMeditationError())
        })
      },
      response: {
        status: 200,
        json: (json) => {
          expect((json?.memes as PublicMeme[])[0]?.meme_id).toEqual(
            dummyDbData.memes
              .find((meme) => meme.description == dummyDbData.memes[0].description)
              ?._id.toHexString() || toss(new GuruMeditationError())
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search gt via match',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({ likes: { $gt: 50 } })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(
            (json?.memes as PublicMeme[]).map((meme) => meme.meme_id)
          ).toIncludeSameMembers(
            dummyDbData.memes
              .filter((meme) => meme.totalLikes > 50)
              .map((meme) => meme._id.toHexString())
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search gte via match',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({ likes: { $gte: 25 } })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(
            (json?.memes as PublicMeme[]).map((meme) => meme.meme_id)
          ).toIncludeSameMembers(
            dummyDbData.memes
              .filter((meme) => meme.totalLikes >= 25)
              .map((meme) => meme._id.toHexString())
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search lt via match',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({ likes: { $lt: 75, $gt: 0 } })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(
            (json?.memes as PublicMeme[]).map((meme) => meme.meme_id)
          ).toIncludeSameMembers(
            dummyDbData.memes
              .filter((meme) => meme.totalLikes < 75 && meme.totalLikes > 0)
              .map((meme) => meme._id.toHexString())
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search lte via match',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({ likes: { $lte: 100, $gt: 0 } })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(
            (json?.memes as PublicMeme[]).map((meme) => meme.meme_id)
          ).toIncludeSameMembers(
            dummyDbData.memes
              .filter((meme) => meme.totalLikes <= 100 && meme.totalLikes > 0)
              .map((meme) => meme._id.toHexString())
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search via regexMatch',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        regexMatch: JSON.stringify({ description: '(^| )#[a-z0-9]+\\b' })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(
            (json?.memes as PublicMeme[]).map(({ meme_id }) => meme_id)
          ).toStrictEqual(
            dummyDbData.memes
              .filter(({ description }) => /(^| )#[a-z0-9]+\b/i.test(description || ''))
              .map(({ _id: meme_id }) => meme_id.toHexString())
              .reverse()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search owner user_id via regexMatch',
      handler: api.memesSearch,
      method: 'GET',
      params: ({ getResultAt }) => ({
        regexMatch: JSON.stringify({
          owner: getResultAt<string>('meme-user-test-1', 'meme.owner')
        })
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.memes as PublicMeme[]).toStrictEqual([
            { ...getResultAt<PublicMeme>('meme-user-test-1', 'meme') }
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'search multiple owner user_ids via regexMatch',
      handler: api.memesSearch,
      method: 'GET',
      params: ({ getResultAt }) => ({
        regexMatch: JSON.stringify({
          owner:
            getResultAt<string>('meme-user-test-1', 'meme.owner') +
            '|' +
            dummyDbData.users[0]._id.toHexString()
        })
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.memes as PublicMeme[]).toIncludeSameMembers([
            { ...getResultAt<PublicMeme>('meme-user-test-1', 'meme') },
            ...dummyDbData.memes
              .filter((meme) => meme.owner.equals(dummyDbData.users[0]._id))
              .map((meme) => toPublicMeme(meme))
          ]);
          return undefined;
        }
      }
    },
    {
      subject: 'search replyTo meme_id via regexMatch',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        regexMatch: JSON.stringify({ replyTo: dummyDbData.memes[2].replyTo })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(json?.memes as PublicMeme[]).toStrictEqual(
            dummyDbData.memes
              .filter((meme) => meme.replyTo == dummyDbData.memes[2].replyTo)
              .map((meme) => toPublicMeme(meme))
              .reverse()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search receiver user_id via regexMatch',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        regexMatch: JSON.stringify({ receiver: dummyDbData.memes[3].receiver })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(json?.memes as PublicMeme[]).toStrictEqual(
            dummyDbData.memes
              .filter((meme) => meme.receiver == dummyDbData.memes[3].receiver)
              .map((meme) => toPublicMeme(meme))
              .reverse()
          );
          return undefined;
        }
      }
    },
    {
      subject: 'cannot search meme_ids via match',
      handler: api.memesSearch,
      method: 'GET',
      params: ({ getResultAt }) => ({
        match: JSON.stringify({
          meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
        })
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('illegal id-related specifier') }
      }
    },
    {
      subject: 'cannot search meme_ids via regexMatch',
      handler: api.memesSearch,
      method: 'GET',
      params: ({ getResultAt }) => ({
        regexMatch: JSON.stringify({
          meme_id: getResultAt<string>('meme-user-test-1', 'meme.meme_id')
        })
      }),
      response: {
        status: 400,
        json: { error: expect.stringContaining('illegal id-related specifier') }
      }
    },
    {
      subject: 'search via match and regexMatch',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({
          likes: { $gte: 5 },
          expiredAt: -1
        }),
        regexMatch: JSON.stringify({ description: '\\d\\d' })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(json?.memes as PublicMeme[]).toIncludeSameMembers(
            dummyDbData.memes
              .filter(
                (meme) =>
                  meme.totalLikes >= 5 &&
                  meme.expiredAt == -1 &&
                  /\d\d/.test(meme.description || '')
              )
              .map((meme) => toPublicMeme(meme))
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search via match with two query properties',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({
          likes: { $gte: 5, $lt: 8 },
          expiredAt: -1
        })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(json?.memes as PublicMeme[]).toIncludeSameMembers(
            dummyDbData.memes
              .filter(
                (meme) =>
                  meme.totalLikes >= 5 && meme.totalLikes < 8 && meme.expiredAt == -1
              )
              .map((meme) => toPublicMeme(meme))
          );
          return undefined;
        }
      }
    },
    {
      subject: 'can search via match using null',
      handler: api.memesSearch,
      method: 'GET',
      params: {
        match: JSON.stringify({
          likes: { $gte: 5, $lt: 8 },
          receiver: null,
          expiredAt: -1
        }),
        regexMatch: JSON.stringify({ description: '\\d\\d' })
      },
      response: {
        status: 200,
        json: (json) => {
          expect(json?.memes as PublicMeme[]).toIncludeSameMembers(
            dummyDbData.memes
              .filter(
                (meme) =>
                  meme.totalLikes >= 5 &&
                  meme.totalLikes < 8 &&
                  meme.receiver == null &&
                  meme.expiredAt == -1 &&
                  /\d\d/.test(meme.description || '')
              )
              .map((meme) => toPublicMeme(meme))
          );
          return undefined;
        }
      }
    },
    {
      subject: 'search via match, regexMatch, pagination',
      handler: api.memesSearch,
      method: 'GET',
      params: ({ getResultAt }) => ({
        match: JSON.stringify({
          likes: { $gte: 5, $lt: 8 },
          receiver: null,
          expiredAt: -1
        }),
        regexMatch: JSON.stringify({ description: '\\d\\d' }),
        after: getResultAt<PublicMeme[]>(-1, 'memes')[1].meme_id
      }),
      response: {
        status: 200,
        json: (json, { getResultAt }) => {
          expect(json?.memes as PublicMeme[]).toIncludeSameMembers(
            getResultAt<PublicMeme[]>(-1, 'memes').slice(2)
          );
          return undefined;
        }
      }
    },
    {
      subject: 'not tripped up by uniqueness constraint when trying to modify self (1)',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        email: 'liz@ewarren.com',
        name: 'Elizabeth Warren II',
        phone: '978-555-5555',
        imageBase64: null
      },
      response: { status: 200 }
    },
    {
      subject: 'not tripped up by uniqueness constraint when trying to modify self (2)',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        email: 'liz3@ewarren.com',
        name: 'Elizabeth Warren III',
        phone: '978-555-5555',
        imageBase64: null
      },
      response: { status: 200 }
    },
    {
      subject: 'still catches uniqueness constraint violations',
      handler: api.usersId,
      params: ({ getResultAt }) => ({
        user_id: getResultAt<string>('user-test-1', 'user.user_id')
      }),
      method: 'PUT',
      body: {
        email: 'test2@test.com',
        name: 'Elizabeth Warren III',
        phone: '978-555-5555',
        imageBase64: null
      },
      response: {
        status: 400,
        json: { error: expect.stringContaining('with that email') }
      }
    }
  ];

  // TODO: XXX: ability to specify "depends" via index or name/id

  const filteredFixtures = fixtures.filter<TestFixture>(
    (test, ndx): test is TestFixture => {
      const displayIndex = ndx + 1;
      if (runOnly && !runOnly.includes(displayIndex)) return false;
      (test as TestFixture).displayIndex = !runOnly
        ? displayIndex
        : runOnly.shift() ?? toss(new GuruMeditationError('ran out of RUN_ONLY indices'));
      return true;
    }
  );

  // TODO: XXX: with @xunnamius/fable, have an "every X" type construct (the below is "every 10")
  // TODO: XXX: also allow middleware
  for (let i = 9; i < filteredFixtures.length; i += 10) {
    filteredFixtures.splice(i, 0, {
      displayIndex: -1,
      subject: 'handle contrived',
      handler: api.users,
      method: 'POST',
      body: {},
      response: {
        status: 555,
        json: { error: expect.stringContaining('contrived') }
      }
    });
  }

  return filteredFixtures;
}
