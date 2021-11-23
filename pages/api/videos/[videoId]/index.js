// Single video

import {
  deleteVideoById,
  getVideo,
  updateVideoById,
} from '../../../../util/database';

export default async function handler(req, res) {
  console.log('query', req.query);

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

  return res.status(405);
}
