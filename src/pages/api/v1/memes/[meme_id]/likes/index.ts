import { getBarkLikesUserIds } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { wrapHandler } from 'universe/backend/middleware';
import { ObjectId } from 'mongodb';

import { ValidationError } from 'universe/backend/error';
import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let after: ObjectId | null | undefined = undefined;
      let bark_id: ObjectId | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid bark_id "${req.query.after.toString()}"`);
      }

      try {
        bark_id = new ObjectId(req.query.bark_id.toString());
      } catch {
        throw new ValidationError(`invalid bark_id "${req.query.bark_id.toString()}"`);
      }

      if (bark_id !== undefined) {
        sendHttpOk(res, { users: await getBarkLikesUserIds({ bark_id, after }) });
      }
    },
    {
      req,
      res,
      methods: ['GET'],
      apiVersion: 1
    }
  );
}
