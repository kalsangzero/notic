// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteBookmarkById,
  getBookmarks,
  insertBookmark,
  updateBookmarkById,
} from '../../../../util/database';

export default async function registerHandler(req, res) {
  if (!req.body.bookmarkname) {
    res.status(400).send({
      errors: [{ message: 'Please insert Name of the Bookmark' }],
    });
    return; // return right away
  }
  if (!req.body.note) {
    res.status(400).send({
      errors: [{ message: 'Insert the url of the Note' }],
    });
    return; // return right away
  }

  try {
    const bookmarks = await getBookmarks();
    if (req.method === 'GET') {
      return res.status(200).json(bookmarks);
    } else if (req.method === 'POST') {
      const body = req.body;
      const createdBookmark = await insertBookmark({
        bookmarkname: body.bookmarkname || null,
        time: body.time ? body.time : null,
        note: body.note || null,
        videoId: body.videoId ? body.videoId : null,
        videoUrl: body.videoUrl ? body.videoUrl : null,
      });
      if (!createdBookmark) {
        res.status(500).send({ errors: [{ message: 'Bookmark not create' }] });
        return;
      }
      return res.status(200).json(createdBookmark);
    } else if (req.method === 'DELETE') {
      console.log('query', req.query);
      // the code for the POST request
      const deletedBookmark = await deleteBookmarkById(
        Number(req.query.bookmarkId),
      );

      return res.status(200).json(deletedBookmark);
    } else if (req.method === 'PATCH') {
      const body = req.body;
      const query = req.query;

      const updatedBookmark = await updateBookmarkById(Number(query.videoId), {
        bookmarkname: body.bookmarkname,
        time: body.time,
        note: body.note,
        videoId: body.videoId,
        videoUrl: body.videoUrl,
      });

      return res.status(200).json(updatedBookmark);
    }

    return res.status(405);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message }] });
  }
}
