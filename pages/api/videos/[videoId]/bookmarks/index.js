// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteBookmarkById,
  getBookmarks,
  getVideo,
  insertBookmark,
  updateBookmarkById,
} from '../../../../../util/database';

export default async function registerHandler(req, res) {
  try {
    const bookmarks = await getBookmarks();
    if (req.method === 'GET') {
      return res.status(200).json(bookmarks);
    } else if (req.method === 'POST') {
      const body = req.body;
      const createdBookmark = await insertBookmark({
        bookmarkname: body.bookmarkname,
        note: body.note,
        time: body.time,
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
        Number(req.query.videoId),
      );

      return res.status(200).json(deletedBookmark);
    } else if (req.method === 'PATCH') {
      const body = req.body;
      const query = req.query;

      const updatedBookmark = await updateBookmarkById(Number(query.videoId), {
        bookmarkname: body.bookmarkname,
        note: body.note,
      });

      return res.status(200).json(updatedBookmark);
    }

    if (req.method === 'GET') {
      const video = await getVideo(Number(req.query.videoId));
      res.status(200).json(video);
    }

    return res.status(405);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message }] });
  }
}
