import { name as pkgName } from 'package';
import { getEnv } from 'universe/backend/env';
import { ExternalError, IllegalExternalEnvironmentError } from 'universe/backend/error';
import { getDb, closeDb } from 'universe/backend/db';
import debugFactory from 'debug';

const debugNamespace = `${pkgName}:prune-data`;

const oneSecondInMs = 1000;
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
    const {
      BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS: calledEverySeconds,
      BAN_HAMMER_MAX_REQUESTS_PER_WINDOW: maxRequestsPerWindow,
      BAN_HAMMER_RESOLUTION_WINDOW_SECONDS: resolutionWindowSeconds,
      BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES: defaultBanTimeMinutes,
      BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER: punishMultiplier
    } = getEnv();

    if (!calledEverySeconds || !(Number(calledEverySeconds) > 0)) {
      throw new IllegalExternalEnvironmentError(
        'BAN_HAMMER_WILL_BE_CALLED_EVERY_SECONDS must be greater than zero'
      );
    }

    if (!maxRequestsPerWindow || !(Number(maxRequestsPerWindow) > 0)) {
      throw new IllegalExternalEnvironmentError(
        'BAN_HAMMER_MAX_REQUESTS_PER_WINDOW must be greater than zero'
      );
    }

    if (!resolutionWindowSeconds || !(Number(resolutionWindowSeconds) > 0)) {
      throw new IllegalExternalEnvironmentError(
        'BAN_HAMMER_RESOLUTION_WINDOW_SECONDS must be greater than zero'
      );
    }

    if (!defaultBanTimeMinutes || !(Number(defaultBanTimeMinutes) > 0)) {
      throw new IllegalExternalEnvironmentError(
        'BAN_HAMMER_DEFAULT_BAN_TIME_MINUTES must be greater than zero'
      );
    }

    if (!punishMultiplier || !(Number(punishMultiplier) > 0)) {
      throw new IllegalExternalEnvironmentError(
        'BAN_HAMMER_RECIDIVISM_PUNISH_MULTIPLIER must be greater than zero'
      );
    }

    const calledEveryMs = oneSecondInMs * calledEverySeconds;
    const defaultBanTimeMs = oneSecondInMs * 60 * defaultBanTimeMinutes;
    const resolutionWindowMs = oneSecondInMs * resolutionWindowSeconds;
    const db = await getDb({ external: true });

    const pipeline = [
      {
        $limit: 1
      },
      {
        $project: { _id: 1 }
      },
      {
        $project: { _id: 0 }
      },
      {
        $lookup: {
          from: 'request-log',
          as: 'keyBased',
          pipeline: [
            {
              $match: {
                key: { $ne: null },
                $expr: {
                  $gte: ['$time', { $subtract: [{ $toLong: '$$NOW' }, calledEveryMs] }]
                }
              }
            },
            {
              $group: {
                _id: {
                  key: '$key',
                  interval: {
                    $subtract: ['$time', { $mod: ['$time', resolutionWindowMs] }]
                  }
                },
                count: { $sum: 1 }
              }
            },
            {
              $match: {
                count: { $gt: maxRequestsPerWindow }
              }
            },
            {
              $project: {
                key: '$_id.key',
                until: { $add: [{ $toLong: '$$NOW' }, defaultBanTimeMs] }
              }
            },
            {
              $project: {
                _id: 0,
                count: 0
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'request-log',
          as: 'ipBased',
          pipeline: [
            {
              $match: {
                $expr: {
                  $gte: ['$time', { $subtract: [{ $toLong: '$$NOW' }, calledEveryMs] }]
                }
              }
            },
            {
              $group: {
                _id: {
                  ip: '$ip',
                  interval: {
                    $subtract: ['$time', { $mod: ['$time', resolutionWindowMs] }]
                  }
                },
                count: { $sum: 1 }
              }
            },
            {
              $match: {
                count: { $gt: maxRequestsPerWindow }
              }
            },
            {
              $project: {
                ip: '$_id.ip',
                until: { $add: [{ $toLong: '$$NOW' }, defaultBanTimeMs] }
              }
            },
            {
              $project: {
                _id: 0,
                count: 0
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'limited-log-mview',
          as: 'previous',
          pipeline: [
            {
              $match: {
                $expr: {
                  $gte: [
                    '$until',
                    {
                      $subtract: [
                        { $toLong: '$$NOW' },
                        defaultBanTimeMs * punishMultiplier
                      ]
                    }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 0
              }
            }
          ]
        }
      },
      {
        $project: {
          union: { $concatArrays: ['$keyBased', '$ipBased', '$previous'] }
        }
      },
      {
        $unwind: {
          path: '$union'
        }
      },
      {
        $replaceRoot: {
          newRoot: '$union'
        }
      },
      {
        $group: {
          _id: {
            ip: '$ip',
            key: '$key'
          },
          count: {
            $sum: 1
          },
          until: {
            $max: '$until'
          }
        }
      },
      {
        $set: {
          until: {
            $cond: {
              if: { $ne: ['$count', 1] },
              then: {
                $max: [
                  { $add: [{ $toLong: '$$NOW' }, defaultBanTimeMs * punishMultiplier] },
                  '$until'
                ]
              },
              else: '$until'
            }
          },
          ip: '$_id.ip',
          key: '$_id.key'
        }
      },
      {
        $project: {
          count: 0,
          _id: 0
        }
      },
      {
        $out: 'limited-log-mview'
      }
    ];

    debug('aggregation pipeline: %O', pipeline);

    const cursor = db.collection('request-log').aggregate(pipeline);

    await cursor.next();
    await cursor.close();
    await closeDb();

    log('execution complete');
  } catch (e) {
    throw new ExternalError(`${e instanceof Error ? e.message : e}`);
  }
}

!module.parent &&
  main().catch((e) => log.extend('<exception>')(e.message || e.toString()));
