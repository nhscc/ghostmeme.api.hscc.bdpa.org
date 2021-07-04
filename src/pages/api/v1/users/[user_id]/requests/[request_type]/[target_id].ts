import { wrapHandler } from 'universe/backend/middleware';
import {
  addFriendRequest,
  isFriendRequestOfType,
  removeFriendRequest
} from 'universe/backend';
import { sendHttpNotFound, sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { FriendRequestType, UserId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let target_id: UserId | undefined = undefined;
      let user_id: UserId | undefined = undefined;
      let request_type: FriendRequestType | undefined = undefined;

      try {
        target_id = new ObjectId(req.query.target_id.toString());
      } catch {
        throw new ValidationError(
          `invalid target_id "${req.query.target_id.toString()}"`
        );
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

      if (req.method == 'GET') {
        (await isFriendRequestOfType({ target_id, request_type, user_id }))
          ? sendHttpOk(res)
          : sendHttpNotFound(res);
      } else if (req.method == 'DELETE') {
        await removeFriendRequest({ target_id, request_type, user_id });
        sendHttpOk(res);
      } else {
        // * PUT
        await addFriendRequest({ target_id, request_type, user_id });
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
