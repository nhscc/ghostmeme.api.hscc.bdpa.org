import { name as pkgName } from 'package';
import { getEnv } from 'universe/backend/env';
import { AppError } from 'universe/backend/error';
import { getDb, closeDb } from 'universe/backend/db';
import debugFactory from 'debug';

const debugNamespace = `${pkgName}:simulate-activity`;

const log = debugFactory(debugNamespace);
const debug = debugFactory(debugNamespace);

// eslint-disable-next-line no-console
log.log = console.info.bind(console);

if (!getEnv().DEBUG && getEnv().NODE_ENV != 'test') {
  debugFactory.enable(`${debugNamespace},${debugNamespace}:*`);
  debug.enabled = false;
}

// TODO: replace AppError with IllegalExternalEnvironmentError
export default async function main() {
  log('initializing');

  // eslint-disable-next-line no-empty-pattern
  const {
    // TODO: ...
  } = getEnv();

  // TODO:
  void AppError;

  log('connecting to external database');

  const db = await getDb({ external: true });

  // TODO:
  void db;

  debug('closing connection');
  await closeDb();
  log('execution complete');
}

!module.parent && main().catch((e) => log.extend('exception')(e.message || e.toString()));
