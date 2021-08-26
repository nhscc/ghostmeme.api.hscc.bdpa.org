import { name as pkgName } from 'package';
import { getEnv } from 'universe/backend/env';
import { getDb, closeDb, initializeDb, destroyDb } from 'universe/backend/db';
import { usernames as rawUsernames } from 'data/corpus.json';
import { spawn, Pool, Worker } from 'threads';
import { createUser, getSystemInfo, MACHINE_KEY } from 'universe/backend';
import fastShuffle from 'fast-shuffle';
import debugFactory from 'debug';

import {
  ExternalError,
  IllegalEnvironmentError,
  IllegalExternalEnvironmentError
} from 'universe/backend/error';

import type { NewUser } from 'types/global';

const debugNamespace = `${pkgName}:initialize-data`;

const log = debugFactory(debugNamespace);
const debug = debugFactory(debugNamespace);

/**
 * The minimum number of users that will be generated.
 */
const MIN_USERS = 10;

/**
 * The minimum number of memes generated per generated user.
 */
const MIN_MEMES = 1;

/**
 * Maximum number of consecutive job failures before the program exits.
 */
const MAX_ERROR_THRESHOLD = 3;

// eslint-disable-next-line no-console
log.log = console.info.bind(console);

if (!getEnv().DEBUG && getEnv().NODE_ENV != 'test') {
  debugFactory.enable(`${debugNamespace},${debugNamespace}:*`);
  debug.enabled = false;
}

