// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createVideo, getVideos } from '../../../util/database';

export default async function handler(req, res) {
  // console.log('query', req.query);
  // console.log('body', req.body);
  // console.log('method', req.method);

  if (req.method === 'GET') {
    const videos = await getVideos();
    return res.status(200).json(videos);
  } else if (req.method === 'POST') {
    const body = req.body;

    // the code for the POST request
    const createdVideo = await createVideo({
      videoname: body.videoname,
      url: body.url,
    });

    return res.status(200).json(createdVideo);
  }

  return res.status(405);
}
