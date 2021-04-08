import type { NextApiRequest, NextApiResponse } from 'next';

import { doesOriginExist, setIfNotExists } from '../../lib/db';
import { handler, nope, yup } from '../../lib/handler';
import { isValidDestination, isValidOrigin } from '../../lib/validation';

export default handler(async function claim(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.body.origin as string;
  const destination = req.body.destination as string;

  if (!isValidOrigin(origin)) return nope(res, 400, `Not a valid origin.`);
  if (!isValidDestination(destination)) return nope(res, 400, `Not a valid destination.`);

  const exists = await doesOriginExist(origin);
  if (exists) return nope(res, 400, `'${origin}' already claimed`);

  try {
    await setIfNotExists(origin, destination);
  } catch (error) {
    return nope(res, 500, `Unable to claim ${origin}.`);
  }

  return yup(res, { origin, destination });
});
