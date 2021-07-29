# External Scripts

External scripts or "externals" are stand-alone packages that aid in the proper
functioning of the API. Each external should be run via cron as often as is
appropriate.

Note that externals must first be compiled before they can be run, i.e.
`npm run build-externals`.

## Example Template

```Typescript
import { name as pkgName } from 'package';
import { getEnv } from 'universe/backend/env';
import { IllegalExternalEnvironmentError } from 'universe/backend/error';
import { getDb, closeDb } from 'universe/backend/db';
import debugFactory from 'debug';

// TODO:
const debugNamespace = `${pkgName}:EXTERNAL_SCRIPT_NAME_HERE`;

const log = debugFactory(debugNamespace);
const debug = debugFactory(debugNamespace);

log.log = console.info.bind(console);

if (!getEnv().DEBUG && getEnv().NODE_ENV != 'test') {
  debugFactory.enable(`${debugNamespace},${debugNamespace}:*`);
  debug.enabled = false;
}

export default async function main() {
  log('initializing');

  // eslint-disable-next-line no-empty-pattern
  const {
    // TODO: ...
  } = getEnv();

  // TODO:
  void IllegalExternalEnvironmentError;

  log('connecting to external database');

  const db = await getDb({ external: true });

  // TODO:
  void db;

  debug('closing connection');
  await closeDb();
  log('execution complete');
}

!module.parent && main().catch((e) => log.extend('exception')(e.message || e.toString()));
```
