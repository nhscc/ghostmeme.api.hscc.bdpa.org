import { getSystemInfo } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { wrapHandler } from 'universe/backend/middleware';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ res }) => {
      sendHttpOk(res, await getSystemInfo());
    },
    { req, res, methods: ['GET'], apiVersion: 1 }
  );
}
