// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteVideoById,
  getVideos,
  insertVideo,
  updateVideoById,
} from '../../../util/database';

export default async function registerHandler(req, res) {
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

  // if (!req.body.csrfToken || !verifyCsrfToken(req.body.csrfToken)) {
  //   res.status(400).send({
  //     errors: [{ message: 'Request does not contain valid CSRF token' }],
  //   });
  //   return;
  // }

  try {
    if (req.method === 'GET') {
      const videos = await getVideos();
      return res.status(200).json(videos);
    } else if (req.method === 'POST') {
      const body = req.body;

      // the code for the POST request
      const createdVideo = await insertVideo({
        videoname: body.videoname,
        url: body.url,
      });
      if (!createdVideo) {
        res.status(500).send({ errors: [{ message: 'Video not create' }] });
        return;
      }
      return res.status(200).json(createdVideo);
    } else if (req.method === 'DELETE') {
      console.log('query', req.query);
      // the code for the POST request
      const deletedVideo = await deleteVideoById(Number(req.query.videoId));

      return res.status(200).json(deletedVideo);
    } else if (req.method === 'PATCH') {
      const body = req.body;
      const query = req.query;

      const updatedVideo = await updateVideoById(Number(query.videoId), {
        videoname: body.videoame,
        url: body.url,
      });

      return res.status(200).json(updatedVideo);
    }

    return res.status(405);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message }] });
  }
}
