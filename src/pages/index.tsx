import * as React from 'react';
import { version as pkgVersion } from '../../package.json';
import { getEnv } from 'universe/backend/env';

import type { Awaited } from '@ergodark/types';

export async function getServerSideProps() {
  const env = getEnv();

  return {
    props: {
      isInProduction: env.NODE_ENV == 'production',
      nodeEnv: env.NODE_ENV,
      nodeVersion: process.version,
      region: env.VERCEL_REGION,
      timezone: env.TZ,
      commitMessage: env.VERCEL_GIT_COMMIT_MESSAGE
    }
  };
}

export default function Index({
  isInProduction,
  nodeEnv,
  nodeVersion,
  region,
  timezone,
  commitMessage
}: Awaited<ReturnType<typeof getServerSideProps>>['props']) {
  return (
    <React.Fragment>
      Ghostmeme runtime: <strong>{`v${pkgVersion}`}</strong> <br />
      Serverless node runtime: <strong>{nodeVersion}</strong> <br />
      Environment: <strong>{nodeEnv}</strong> <br />
      Production mode:{' '}
      <strong>
        {isInProduction ? (
          <span style={{ color: 'green' }}>yes</span>
        ) : (
          <span style={{ color: 'red' }}>no</span>
        )}
      </strong>
      <br />
      Vercel region: <strong>{region}</strong> <br />
      Timezone: <strong>{timezone}</strong> <br />
      Latest change: <strong>{commitMessage}</strong> <br />
    </React.Fragment>
  );
}
