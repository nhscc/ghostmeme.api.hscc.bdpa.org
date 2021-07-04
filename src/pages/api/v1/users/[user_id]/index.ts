import { getUser, deleteUser, updateUser } from 'universe/backend';
import { sendHttpOk } from 'multiverse/next-respond';
import { wrapHandler } from 'universe/backend/middleware';
import { ObjectId } from 'mongodb';
import { GuruMeditationError, ValidationError } from 'universe/backend/error';

import type { NextApiResponse, NextApiRequest } from 'next';
import type { UserId } from 'types/global';

// ? This is a NextJS special "config" export
export { defaultConfig as config } from 'universe/backend/middleware';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await wrapHandler(
    async ({ req, res }) => {
      const param = req.query.user_id;
      let user_id: UserId | undefined = undefined;
      let username: string | undefined = undefined;

      try {
        user_id = new ObjectId(param.toString());
      } catch {
        if (req.method != 'GET' || typeof param != 'string' || !param.length)
          throw new ValidationError(`invalid user_id "${req.query.user_id.toString()}"`);
        else username = param;
      }

      if (req.method == 'GET') {
        sendHttpOk(res, { user: await getUser(user_id ? { user_id } : { username }) });
      } else if (!user_id) {
        throw new GuruMeditationError('sanity check failed: user_id is missing');
      } else if (req.method == 'DELETE') {
        await deleteUser({ user_id });
        sendHttpOk(res);
      } else {
        // * PUT
        await updateUser({ user_id, data: req.body });
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
