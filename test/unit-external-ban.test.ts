import { setClientAndDb } from 'universe/backend/db';
import { BANNED_KEY } from 'universe/backend';
import { setupTestDb } from 'testverse/db';
import banHammer from 'externals/ban-hammer';

import type { InternalRequestLogEntry, InternalLimitedLogEntry } from 'types/global';
import type { WithId } from 'mongodb';
import { GuruMeditationError } from 'universe/backend/error';
import { withMockedEnv } from './setup';

const { getDb, getNewClientAndDb } = setupTestDb();

const getRequestLogDb = async () =>
  (await getDb()).collection<WithId<InternalRequestLogEntry>>('request-log');
const getRateLimitsDb = async () =>
  (await getDb()).collection<WithId<InternalLimitedLogEntry>>('limited-log-mview');
const getRateLimits = async () =>
  (await getRateLimitsDb()).find().project({ _id: 0, ip: 1, key: 1 }).toArray();
const getRateLimitUntils = async () =>
  (await getRateLimitsDb()).find().project({ _id: 0, until: 1 }).toArray();

describe('external-scripts/ban-hammer', () => {
  it('rate limits only those ips/keys that exceed limits', async () => {
    expect.hasAssertions();

    const now = ((n: number) => n - (n % 5000) - 1000)(Date.now());

    await (await getRateLimitsDb()).deleteMany({});
    await (await getRequestLogDb()).updateMany({}, { $set: { time: now } });

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: '10',
        BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: '1'
      },
      { replace: false }
    );

    // ? Since ban-hammer closes the database connection after executing, we
    // ? reopen it or funky things happen
    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toIncludeSameMembers([
      { ip: '1.2.3.4' },
      { key: BANNED_KEY }
    ]);

    await (await getRateLimitsDb()).deleteMany({});
    await (
      await getRequestLogDb()
    ).updateMany({ key: BANNED_KEY }, { $set: { ip: '9.8.7.6' } });

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: '10',
        BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: '1'
      },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toIncludeSameMembers([
      { ip: '1.2.3.4' },
      { ip: '9.8.7.6' },
      { key: BANNED_KEY }
    ]);

    await (await getRateLimitsDb()).deleteMany({});
    await (
      await getRequestLogDb()
    ).insertOne({
      ip: '1.2.3.4',
      key: BANNED_KEY,
      method: 'PUT',
      resStatusCode: 200,
      route: 'jest/test',
      time: now - 1000
    });

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: '11',
        BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: '1'
      },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toBeArrayOfSize(0);

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: '11',
        BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: '5'
      },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toIncludeSameMembers([
      { ip: '1.2.3.4' },
      { key: BANNED_KEY }
    ]);

    await (await getRateLimitsDb()).deleteMany({});

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: '11',
        BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: '1'
      },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toBeArrayOfSize(0);
  });

  it('rate limits with respect to invocation interval', async () => {
    expect.hasAssertions();

    await (await getRateLimitsDb()).deleteMany({});

    const requestLogDb = await getRequestLogDb();
    const requestLogEntry = await requestLogDb.find().limit(1).next();

    if (!requestLogEntry) throw new GuruMeditationError('No request-log entry found?!');

    const now = ((_now: number) => _now - (_now % 5000) - 2000)(Date.now());

    await requestLogDb.updateMany({ key: BANNED_KEY }, { $set: { ip: '9.8.7.6' } });
    await requestLogDb.updateMany({}, { $set: { time: now } });

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: '10',
        BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: '5',
        BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS: '1'
      },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toBeArrayOfSize(0);

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: '10',
        BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: '5',
        BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS: '8'
      },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toIncludeSameMembers([
      { key: BANNED_KEY },
      { ip: '9.8.7.6' },
      { ip: '1.2.3.4' }
    ]);
  });

  it('repeat offenders are punished to the maximum extent', async () => {
    expect.hasAssertions();

    await (await getRateLimitsDb()).deleteMany({});
    await (
      await getRequestLogDb()
    ).updateMany({ key: BANNED_KEY }, { $set: { ip: '9.8.7.6' } });

    const now = Date.now();

    await withMockedEnv(
      banHammer,
      { BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES: '10' },
      { replace: false }
    );

    const expectUntils = async (length: number, minutes: number, multi: number) => {
      const untils = await getRateLimitUntils();

      expect(untils).toBeArrayOfSize(length);

      untils.forEach((u) => {
        // ? If tests are failing, try make toBeAround param #2 to be > 1000
        // @ts-expect-error -- toBeAround is defined
        expect(u.until).toBeAround(now + minutes * 60 * 1000 * multi, multi * 1000);
      });
    };

    setClientAndDb(await getNewClientAndDb());
    await expectUntils(3, 10, 1);

    await (await getRateLimitsDb()).deleteMany({});

    await withMockedEnv(
      banHammer,
      { BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES: '20' },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    await expectUntils(3, 20, 1);

    await withMockedEnv(
      banHammer,
      {
        BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES: '20',
        BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER: '5'
      },
      { replace: false }
    );

    setClientAndDb(await getNewClientAndDb());
    await expectUntils(3, 20, 5);
  });

  it('does not replace longer bans with shorter bans', async () => {
    expect.hasAssertions();

    expect(await getRateLimits()).toBeArrayOfSize(3);

    await (
      await getRateLimitsDb()
    ).updateMany({ ip: { $ne: '5.6.7.8' } }, { $set: { until: 9998784552826 } });
    await banHammer();

    setClientAndDb(await getNewClientAndDb());

    let saw = 0;
    (await getRateLimitUntils()).forEach((u) => u.until == 9998784552826 && saw++);

    expect(saw).toStrictEqual(2);
  });

  it('deletes outdated entries outside the punishment period', async () => {
    expect.hasAssertions();

    expect(await getRateLimits()).toBeArrayOfSize(3);

    await (await getRateLimitsDb()).updateMany({ ip: '5.6.7.8' }, { $set: { until: 0 } });
    await banHammer();

    setClientAndDb(await getNewClientAndDb());
    expect(await getRateLimits()).toIncludeSameMembers([
      { ip: '1.2.3.4' },
      { key: BANNED_KEY }
    ]);
  });
});
