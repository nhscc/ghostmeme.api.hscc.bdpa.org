import { setClientAndDb } from 'universe/backend/db';
import { dummyDbData, setupTestDb } from 'testverse/db';
import pruneData from 'externals/prune-data';

import type { InternalRequestLogEntry } from 'types/global';
import type { WithId } from 'mongodb';
import { withMockedEnv } from './setup';

const testCollections = ['request-log', 'limited-log-mview', 'users', 'memes', 'uploads'];

const { getDb, getNewClientAndDb } = setupTestDb();

const countCollection = async (collections: string | string[]) => {
  const result = Object.assign(
    {},
    ...(await Promise.all(
      [collections].flat().map((collection) =>
        getDb().then((db) =>
          db
            .collection<WithId<InternalRequestLogEntry>>(collection)
            .countDocuments()
            .then((count) => ({ [collection]: count }))
        )
      )
    ))
  );

  return Object.keys(result).length == 1
    ? (result[collections.toString()] as number)
    : (result as Record<string, number>);
};

describe('external-scripts/prune-data', () => {
  it('ensures at most PRUNE_DATA_MAX_X entries exist', async () => {
    expect.hasAssertions();

    await expect(countCollection(testCollections)).resolves.toStrictEqual({
      'request-log': dummyDbData.logs.length,
      'limited-log-mview': dummyDbData.bans.length,
      users: dummyDbData.users.length,
      memes: dummyDbData.memes.length,
      uploads: dummyDbData.uploads.length
    });

    await withMockedEnv(
      async () => {
        await pruneData();
        setClientAndDb(await getNewClientAndDb());
        await expect(countCollection(testCollections)).resolves.toStrictEqual({
          'request-log': 10,
          'limited-log-mview': 2,
          users: 2,
          memes: 2,
          uploads: 2
        });
      },
      {
        PRUNE_DATA_MAX_LOGS: '10',
        PRUNE_DATA_MAX_BANNED: '2',
        PRUNE_DATA_MAX_USERS: '2',
        PRUNE_DATA_MAX_MEMES: '2',
        PRUNE_DATA_MAX_UPLOADS: '2'
      },
      { replace: false }
    );

    await withMockedEnv(
      async () => {
        await pruneData();
        setClientAndDb(await getNewClientAndDb());
        await expect(countCollection(testCollections)).resolves.toStrictEqual({
          'request-log': 1,
          'limited-log-mview': 1,
          users: 1,
          memes: 1,
          uploads: 1
        });
      },
      {
        PRUNE_DATA_MAX_LOGS: '1',
        PRUNE_DATA_MAX_BANNED: '1',
        PRUNE_DATA_MAX_USERS: '1',
        PRUNE_DATA_MAX_MEMES: '1',
        PRUNE_DATA_MAX_UPLOADS: '1'
      },
      { replace: false }
    );
  });

  it('only deletes entries if necessary', async () => {
    expect.hasAssertions();

    await expect(countCollection(testCollections)).resolves.toStrictEqual({
      'request-log': dummyDbData.logs.length,
      'limited-log-mview': dummyDbData.bans.length,
      users: dummyDbData.users.length,
      memes: dummyDbData.memes.length,
      uploads: dummyDbData.uploads.length
    });

    await withMockedEnv(
      async () => {
        await pruneData();
        setClientAndDb(await getNewClientAndDb());
        await expect(countCollection(testCollections)).resolves.toStrictEqual({
          'request-log': dummyDbData.logs.length,
          'limited-log-mview': dummyDbData.bans.length,
          users: dummyDbData.users.length,
          memes: dummyDbData.memes.length,
          uploads: dummyDbData.uploads.length
        });
      },
      {
        PRUNE_DATA_MAX_LOGS: '100',
        PRUNE_DATA_MAX_BANNED: '100',
        PRUNE_DATA_MAX_USERS: '100',
        PRUNE_DATA_MAX_MEMES: '100',
        PRUNE_DATA_MAX_UPLOADS: '100'
      },
      { replace: false }
    );
  });
});
