import { expose } from 'threads/worker';
import { name as pkgName } from 'package';
import { getEnv } from 'universe/backend/env';
import { createMeme, MACHINE_KEY } from 'universe/backend';
import debugFactory from 'debug';

import type { MemesWorkerOptions } from 'types/global';

const WORKER_NAME = 'chats';

const setupLogging = (username: string) => {
  const debugNamespace = `${pkgName}:initialize-data:${username}:${WORKER_NAME}`;

  const log = debugFactory(debugNamespace);
  const debug = debugFactory(debugNamespace);

  if (!getEnv().DEBUG && getEnv().NODE_ENV != 'test') {
    debugFactory.enable(`${debugNamespace},${debugNamespace}:*`);
    debug.enabled = false;
  }

  // eslint-disable-next-line no-console
  log.log = console.info.bind(console);
  void createMeme, MACHINE_KEY;

  return { log, debug };
};

expose((opts: MemesWorkerOptions) => {
  const { log, debug } = setupLogging(opts.username);
  void debug;
  log(`${WORKER_NAME} worker called with %O`, opts);
});
