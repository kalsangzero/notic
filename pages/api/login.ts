import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPassword } from '../../util/auth';
import { createSerializedRegisterSessionTokenCookie } from '../../util/cookies';
import {
  createSession,
  deleteExpiredSessions,
  getUserWithPasswordHashByUsername,
  User,
} from '../../util/database';
import { Errors } from '../../util/types';

export type LoginResponse = { errors: Errors } | { user: User };

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>,
  // catchinng the response
) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      errors: [{ message: 'Request does not contain username and password' }],
    });
    return;
  }

  try {
    const username = req.body.username;

    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      username,
    );
    // here u r calling database and asking are these username and passwordhash valid

    // Username doesn't match anything in the database
    if (!userWithPasswordHash) {
      res.status(401).send({
        errors: [{ message: 'Username or password does not match' }],
      });
      return;
    }

    const isPasswordVerified = await verifyPassword(
      req.body.password,
      userWithPasswordHash.passwordHash,
    );

    // Password doesn't match hash in the database
    if (!isPasswordVerified) {
      res.status(401).send({
        errors: [{ message: 'Username or password does not match' }],
      });
      return;
    }

    // // clean old sessions
    deleteExpiredSessions();

    // Create the record in the sessions table with a new token

    // 1. create the token (using crypto, which is already in node(no need to yarn add))
    const token = crypto.randomBytes(64).toString('base64');

    // 2. do a DB query to add the session record
    const newSession = await createSession(token, userWithPasswordHash.id);
    console.log('newSession', newSession);
    // set the response to create the cookie in the browser (we need a library for that)

    const cookie = createSerializedRegisterSessionTokenCookie(newSession.token);

    // Important! Removing the password
    // hash from the response sent back
    // to the user
    const { passwordHash, ...user } = userWithPasswordHash;

    res.status(200).setHeader('Set-Cookie', cookie).send({ user: user });
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
