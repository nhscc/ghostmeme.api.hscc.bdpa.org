import { wrapHandler } from 'universe/backend/middleware';
import { getBarks, deleteBarks } from 'universe/backend';
import { itemToObjectId } from 'universe/backend/db';
import { sendHttpOk } from 'multiverse/next-respond';
import { NotFoundError, ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let bark_ids: ObjectId[] | undefined = undefined;

      try {
        bark_ids = itemToObjectId(
          Array.from(new Set<string>(req.query.bark_ids as string[]))
        );
      } catch {
        throw new ValidationError('invalid bark_id(s)');
      }

      if (req.method == 'GET') {
        const barks = await getBarks({ bark_ids });

        if (barks.length != bark_ids.length) {
          throw new NotFoundError('duplicate bark_id(s)');
        } else sendHttpOk(res, { barks });
      } else {
        await deleteBarks({ bark_ids });
        sendHttpOk(res);
      }
    },
    {
      req,
      res,
      methods: ['GET', 'DELETE'],
      apiVersion: 1
    }
  );
}
