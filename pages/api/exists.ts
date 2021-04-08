import { doesOriginExist } from '../../lib/db';
import { guardOnlyGet, handler, yup } from '../../lib/handler';
import { isValidOrigin } from '../../lib/validation';

export default handler(async function exists(req, res) {
  guardOnlyGet(req, res);

  const origin = req.query.origin as string;
  if (!isValidOrigin(origin)) return yup(res, { exists: true });

  const exists = await doesOriginExist(origin);
  if (exists) return yup(res, { exists: true });

  return yup(res, { exists: false });
});
