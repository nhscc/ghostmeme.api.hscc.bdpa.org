/* eslint-disable no-console */
import { getDbClient, closeDb } from 'universe/backend/db';

export default async function main(isCLI = false) {
  try {
    isCLI && console.log(`[ connecting to external database ]`);

    // ? We call this here to ensure the external mongo connect URI is used
    await getDbClient({ external: true });

    isCLI && console.log(`[ bootstrapping activity generation ]`);

    //await generateActivity(!isCLI);

    isCLI && console.log('[ closing connection ]');

    await closeDb();

    isCLI && console.log('[ execution complete ]');
  } catch (e) {
    if (isCLI) {
      console.error('EXCEPTION:', e);
      process.exit(1);
    } else throw e;
  }
}

!module.parent && main(true);
