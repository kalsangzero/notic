import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
// import { verifyCsrfToken } from '../../util/csrf';
import {
  createSession,
  deleteExpiredSessions,
  getUserWithPasswordHashByUsername,
  insertUser,
  User,
} from '../../util/database';
import { Errors } from '../../util/types';

export type RegisterRequest = {
  username: string;
  password: string;
};

export type RegisterResponse = { errors: Errors } | { user: User };

export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      errors: [{ message: 'Request does not contain username and password' }],
    });
    return; // return right away
  }
  if (req.body.password.length < 5) {
    res.status(400).send({
      errors: [{ message: 'Password must contain atleast 5 letters.' }],
    });
    return;
  }
  if (!req.body.firstName || !req.body.lastName) {
    res.status(400).send({
      errors: [{ message: 'Please insert First and Last names' }],
    });
    return; // return right away
  }
  // if (!req.body.csrfToken || !verifyCsrfToken(req.body.csrfToken)) {
  //   res.status(400).send({
  //     errors: [{ message: 'Request does not contain valid CSRF token' }],
  //   });
  //   return;
  // }

  try {
    const username = req.body.username;

    const existingUser = await getUserWithPasswordHashByUsername(username);
    if (existingUser) {
      res.status(400).send({
        errors: [{ message: 'Username already exists' }],
      });
      return;
    }

    const passwordHash = await hashPassword(req.body.password);

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const user = await insertUser({
      username: username,
      passwordHash: passwordHash,
      firstName: firstName,
      lastName: lastName,
    });

    if (!user) {
      res.status(500).send({ errors: [{ message: 'User not create' }] });
      return;
    }
    // clean old sessions
    deleteExpiredSessions();
    // Create the record in the sessions table with a new token

    // 1. create the token
    const token = crypto.randomBytes(64).toString('base64');

    // 2. do a DB query to add the session record
    const newSession = await createSession(token, user.id);

    // set the response to create the cookie in the browser

    const cookie = createSerializedRegisterSessionTokenCookie(newSession.token);

    res.status(200).setHeader('set-Cookie', cookie).send({ user: user });
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
