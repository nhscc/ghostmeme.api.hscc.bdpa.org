import { testApiHandler } from 'next-test-api-route-handler';
import { asMockedFunction, asMockedNextApiMiddleware } from 'testverse/setup';
import { DUMMY_KEY as KEY, getSystemInfo } from 'universe/backend';
import { wrapHandler } from 'universe/backend/middleware';
import EndpointInfo, { config as ConfigInfo } from 'universe/pages/api/v1/info';
import { dummyDbData } from 'testverse/db';

jest.mock('universe/backend');
jest.mock('universe/backend/middleware');

const api = {
  info: EndpointInfo as typeof EndpointInfo & { config?: typeof ConfigInfo }
};

api.info.config = ConfigInfo;

beforeEach(() => {
  asMockedNextApiMiddleware(wrapHandler);
  asMockedFunction(getSystemInfo).mockReturnValue(
    Promise.resolve({
      totalMemes: dummyDbData.memes.length,
      totalUsers: dummyDbData.users.length,
      totalUploads: dummyDbData.uploads.length
    })
  );
});

describe('api/v1/info', () => {
  describe('/ [GET]', () => {
    it('returns summary system metadata', async () => {
      expect.hasAssertions();

      await testApiHandler({
        handler: api.info,
        test: async ({ fetch }) => {
          expect(await fetch({ headers: { KEY } }).then((r) => r.json())).toStrictEqual({
            success: true,
            totalMemes: dummyDbData.memes.length,
            totalUsers: dummyDbData.users.length,
            totalUploads: dummyDbData.uploads.length
          });
        }
      });
    });
  });
});
