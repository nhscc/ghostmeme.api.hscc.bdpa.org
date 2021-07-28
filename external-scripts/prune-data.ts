import { name as pkgName } from 'package';
import { getEnv } from 'universe/backend/env';
import { AppError } from 'universe/backend/error';
import { getDb, closeDb } from 'universe/backend/db';
import debugFactory from 'debug';

import { toss } from 'toss-expression';

const debugNamespace = `${pkgName}:prune-data`;
const log = debugFactory(debugNamespace);
const debug = debugFactory(debugNamespace);

if (getEnv().DEBUG === null && getEnv().NODE_ENV != 'test') {
  debugFactory.enable(`${debugNamespace},${debugNamespace}:*`);
  debug.enabled = false;
}

export default async function main() {
  log('initializing');

  const env = getEnv();
  const limits = {
    'request-log':
      env.PRUNE_DATA_MAX_LOGS ||
      toss(new AppError('PRUNE_DATA_MAX_LOGS must be greater than zero')),
    users:
      env.PRUNE_DATA_MAX_USERS ||
      toss(new AppError('PRUNE_DATA_MAX_USERS must be greater than zero')),
    memes:
      env.PRUNE_DATA_MAX_MEMES ||
      toss(new AppError('PRUNE_DATA_MAX_MEMES must be greater than zero')),
    'limited-log-mview':
      env.PRUNE_DATA_MAX_BANNED ||
      toss(new AppError('PRUNE_DATA_MAX_BANNED must be greater than zero'))
  };

  debug(`final limits: %O`, limits);
  log('connecting to external database');

  const db = await getDb({ external: true });

  await Promise.all(
    Object.entries(limits).map(async ([collectionName, limitThreshold]) => {
      const subLog = log.extend(collectionName);
      const collection = db.collection(collectionName);
      const total = await collection.countDocuments();
      const cursor = collection.find().sort({ _id: -1 }).skip(limitThreshold).limit(1);
      const thresholdEntry = await cursor.next();

      if (thresholdEntry) {
        const result = await collection.deleteMany({ _id: { $lte: thresholdEntry._id } });
        subLog(`pruned ${result.deletedCount}/${total} "${collectionName}" entries`);
      } else {
        subLog(`no prunable "${collectionName}" entries (${total} <= ${limitThreshold})`);
      }

      cursor.close();
    })
  );

  debug('closing connection');
  await closeDb();
  log('execution complete');
}

!module.parent && main().catch((e) => log.extend('exception')(e));
