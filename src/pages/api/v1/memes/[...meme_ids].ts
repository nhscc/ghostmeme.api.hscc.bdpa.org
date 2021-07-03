import { wrapHandler } from 'universe/backend/middleware';
import { getMemes, updateMemes } from 'universe/backend';
import { itemToObjectId } from 'universe/backend/db';
import { sendHttpOk } from 'multiverse/next-respond';
import { NotFoundError, ValidationError } from 'universe/backend/error';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { MemeId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let meme_ids: MemeId[] | undefined = undefined;

      try {
        meme_ids = itemToObjectId(
          Array.from(new Set<string>(req.query.meme_ids as string[]))
        );
      } catch {
        throw new ValidationError('invalid meme_id(s)');
      }

      if (req.method == 'GET') {
        const memes = await getMemes({ meme_ids });

        if (memes.length != meme_ids.length) {
          throw new NotFoundError('duplicate meme_id(s)');
        } else sendHttpOk(res, { memes });
      } else {
        // * PUT
        // TODO: validation
        await updateMemes({ meme_ids, data: {} });
        sendHttpOk(res);
      }
    },
    {
      req,
      res,
      methods: ['GET', 'PUT'],
      apiVersion: 1
    }
  );
}
