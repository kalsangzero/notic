import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { insertVideo, User, Video } from '../../util/database';
import { Errors } from '../../util/types';

export type RegisterRequest = {
  url: string;
  videoname: string;
  profileId: string;
};

export type RegisterResponse = { errors: Errors } | { video: Video };

export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (!req.body.videoname) {
    res.status(400).send({
      errors: [{ message: 'Please insert Name of the Video' }],
    });
    return; // return right away
  }
  if (!req.body.url) {
    res.status(400).send({
      errors: [{ message: 'Insert the url of the Video' }],
    });
    return; // return right away
  }

  if (!req.body.profileId) {
    res.status(400).send({
      errors: [{ message: 'Please insert Id' }],
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
    const url = req.body.url;

    const videoname = req.body.videoname;

    const profileId = req.body.profileId;

    const video = await insertVideo({
      videoname: videoname,
      url: url,
      profileId: profileId,
    });

    //   // clean old sessions
    //   deleteExpiredSessions();

    if (!video) {
      res.status(500).send({ errors: [{ message: 'Video not create' }] });
      return;
    }

    //   // Create the record in the sessions table with a new token

    //   // 1. create the token
    //   const token = crypto.randomBytes(64).toString('base64');

    //   // 2. do a DB query to add the session record
    //   const newSession = await createSession(token, user.id);

    //   // set the response to create the cookie in the browser

    //   const cookie = createSerializedRegisterSessionTokenCookie(newSession.token);

    res.status(200).send({ video: video });
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
