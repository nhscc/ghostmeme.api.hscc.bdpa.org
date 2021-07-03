import { wrapHandler } from 'universe/backend/middleware';
import { createBark, searchBarks } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let after: ObjectId | null | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid bark_id "${req.query.after.toString()}"`);
      }

      if (req.method == 'GET') {
        sendHttpOk(res, {
          barks: await searchBarks({
            after,
            match: {},
            regexMatch: {}
          })
        });
      } else sendHttpOk(res, { bark: await createBark({ key, data: req.body }) });
    },
    { req, res, methods: ['GET', 'POST'], apiVersion: 1 }
  );
}
