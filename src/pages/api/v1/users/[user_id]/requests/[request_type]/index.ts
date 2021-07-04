import { getFriendRequestsOfType } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { wrapHandler } from 'universe/backend/middleware';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { FriendRequestType, UserId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let after: UserId | null | undefined = undefined;
      let user_id: UserId | undefined = undefined;
      let request_type: FriendRequestType | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.after.toString()}"`);
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      if (!['incoming', 'outgoing'].includes(req.query.request_type.toString())) {
        throw new ValidationError(
          `invalid request_type "${req.query.request_type.toString()}", expected "incoming" or "outgoing"`
        );
      }

      request_type = req.query.request_type as FriendRequestType;

      // * GET
      sendHttpOk(res, {
        users: await getFriendRequestsOfType({ user_id, request_type, after })
      });
    },
    {
      req,
      res,
      methods: ['GET'],
      apiVersion: 1
    }
  );
}
