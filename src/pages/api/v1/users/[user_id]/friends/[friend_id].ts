import { wrapHandler } from 'universe/backend/middleware';
import { addUserAsFriend, isUserAFriend, removeUserAsFriend } from 'universe/backend';
import { sendHttpNotFound, sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { FriendId, UserId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let friend_id: FriendId | undefined = undefined;
      let user_id: UserId | undefined = undefined;

      try {
        friend_id = new ObjectId(req.query.friend_id.toString());
      } catch {
        throw new ValidationError(
          `invalid friend_id "${req.query.friend_id.toString()}"`
        );
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      if (req.method == 'GET') {
        (await isUserAFriend({ friend_id, user_id }))
          ? sendHttpOk(res)
          : sendHttpNotFound(res);
      } else if (req.method == 'DELETE') {
        await removeUserAsFriend({ friend_id, user_id });
        sendHttpOk(res);
      } else {
        // * PUT
        await addUserAsFriend({ friend_id, user_id });
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
