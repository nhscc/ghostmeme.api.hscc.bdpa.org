import { sendHttpOk } from 'multiverse/next-respond';
import { searchMemes } from 'universe/backend';
import { wrapHandler } from 'universe/backend/middleware';
import { ValidationError } from 'universe/backend/error';
import { ObjectId } from 'mongodb';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { MemeId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      let after: MemeId | null | undefined = undefined;
      let match: Record<string, unknown> | undefined = undefined;
      let regexMatch: Record<string, unknown> | undefined = undefined;

      try {
        after = req.query.after ? new ObjectId(req.query.after.toString()) : null;
      } catch {
        throw new ValidationError(`invalid meme_id "${req.query.after.toString()}"`);
      }

      try {
        match = JSON.parse((req.query.match || '{}').toString());
        regexMatch = JSON.parse((req.query.regexMatch || '{}').toString());
      } catch (e) {
        throw new ValidationError(`bad match or regexMatch: ${e}`);
      }

      if (match && regexMatch) {
        sendHttpOk(res, {
          memes: await searchMemes({
            after,
            // @ts-expect-error: validation is handled
            match,
            // @ts-expect-error: validation is handled
            regexMatch
          })
        });
      }
    },
    { req, res, methods: ['GET'], apiVersion: 1 }
  );
}
