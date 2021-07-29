import { name as pkgName } from 'package';
import { getEnv } from 'universe/backend/env';
import { ExternalError, IllegalExternalEnvironmentError } from 'universe/backend/error';
import { getDb, closeDb } from 'universe/backend/db';
import { toss } from 'toss-expression';
import debugFactory from 'debug';

const debugNamespace = `${pkgName}:prune-data`;

const log = debugFactory(debugNamespace);
const debug = debugFactory(debugNamespace);

// eslint-disable-next-line no-console
log.log = console.info.bind(console);

if (!getEnv().DEBUG && getEnv().NODE_ENV != 'test') {
  debugFactory.enable(`${debugNamespace},${debugNamespace}:*`);
  debug.enabled = false;
}

export default async function main() {
  try {
    log('initializing');

    const env = getEnv();
    const limits = {
      'request-log':
        env.PRUNE_DATA_MAX_LOGS ||
        toss(
          new IllegalExternalEnvironmentError(
            'PRUNE_DATA_MAX_LOGS must be greater than zero'
          )
        ),
      users:
        env.PRUNE_DATA_MAX_USERS ||
        toss(
          new IllegalExternalEnvironmentError(
            'PRUNE_DATA_MAX_USERS must be greater than zero'
          )
        ),
      memes:
        env.PRUNE_DATA_MAX_MEMES ||
        toss(
          new IllegalExternalEnvironmentError(
            'PRUNE_DATA_MAX_MEMES must be greater than zero'
          )
        ),
      'limited-log-mview':
        env.PRUNE_DATA_MAX_BANNED ||
        toss(
          new IllegalExternalEnvironmentError(
            'PRUNE_DATA_MAX_BANNED must be greater than zero'
          )
        )
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
          const result = await collection.deleteMany({
            _id: { $lte: thresholdEntry._id }
          });
          subLog(`pruned ${result.deletedCount}/${total} "${collectionName}" entries`);
        } else {
          subLog(
            `no prunable "${collectionName}" entries (${total} <= ${limitThreshold})`
          );
        }

        cursor.close();
      })
    );

    debug('closing connection');
    await closeDb();
    log('execution complete');
  } catch (e) {
    throw new ExternalError(e.message || e.toString());
  }
}

!module.parent && main().catch((e) => log.extend('exception')(e.message || e.toString()));
