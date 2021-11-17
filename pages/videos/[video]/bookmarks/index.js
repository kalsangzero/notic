import { css, jsx } from '@emotion/react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import { useRef, useState } from 'react';
import Layout from '../../../../Component/Layout';
import ResponsivePlayer from '../../../../Component/ResponsivePlayer';

const videoPage = css`
  display: flex;
  position: relative;
`;
const inputBox = css`
  margin-left: 5px;
  width: 600px;
  height: 600px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  border: 5px double solid rgb(229, 232, 235);
  flex-wrap: wrap;
  display: flex;
  padding: 10px;
`;

const formStyles = css`
  position: relative;
  width: 100%;

  label {
    display: block;
  }
  button {
    margin: 10px;
    padding: 5px 10px;
    background-color: none;
  }
`;
export default function Home(props) {
  const [bookmarkList, setBookmarkList] = useState(props.bookmarks);
  const [bookmarkname, setBookmarkname] = useState('');
  const [note, setNote] = useState('');
  const [time, setTime] = useState('TimeMark');
  const [videoUrl, setVideoUrl] = useState('https://youtu.be/-iun6KPT4SM');
  const playerRef = useRef();
  const controlsRef = useRef();
  const canvasRef = useRef();
  const [bookmarks, setBookmarks] = useState([]);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const addBookmark = async () => {
    const canvas = canvasRef.current;
    canvas.width = '160px';
    canvas.height = '90px';
    const dataUrl = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    const bookmarksCopy = [...bookmarkList];
    bookmarksCopy.push({
      time: playerRef.current.getCurrentTime(),
      bookmarkname: bookmarks.boomarkname,
      note: bookmarks.note,
    });
    setBookmarkList(bookmarksCopy);
    console.log('bookmarkcopy', bookmarksCopy);

    const registerResponse = await fetch('/api/videos/[videoId]/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time: playerRef.current.getCurrentTime(),
      }),
    });
    const bookmark = await registerResponse.json();
    if ('errors' in bookmark) {
      setErrors(bookmark.errors);
      return;
    }
    // console.log(videoJson.video);
    const newState = { ...bookmarkList, bookmark };
    setBookmarkList(newState);
  };

  async function deleteBookmark(id) {
    const bookmarksResponse = await fetch(`/api/bookmarks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const deletedBookmark = await bookmarksResponse.json();
    const newState = bookmarkList.filter(
      (bookmark) => bookmark.id !== deletedBookmark.id,
    );
    setBookmarkList(newState);
  }

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }
  return (
    <Layout>
      <Head>
        <title>Notic</title>
        <meta name="description" content="created by Kalsang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={videoPage}>
        <ResponsivePlayer
          url={videoUrl}
          playerRef={playerRef}
          addBookmark={addBookmark}
          formatDuration={formatDuration}
        />
        <div css={formStyles}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <h1
              style={{
                margin: 0,
                paddingLeft: '10px',
                fontSize: '32px',
                width: '120px',
                height: '48px',
              }}
            >
              <label>
                <input
                  value={bookmarkname}
                  onChange={(event) =>
                    setBookmarkname(event.currentTarget.value)
                  }
                />
              </label>
            </h1>
            <p style={{ margin: '0px', paddingLeft: '10px' }}>{time}</p>

            <label>
              <textarea
                value={note}
                css={inputBox}
                rows="60"
                cols="60"
                name="content"
                placeholder="Enter Notes here..."
                onChange={(event) => setNote(event.currentTarget.value)}
              />
            </label>
            <button>Save</button>
          </form>
        </div>
      </div>
      <Grid container style={{ marginTop: 20 }} spacing={3}>
        {bookmarkList.map((bookmark) => (
          <Grid key={`bookmark-li-${bookmark.id}`}>
            <Paper
              onClick={() => {
                playerRef.current.seekTo(bookmark.time);
                // controlsRef.current.visibility = 'visible';
                // setTimeout(() => {
                //   controlsRef.current.visibility = 'hidden';
                // }, 1000);
                setBookmarkname(bookmark.bookmarkname);
                setTime(bookmark.time);
                setNote(bookmark.note);
              }}
              elevation={3}
            >
              <img crossOrigin="anonymous" src={bookmark.image} alt="d" />
              <Typography variant="body2" align="center">
                bookmark at {formatDuration(Math.round(bookmark.time))}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <canvas ref={canvasRef} />
    </Layout>
  );
}
export async function getServerSideProps() {
  const { getBookmarks } = await import('../../../../util/database');
  // const { getVideo } = await import('../../util/database');

  // const video = await getVideo(context.query.videoId);

  const bookmarks = await getBookmarks();

  //  { id: '6', bookmarkname: 'Andrea', favoriteColor: 'purple' },

  return {
    props: {
      bookmarks,
      // video,
    },
  };
}
