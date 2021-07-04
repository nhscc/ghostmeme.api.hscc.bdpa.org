import { wrapHandler } from 'universe/backend/middleware';
import { getUserLikedMemeIds } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { MemeId, UserId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let after: MemeId | null | undefined = undefined;
      let user_id: UserId | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid meme_id "${req.query.after.toString()}"`);
      }

      try {
        user_id = new ObjectId(req.query.user_id.toString());
      } catch {
        throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
      }

      // * GET
      sendHttpOk(res, { memes: await getUserLikedMemeIds({ user_id, after }) });
    },
    {
      req,
      res,
      methods: ['GET'],
      apiVersion: 1
    }
  );
}
