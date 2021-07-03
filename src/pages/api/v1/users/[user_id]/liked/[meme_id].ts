import { wrapHandler } from 'universe/backend/middleware';
import { isBarkLiked } from 'universe/backend';
import { sendHttpNotFound, sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let bark_id: ObjectId | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        bark_id = new ObjectId(req.query.bark_id.toString());
      } catch {
        throw new ValidationError(`invalid bark_id "${req.query.bark_id.toString()}"`);
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      if (user_id !== undefined) {
        (await isBarkLiked({ bark_id, user_id }))
          ? sendHttpOk(res)
          : sendHttpNotFound(res);
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
