/* eslint-disable no-await-in-loop */
import { testApiHandler } from 'next-test-api-route-handler';
import { getEnv } from 'universe/backend/env';
import { toss } from 'toss-expression';

import {
  DUMMY_KEY,
  isKeyAuthentic,
  addToRequestLog,
  isDueForContrivedError,
  isRateLimited
} from 'universe/backend';

import {
  wrapHandler,
  defaultConfig as middlewareConfig
} from 'universe/backend/middleware';

import {
  asMockedFunction,
  isolatedImport,
  itemFactory,
  mockEnvFactory
} from 'testverse/setup';

import {
  InvalidIdError,
  InvalidKeyError,
  ValidationError,
  ActivityGenerationError,
  NotAuthorizedError,
  NotFoundError,
  ItemNotFoundError,
  AppError,
  GuruMeditationError,
  ActivitySimulationError
} from 'universe/backend/error';

import type { NextApiRequest, NextApiResponse } from 'next';

jest.mock('universe/backend');

// TODO: XXX: add non-authenticated endpoint support (merge-in from airports api)

const noop = async ({ res }: { res: NextApiResponse }) => res.status(200).send({});

const withMockedEnv = mockEnvFactory(
  {
    REQUESTS_PER_CONTRIVED_ERROR: '0',
    DISABLED_API_VERSIONS: ''
  },
  { replace: false }
);

const wrapMiddlewareHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  const api = async (req: NextApiRequest, res: NextApiResponse) => handler(req, res);
  api.config = middlewareConfig;
  return api;
};

const mockIsKeyAuthentic = asMockedFunction(isKeyAuthentic);
const mockAddToRequestLog = asMockedFunction(addToRequestLog);
const mockIsDueForContrivedError = asMockedFunction(isDueForContrivedError);
const mockIsRateLimited = asMockedFunction(isRateLimited);

beforeEach(() => {
  mockIsKeyAuthentic.mockReturnValue(Promise.resolve(true));
  mockAddToRequestLog.mockReturnValue(Promise.resolve());
  mockIsDueForContrivedError.mockReturnValue(false);
  mockIsRateLimited.mockReturnValue(Promise.resolve({ limited: false, retryAfter: 0 }));
});

