import { css } from '@emotion/react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../Component/Layout';

const productLayout = css`
  display: flex;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
`;
const heading = css`
  margin: 50px 0 0 0;
  font: bold;
  justify-content: center;
  text-align: center;
  font-size: 32px;
`;

const frontPage = css`
  justify-content: center;
  text-align: center;
  background-image: url('/space.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  width: 100%;
  height: 100%;
`;

const singleImage = css`
  display: flex;
  padding: 0px 30px;
  margin: 24px;
  position: relative;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(229, 232, 235);
`;
const formStyles = css`
  label {
    display: block;
  }
`;

const errorsStyles = css`
  color: red;
`;

export default function RegisterPage(props) {
  const [videoList, setVideoList] = useState(props.videos);
  const [videoname, setVideoname] = useState('');

  const [url, setUrl] = useState('');

  const [errors, setErrors] = useState([]);

  async function createVideo() {
    const videoResponse = await fetch(`/api/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoname, url }),
    });

    const video = await videoResponse.json();
    const newSate = [...videoList, video];
    setVideoList(newSate);
  }
  async function deleteVideo(id) {
    const videosResponse = await fetch(`/api/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const deletedVideo = await videosResponse.json();
    const newState = videoList.filter((video) => video.id !== deletedVideo.id);
    setVideoList(newState);
  }
  return (
    <main css={frontPage}>
      <Layout username={props.username}>
        <form
          css={formStyles}
          onSubmit={async (event) => {
            event.preventDefault();
          }}
        >
          <h1>Create a VideoBookmark</h1>
          <label>
            Video Name:
            <br />
            <input
              value={videoname}
              onChange={(event) => setVideoname(event.currentTarget.value)}
            />
          </label>
          <label>
            url:
            <br />
            <input
              value={url}
              onChange={(event) => setUrl(event.currentTarget.value)}
            />
          </label>

          <button onClick={() => createVideo()}>Register</button>
        </form>

        <div css={errorsStyles}>
          {errors.map((error) => (
            <div key={`error-${error.message}`}>{error.message}</div>
          ))}
        </div>
        <div>
          <h2 css={heading}>Video List</h2>
          <div css={productLayout}>
            {/* props is collected from userServersite with name as userList
        and here we use props which has name userList and then map each ..which is shown in the list */}
            {videoList.map((video) => {
              // actually props.liked user
              return (
                <div key={`user-li-${video.id}`}>
                  <div css={singleImage}>
                    <br />
                    <Link href={`/videos/${video.id}`}>
                      <a
                        style={{
                          textDecoration: 'none',
                          color: 'black',
                        }}
                      >
                        <p>{video.videoname}</p>
                      </a>
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      deleteVideo(video.id);
                    }}
                  >
                    <DeleteForeverIcon
                      style={{
                        width: '20px',
                        height: '30px',
                        padding: '0px',
                        margin: '0px',
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    </main>
  );
}

export async function getServerSideProps() {
  const { getVideos } = await import('../../util/database');
  const videos = await getVideos();

  return {
    props: {
      videos,
    },
  };
}
