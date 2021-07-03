import * as React from 'react';
import { version as pkgVersion } from '../../package.json';
import { getEnv } from 'universe/backend/env';
import { getDb, initializeDb, destroyDb } from 'universe/backend/db';
import { hydrateDb, dummyDbData } from 'testverse/db';

import type { GetServerSidePropsContext } from 'next';
import { Awaited } from '@ergodark/types';
import { isServer } from 'is-server-side';

let previouslyHydratedDb = false;

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const env = getEnv();
  const shouldHydrateDb =
    env.NODE_ENV == 'development' &&
    ((!previouslyHydratedDb && env.HYDRATE_DB_ON_STARTUP) || query.hydrate !== undefined);

  const props = {
    isInProduction: env.NODE_ENV == 'production',
    shouldHydrateDb,
    previouslyHydratedDb,
    nodeEnv: env.NODE_ENV,
    nodeVersion: process.version
  };

  if (shouldHydrateDb) {
    const db = await getDb();

    await destroyDb(db);
    await initializeDb(db);
    await hydrateDb(db, dummyDbData);
    previouslyHydratedDb = true;
  }

  return { props };
}

export default function Index({
  previouslyHydratedDb,
  shouldHydrateDb,
  isInProduction,
  nodeEnv,
  nodeVersion
}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  let status = <span style={{ color: 'gray' }}>unchanged</span>;

  if (previouslyHydratedDb)
    status = <span style={{ color: 'green' }}>previously hydrated</span>;

  if (shouldHydrateDb) status = <span style={{ color: 'darkred' }}>hydrated</span>;

  if (!isServer()) {
    // eslint-disable-next-line no-console
    console.log(`serverless node runtime: ${nodeVersion}`);
    // eslint-disable-next-line no-console
    console.log(`ghostmeme runtime: v${pkgVersion}`);
  }

  return (
    <React.Fragment>
      <p>Psst: there is no web frontend for this API.</p>
      {!isInProduction && (
        <p>
          <strong>
            {`[ NODE_ENV=${nodeEnv} | db=`}
            {status}
            {' ]'}
          </strong>
        </p>
      )}
    </React.Fragment>
  );
}
