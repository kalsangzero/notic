// Single bookmark

import {
  deleteBookmarkById,
  getBookmark,
  updateBookmarkById,
} from '../../../../../util/database';

export default async function registerHandler(req, res) {
  try {
    if (req.method === 'GET') {
      const bookmark = await getBookmark(Number(req.query.bookmarkId));
      res.status(200).json(bookmark);
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

      const updatedBookmark = await updateBookmarkById(
        Number(query.bookmarkId),
        {
          bookmarkname: body.bookmarkname,
          note: body.note,
        },
      );

      return res.status(200).json(updatedBookmark);
    }

    return res.status(405);
  } catch (err) {
    res.status(500).send({ errors: [{ message: err.message }] });
  }
}
