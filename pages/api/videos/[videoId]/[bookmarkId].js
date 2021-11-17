// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  deleteBookmarkById,
  getBookmark,
  updateBookmarkById,
} from '../../../../util/database';

export default async function handler(req, res) {
  console.log('query', req.query);
  // console.log('body', req.body);
  // console.log('method', req.method);

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

    const updatedVideo = await updateBookmarkById(Number(query.userId), {
      videoname: body.videoame,
      url: body.url,
    });

    return res.status(200).json(updatedVideo);
  }

  return res.status(405);
}
