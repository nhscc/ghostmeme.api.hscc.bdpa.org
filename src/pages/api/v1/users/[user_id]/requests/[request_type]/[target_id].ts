import { wrapHandler } from 'universe/backend/middleware';
import { addFriendRequest, isUserFollowing, unfollowUser } from 'universe/backend';
import { sendHttpNotFound, sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let followed_id: ObjectId | undefined = undefined;
      let user_id: ObjectId | undefined = undefined;

      try {
        followed_id = new ObjectId(req.query.followed_id.toString());
      } catch {
        throw new ValidationError(
          `invalid user_id "${req.query.followed_id.toString()}"`
        );
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      if (req.method == 'GET') {
        (await isUserFollowing({ followed_id, user_id }))
          ? sendHttpOk(res)
          : sendHttpNotFound(res);
      } else if (req.method == 'DELETE') {
        await unfollowUser({ followed_id, user_id });
        sendHttpOk(res);
      } else {
        await addFriendRequest({ followed_id, user_id });
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
