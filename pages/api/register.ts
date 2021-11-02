import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../util/auth';

// seding username and pw to api
export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      errors: [{ message: 'Please enter both username and password' }],
    });
    return;
  }
  const username = req.body.username;
  const passwordHash = await hashPassword(req.body.password);
  res.send(null);
}
