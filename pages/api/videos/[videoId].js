// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  deleteVideoById,
  getVideo,
  updateVideoById,
} from '../../../util/database';

export default async function handler(req, res) {
  console.log('query', req.query);
  // console.log('body', req.body);
  // console.log('method', req.method);

  if (req.method === 'GET') {
    const video = await getVideo(Number(req.query.userId));
    res.status(200).json(video);
  } else if (req.method === 'DELETE') {
    console.log('query', req.query);
    // the code for the POST request
    const deletedVideo = await deleteVideoById(Number(req.query.userId));

    return res.status(200).json(deletedVideo);
  } else if (req.method === 'PATCH') {
    const body = req.body;
    const query = req.query;

    const updatedVideo = await updateVideoById(Number(query.userId), {
      videoname: body.videoame,
      url: body.url,
    });

    return res.status(200).json(updatedVideo);
  }

  return res.status(405);
}
