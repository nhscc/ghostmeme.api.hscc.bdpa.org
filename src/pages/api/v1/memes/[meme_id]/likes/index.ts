import { getMemeLikesUserIds } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { wrapHandler } from 'universe/backend/middleware';
import { ObjectId } from 'mongodb';
import { ValidationError } from 'universe/backend/error';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { MemeId, UserId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let after: UserId | null | undefined = undefined;
      let meme_id: MemeId | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid meme_id "${req.query.after.toString()}"`);
      }

      try {
        meme_id = new ObjectId(req.query.meme_id.toString());
      } catch {
        throw new ValidationError(`invalid meme_id "${req.query.meme_id.toString()}"`);
      }

      // * GET
      if (meme_id !== undefined) {
        sendHttpOk(res, {
          users: await getMemeLikesUserIds({ meme_id, after })
        });
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
