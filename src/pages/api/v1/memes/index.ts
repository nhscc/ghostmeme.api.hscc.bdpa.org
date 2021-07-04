import { wrapHandler } from 'universe/backend/middleware';
import { createMeme, searchMemes } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { MemeId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      const key = req.headers.key?.toString() || '';
      let after: MemeId | null | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid meme_id "${req.query.after.toString()}"`);
      }

      if (req.method == 'GET') {
        sendHttpOk(res, {
          memes: await searchMemes({
            after,
            match: {},
            regexMatch: {}
          })
        });
      } // * POST
      else
        sendHttpOk(res, { meme: await createMeme({ creatorKey: key, data: req.body }) });
    },
    { req, res, methods: ['GET', 'POST'], apiVersion: 1 }
  );
}
