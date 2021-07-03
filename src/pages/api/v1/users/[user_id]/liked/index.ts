import { wrapHandler } from 'universe/backend/middleware';
import { getUserLikedBarkIds } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let after: ObjectId | null | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid bark_id "${req.query.after.toString()}"`);
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      sendHttpOk(res, { barks: await getUserLikedBarkIds({ user_id, after }) });
    },
    {
      req,
      res,
      methods: ['GET'],
      apiVersion: 1
    }
  );
}
