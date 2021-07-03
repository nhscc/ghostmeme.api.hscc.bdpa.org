import { wrapHandler } from 'universe/backend/middleware';
import { addFriend, isUserAFriend, removePackmate } from 'universe/backend';
import { sendHttpNotFound, sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let packmate_id: ObjectId | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        packmate_id = new ObjectId(req.query.packmate_id.toString());
      } catch {
        throw new ValidationError(
          `invalid packmate_id "${req.query.packmate_id.toString()}"`
        );
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      if (req.method == 'GET') {
        (await isUserAFriend({ packmate_id, user_id }))
          ? sendHttpOk(res)
          : sendHttpNotFound(res);
      } else if (req.method == 'DELETE') {
        await removePackmate({ packmate_id, user_id });
        sendHttpOk(res);
      } else {
        await addFriend({ packmate_id, user_id });
        sendHttpOk(res);
      }
    },
    {
      req,
      res,
      methods: ['GET', 'DELETE', 'PUT'],
      apiVersion: 1
    }
  );
}
