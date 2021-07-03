import { wrapHandler } from 'universe/backend/middleware';
import { isMemeLiked, addLikedMeme, removeLikedMeme } from 'universe/backend';
import { sendHttpOk, sendHttpNotFound } from 'multiverse/next-respond';
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

      if (req.method == 'GET') {
        (await isMemeLiked({ meme_id, user_id }))
          ? sendHttpOk(res)
          : sendHttpNotFound(res);
      } else if (req.method == 'DELETE') {
        await removeLikedMeme({ meme_id, user_id });
        sendHttpOk(res);
      } else {
        // * PUT
        await addLikedMeme({ meme_id, user_id });
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
