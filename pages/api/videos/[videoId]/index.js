// Single video and getbookmarks

import {
  deleteBookmarkById,
  deleteVideoById,
  getBookmarks,
  getVideo,
  insertBookmark,
  updateBookmarkById,
  updateVideoById,
} from '../../../../util/database';

export default async function registerHandler(req, res) {
  try {
    if (req.method === 'GET') {
      const video = await getVideo(Number(req.query.videoId));
      res.status(200).json(video);
    } else if (req.method === 'DELETE') {
      console.log('query', req.query);
      // the code for the POST request
      const deletedVideo = await deleteVideoById(Number(req.query.videoId));

      return res.status(200).json(deletedVideo);
    } else if (req.method === 'PATCH') {
      const body = req.body;
      const query = req.query;

      const updatedVideo = await updateVideoById(Number(query.videoId), {
        videoname: body.videoname,
        url: body.url,
      });

      return res.status(200).json(updatedVideo);
    }

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

    return res.status(405);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message }] });
  }
}
