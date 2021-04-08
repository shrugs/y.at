import { getCount } from '../../lib/db';
import { guardOnlyGet, handler, yup } from '../../lib/handler';

export default handler(async function count(req, res) {
  guardOnlyGet(req, res);

  const count = await getCount();

  return yup(res, { count });
});
