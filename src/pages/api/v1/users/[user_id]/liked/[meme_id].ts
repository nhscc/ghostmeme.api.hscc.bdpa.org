import { wrapHandler } from 'universe/backend/middleware';
import { isMemeLiked } from 'universe/backend';
import { sendHttpNotFound, sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { MemeId, UserId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let meme_id: MemeId | undefined = undefined;
      let user_id: UserId | undefined = undefined;

      try {
        meme_id = new ObjectId(req.query.meme_id.toString());
      } catch {
        throw new ValidationError(`invalid meme_id "${req.query.meme_id.toString()}"`);
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      // * GET
      if (user_id !== undefined) {
        (await isMemeLiked({ meme_id, user_id }))
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