export default async function main() {
  const {
    PRUNE_DATA_MAX_MEMES,
    PRUNE_DATA_MAX_USERS,
    INIT_DATA_USERS,
    INIT_DATA_USER_MEMES,
    INIT_DATA_USER_MAX_FRIENDS,
    INIT_DATA_USER_MAX_REQUESTS,
    INIT_DATA_USER_MAX_CHATS,
    INIT_DATA_USER_MAX_COMMENTS,
    INIT_DATA_START_MINS_AGO
  } = getEnv();

  if (!INIT_DATA_USERS || INIT_DATA_USERS < MIN_USERS) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_USERS (${INIT_DATA_USERS}) must be >= MIN_USERS (${MIN_USERS})`
    );
  }

  if (!INIT_DATA_USER_MEMES || INIT_DATA_USER_MEMES < MIN_MEMES) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_USER_MEMES (${INIT_DATA_USER_MEMES}) must be >= MIN_MEMES (${MIN_MEMES})`
    );
  }

  if (!INIT_DATA_START_MINS_AGO || INIT_DATA_START_MINS_AGO < 0) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_START_MINS_AGO (${INIT_DATA_START_MINS_AGO}) must be > 0`
    );
  }

  if (!INIT_DATA_USER_MAX_FRIENDS || INIT_DATA_USER_MAX_FRIENDS < 0) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_USER_MAX_FRIENDS (${INIT_DATA_USER_MAX_FRIENDS}) must be > 0`
    );
  }

  if (!INIT_DATA_USER_MAX_REQUESTS || INIT_DATA_USER_MAX_REQUESTS < 0) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_USER_MAX_REQUESTS (${INIT_DATA_USER_MAX_REQUESTS}) must be > 0`
    );
  }

  if (!INIT_DATA_USER_MAX_CHATS || INIT_DATA_USER_MAX_CHATS < 0) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_USER_MAX_CHATS (${INIT_DATA_USER_MAX_CHATS}) must be > 0`
    );
  }

  if (!INIT_DATA_USER_MAX_COMMENTS || INIT_DATA_USER_MAX_COMMENTS < 0) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_USER_MAX_COMMENTS (${INIT_DATA_USER_MAX_COMMENTS}) must be > 0`
    );
  }

  if (!(INIT_DATA_USER_MAX_FRIENDS + INIT_DATA_USER_MAX_REQUESTS < INIT_DATA_USERS)) {
    throw new IllegalExternalEnvironmentError(
      `INIT_DATA_USER_MAX_FRIENDS (${INIT_DATA_USER_MAX_FRIENDS}) + INIT_DATA_USER_MAX_REQUESTS (${INIT_DATA_USER_MAX_REQUESTS}) must be < INIT_DATA_USERS (${INIT_DATA_USERS})`
    );
  }

  const pruneMaxUsers = PRUNE_DATA_MAX_USERS || Infinity;
  const pruneMaxMemes = PRUNE_DATA_MAX_MEMES || Infinity;

  debug(`MIN_USERS: ${MIN_USERS}`);
  debug(`MIN_MEMES: ${MIN_MEMES}`);
  debug(`MAX_ERROR_THRESHOLD: ${MAX_ERROR_THRESHOLD}`);
  debug(`PRUNE_DATA_MAX_USERS?: ${pruneMaxUsers}`);
  debug(`PRUNE_DATA_MAX_MEMES?: ${pruneMaxMemes}`);
  debug(`INIT_DATA_USERS: ${INIT_DATA_USERS}`);
  debug(`INIT_DATA_USER_MEMES: ${INIT_DATA_USER_MEMES}`);
  debug(`INIT_DATA_USER_MAX_FRIENDS: ${INIT_DATA_USER_MAX_FRIENDS}`);
  debug(`INIT_DATA_USER_MAX_REQUESTS: ${INIT_DATA_USER_MAX_REQUESTS}`);
  debug(`INIT_DATA_USER_MAX_CHATS: ${INIT_DATA_USER_MAX_CHATS}`);
  debug(`INIT_DATA_USER_MAX_COMMENTS: ${INIT_DATA_USER_MAX_COMMENTS}`);
  debug(`INIT_DATA_START_MINS_AGO: ${INIT_DATA_START_MINS_AGO}`);

  try {
    const db = await getDb({ external: true });

    await destroyDb(db);
    await initializeDb(db);

    if (INIT_DATA_USERS > rawUsernames.length) {
      throw new IllegalEnvironmentError(
        `cannot create more users (${INIT_DATA_USERS}) than there are usernames in the corpus (${rawUsernames.length})`
      );
    }

    if (INIT_DATA_USERS > pruneMaxUsers) {
      log(
        `WARNING: creating more users (${INIT_DATA_USERS}) than is allowed by PRUNE_DATA_MAX_USERS (${pruneMaxUsers})`
      );
    }

    const estimatedMemeCount = INIT_DATA_USERS * INIT_DATA_USER_MEMES;

    if (estimatedMemeCount > pruneMaxMemes) {
      log(
        `WARNING: creating more memes (${estimatedMemeCount}) than is allowed by PRUNE_DATA_MAX_MEMES (${pruneMaxMemes})`
      );
    }

    log('spawning worker pools');

    const pools = {
      needsFriends: Pool(() => spawn(new Worker('./worker-friends.js')), {
        name: 'worker-pool-friends'
      }),
      needsMemes: Pool(() => spawn(new Worker('./worker-memes.js')), {
        name: 'worker-pool-memes'
      }),
      needsInteractions: Pool(() => spawn(new Worker('./worker-interactions.js')), {
        name: 'worker-pool-interactions'
      }),
      needsChats: Pool(() => spawn(new Worker('./worker-chats.js')), {
        name: 'worker-pool-chats'
      })
    };

    log('shuffling corpus data');
    const usernames = fastShuffle(rawUsernames).slice(INIT_DATA_USERS);

    log(`selecting ${INIT_DATA_USERS}/${rawUsernames.length} usernames`);
    log(
      `generating ${INIT_DATA_USERS} users, ${estimatedMemeCount} memes (${INIT_DATA_USER_MEMES} per user)`
    );

    const startTimeMs = Date.now() - INIT_DATA_START_MINS_AGO * 60 * 1000;
    let errorCount = 0;

    await Promise.all(
      usernames.map(async (username, ndx) => {
        const logUser = log.extend(username);
        const userData: NewUser = {
          username,
          name: `Generated User #${ndx}`,
          email: `${username}-${ndx + 1}@fake-email.com`,
          phone: (15555550000 + ndx).toString(),
          imageBase64: null
        };

        logUser(`creating user "${username}": %O`, userData);

        try {
          const newUser = await createUser({
            creatorKey: MACHINE_KEY,
            data: userData
          });

          let newFriendIds: string[] = [];

          await Promise.all([
            Promise.all([
              pools.needsFriends
                .queue((exec) =>
                  exec({
                    debugNamespace: log.namespace,
                    user_id: newUser.user_id,
                    username: newUser.username,
                    startTimeMs
                  })
                )
                .then((ids) => (newFriendIds = ids)),
              pools.needsMemes.queue((exec) =>
                exec({
                  debugNamespace: log.namespace,
                  user_id: newUser.user_id,
                  username: newUser.username,
                  startTimeMs
                })
              )
            ]).then(() => {
              debug(`${username}'s friend_ids: %O`, newFriendIds);

              return pools.needsInteractions.queue((exec) =>
                exec({
                  debugNamespace: log.namespace,
                  user_id: newUser.user_id,
                  username: newUser.username,
                  friend_ids: newFriendIds,
                  startTimeMs
                })
              );
            }),
            pools.needsChats.queue((exec) =>
              exec({
                debugNamespace: log.namespace,
                user_id: newUser.user_id,
                username: newUser.username,
                startTimeMs
              })
            )
          ]);
        } catch (e) {
          errorCount += 1;
          logUser.extend('<exception>')(e.message || e);
          debug(e);

          if (errorCount >= MAX_ERROR_THRESHOLD) {
            throw new ExternalError(
              'main thread failed: maximum error threshold reached'
            );
          }
        }
      })
    );

    log('main thread completed');
    log('waiting for worker pools to terminate');

    await Promise.all(
      Object.entries(pools).map(async ([poolName, pool]) => {
        try {
          await pool.completed();
          debug(`all ${poolName} pool queued tasks completed without errors`);
        } catch {
          log(`some ${poolName} pool queued tasks failed (check logs)`);
        }
      })
    );

    const { totalMemes } = await getSystemInfo();

    if (totalMemes > pruneMaxMemes) {
      log(
        `WARNING: more memes were created (${totalMemes}) than is allowed by PRUNE_DATA_MAX_MEMES (${pruneMaxMemes}). Consider setting PRUNE_DATA_MAX_MEMES=${totalMemes}`
      );
    }
  } finally {
    await closeDb();
  }

  log('execution complete');
}

!module.parent &&
  main().catch((e) => log.extend('<exception>')(e.message || e.toString()));
