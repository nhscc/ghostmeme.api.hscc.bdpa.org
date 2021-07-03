import { setClientAndDb } from 'universe/backend/db';
import { setupTestDb } from 'testverse/db';
import pruneLogs from 'externals/prune-data';

import type { InternalRequestLogEntry } from 'types/global';
import type { WithId, Db } from 'mongodb';

const { getDb, getNewClientAndDb } = setupTestDb();

const getCount = (db: Db) =>
  db.collection<WithId<InternalRequestLogEntry>>('request-log').countDocuments();

describe('external-scripts/prune-data', () => {
  it('ensures at most PRUNE_DATA_MAX_LOGS log entries exist', async () => {
    expect.hasAssertions();

    expect(await getCount(await getDb())).toStrictEqual(22);

    process.env.PRUNE_DATA_MAX_LOGS = '10';
    await pruneLogs();

    setClientAndDb(await getNewClientAndDb());
    expect(await getCount(await getDb())).toStrictEqual(10);

    process.env.PRUNE_DATA_MAX_LOGS = '1';
    await pruneLogs();

    setClientAndDb(await getNewClientAndDb());
    expect(await getCount(await getDb())).toStrictEqual(1);
  });

  it('only deletes log entries if necessary', async () => {
    expect.hasAssertions();

    expect(await getCount(await getDb())).toStrictEqual(22);

    process.env.PRUNE_DATA_MAX_LOGS = '100';
    await pruneLogs();

    setClientAndDb(await getNewClientAndDb());
    expect(await getCount(await getDb())).toStrictEqual(22);
  });
});