describe('::handleEndpoint', () => {
  it('rejects requests that are too big when exporting config', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, { req, res, methods: ['POST'] })
      ),
      test: async ({ fetch }) => {
        expect(
          await fetch({
            method: 'POST',
            body: Array.from({ length: getEnv().MAX_CONTENT_LENGTH_BYTES + 1 })
              .map(() => 'x')
              .join('')
          }).then((r) => r.status)
        ).toStrictEqual(413);
      }
    });
  });

  it('injects contrived errors when due', async () => {
    expect.hasAssertions();

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, {
          req,
          res,
          methods: ['GET', 'POST', 'PUT']
        })
      ),
      test: async ({ fetch }) => {
        expect(
          [
            void mockIsDueForContrivedError.mockReturnValue(false),
            await fetch({ method: 'GET' }).then((r) => r.status),
            void mockIsDueForContrivedError.mockReturnValue(true),
            await fetch({ method: 'POST' }).then((r) => r.status),
            void mockIsDueForContrivedError.mockReturnValue(false),
            await fetch({ method: 'PUT' }).then((r) => r.status)
          ].filter(Boolean)
        ).toStrictEqual([200, 555, 200]);
      }
    });
  });

  it('responds with 501 not implemented if res.send() not called', async () => {
    expect.hasAssertions();

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(async () => undefined, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(501)
    });
  });

  it('responds with 501 not implemented if wrapped handler is undefined', async () => {
    expect.hasAssertions();

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(undefined, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(501)
    });
  });

  it('logs requests properly', async () => {
    expect.hasAssertions();

    const factory = itemFactory<[string, number]>([
      ['GET', 502],
      ['POST', 404],
      ['PUT', 403],
      ['DELETE', 200]
    ]);

    await testApiHandler({
      requestPatcher: (req) => {
        req.headers = {
          ...req.headers,
          'x-forwarded-for': '10.0.0.115',
          key: DUMMY_KEY
        };

        req.url = '/api/v1/handlerX';
      },
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(async ({ res }) => res.status(factory()[1]).send({}), {
          req,
          res,
          methods: factory.items.map(([method]) => method.toString())
        })
      ),
      test: async ({ fetch }) => {
        await Promise.all(
          factory.items.map(([method]) => fetch({ method: method.toString() }))
        );

        expect(mockAddToRequestLog).toBeCalledTimes(factory.count);
      }
    });
  });

  it('sends 405 when encountering unlisted methods', async () => {
    expect.hasAssertions();

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, {
          req,
          res,
          methods: ['POST', 'PUT']
        })
      ),
      test: async ({ fetch }) => {
        expect((await fetch({ method: 'GET' })).status).toStrictEqual(405);
        expect((await fetch({ method: 'POST' })).status).toStrictEqual(200);
        expect((await fetch({ method: 'PUT' })).status).toStrictEqual(200);
        expect((await fetch({ method: 'DELETE' })).status).toStrictEqual(405);
      }
    });
  });

  it('sends 405 when encountering globally disallowed methods', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              req,
              res,
              methods: ['POST', 'PUT', 'GET', 'DELETE']
            })
          ),
          test: async ({ fetch }) => {
            expect((await fetch({ method: 'GET' })).status).toStrictEqual(200);
            expect((await fetch({ method: 'POST' })).status).toStrictEqual(405);
            expect((await fetch({ method: 'PUT' })).status).toStrictEqual(405);
            expect((await fetch({ method: 'DELETE' })).status).toStrictEqual(405);
          }
        });
      },
      { DISALLOWED_METHODS: 'POST,PUT,DELETE' }
    );
  });

  it('ignores spacing when parsing DISALLOWED_METHODS', async () => {
    expect.hasAssertions();

    await withMockedEnv(
      async () => {
        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              req,
              res,
              methods: ['POST', 'PUT', 'GET', 'DELETE']
            })
          ),
          test: async ({ fetch }) => {
            expect((await fetch({ method: 'GET' })).status).toStrictEqual(405);
            expect((await fetch({ method: 'POST' })).status).toStrictEqual(405);
            expect((await fetch({ method: 'PUT' })).status).toStrictEqual(405);
            expect((await fetch({ method: 'DELETE' })).status).toStrictEqual(200);
          }
        });
      },
      { DISALLOWED_METHODS: '  POST , PUT,          GET ' }
    );
  });

  it('sends correct HTTP error codes when certain errors occur', async () => {
    expect.hasAssertions();

    const factory = itemFactory<[AppError, number]>([
      [new InvalidIdError(), 400],
      [new InvalidKeyError(), 400],
      [new ValidationError(), 400],
      [new ValidationError(''), 400], // ! Edge case for code coverage
      [new ActivityGenerationError(), 500],
      [new ActivitySimulationError(), 500],
      [new NotAuthorizedError(), 403],
      [new NotFoundError(), 404],
      [new ItemNotFoundError(), 404],
      [new AppError(), 500],
      [new GuruMeditationError(), 500],
      [new Error(), 500]
    ]);

    let expectedStatus: number;
    let expectedError: AppError;

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(() => toss(expectedError), { req, res, methods: ['GET'] })
      ),
      test: async ({ fetch }) => {
        for (const item of factory) {
          [expectedError, expectedStatus] = item;
          const res = await fetch();
          expect(res.status).toStrictEqual(expectedStatus);
        }
      }
    });
  });

  it('responds properly to unauthenticatable requests', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(async () => undefined, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(401)
    });

    await testApiHandler({
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(401)
    });
  });

  it('treats authenticatable requests as unauthenticatable when locking out all keys', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => {
        await withMockedEnv(
          async () => {
            expect((await fetch({ headers: { key: DUMMY_KEY } })).status).toStrictEqual(
              401
            );
          },
          { LOCKOUT_ALL_KEYS: 'true' }
        );

        await withMockedEnv(
          async () => {
            expect((await fetch({ headers: { key: DUMMY_KEY } })).status).toStrictEqual(
              200
            );
          },
          { LOCKOUT_ALL_KEYS: 'false' }
        );
      }
    });
  });

  it('confirm headers are automatically lowercased', async () => {
    expect.hasAssertions();

    await testApiHandler({
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) =>
        expect(
          (
            await fetch({
              headers: { KEY: DUMMY_KEY }
            })
          ).status
        ).toStrictEqual(200)
    });
  });

  it('requests limited according to database except when ignoring limits', async () => {
    expect.hasAssertions();

    const ip = '7.7.7.7';
    const key = DUMMY_KEY;

    const runTest = async (
      fetch: Parameters<Parameters<typeof testApiHandler>[0]['test']>[0]['fetch']
    ) =>
      [
        void mockIsRateLimited.mockReturnValue(
          Promise.resolve({ limited: false, retryAfter: 0 })
        ),
        await fetch({ headers: { key } }).then(async (r) => [r.status, await r.json()]),
        void mockIsRateLimited.mockReturnValue(
          Promise.resolve({ limited: true, retryAfter: 100 })
        ),
        await fetch({ headers: { key } }).then(async (r) => [r.status, await r.json()])
      ].filter(Boolean);

    await testApiHandler({
      requestPatcher: (req) => (req.headers['x-forwarded-for'] = ip),
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => {
        await withMockedEnv(
          async () => {
            const res = await runTest(fetch);

            expect(res).toStrictEqual([
              [200, {}],
              [
                429,
                expect.objectContaining({
                  retryAfter: 100
                })
              ]
            ]);
          },
          { IGNORE_RATE_LIMITS: 'false' }
        );

        await withMockedEnv(
          async () => {
            const res = await runTest(fetch);

            expect(res).toStrictEqual([
              [200, {}],
              [200, {}]
            ]);
          },
          { IGNORE_RATE_LIMITS: 'true' }
        );
      }
    });
  });

  it('does not respond if its corresponding version is disabled', async () => {
    expect.hasAssertions();

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(noop, {
          apiVersion: 1,
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => {
        await withMockedEnv(
          async () => {
            expect((await fetch()).status).toStrictEqual(404);
          },
          { DISABLED_API_VERSIONS: '1' }
        );

        await withMockedEnv(
          async () => {
            expect((await fetch()).status).toStrictEqual(200);
          },
          { DISABLED_API_VERSIONS: '2' }
        );

        await withMockedEnv(
          async () => {
            expect((await fetch()).status).toStrictEqual(404);
          },
          { DISABLED_API_VERSIONS: '2,1' }
        );

        await withMockedEnv(
          async () => {
            expect((await fetch()).status).toStrictEqual(200);
          },
          { DISABLED_API_VERSIONS: '3,2' }
        );
      }
    });

    await withMockedEnv(
      async () => {
        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              apiVersion: 1,
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(200)
        });

        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              apiVersion: 2,
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(404)
        });

        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              apiVersion: 3,
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(404)
        });

        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              apiVersion: 4,
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(404)
        });

        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(async () => undefined, {
              apiVersion: 4,
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(404)
        });

        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(200)
        });
      },
      { DISABLED_API_VERSIONS: '3,4,2' }
    );

    await withMockedEnv(
      async () => {
        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              apiVersion: 1,
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(200)
        });

        await testApiHandler({
          requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
          handler: wrapMiddlewareHandler((req, res) =>
            wrapHandler(noop, {
              req,
              res,
              methods: ['GET']
            })
          ),
          test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(200)
        });
      },
      { DISABLED_API_VERSIONS: '' }
    );
  });

  it('parses url parameters as expected', async () => {
    expect.hasAssertions();

    await testApiHandler({
      requestPatcher: (req) => {
        req.url = '/?some=url&yes';
        req.headers.key = DUMMY_KEY;
      },
      handler: wrapMiddlewareHandler((req, res) =>
        wrapHandler(
          async ({ req, res }) => {
            expect(req.query).toStrictEqual({ some: 'url', yes: '' });
            res.status(200).send({});
          },
          { req, res, methods: ['GET'] }
        )
      ),
      test: async ({ fetch }) => {
        expect((await fetch()).status).toStrictEqual(200);
      }
    });
  });

  it('handles cors errors gracefully', async () => {
    expect.hasAssertions();

    jest.doMock('cors', () => () => (_: unknown, __: unknown, cb: (e: Error) => void) => {
      return cb(new Error('fake error'));
    });

    let Wrapper = (await isolatedImport(
      'universe/backend/middleware'
    )) as typeof import('universe/backend/middleware');

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        Wrapper.wrapHandler(noop, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => expect((await fetch()).status).toStrictEqual(500)
    });

    jest.dontMock('cors');

    Wrapper = (await isolatedImport(
      'universe/backend/middleware'
    )) as typeof import('universe/backend/middleware');

    await testApiHandler({
      requestPatcher: (req) => (req.headers.key = DUMMY_KEY),
      handler: wrapMiddlewareHandler((req, res) =>
        Wrapper.wrapHandler(noop, {
          req,
          res,
          methods: ['GET']
        })
      ),
      test: async ({ fetch }) => {
        expect((await fetch()).status).toStrictEqual(200);
      }
    });
  });
});
