import { css, jsx } from '@emotion/react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Head from 'next/head';
import Link from 'next/link';
import { useRef, useState } from 'react';
import ResponsivePlayer from '../Component/ResponsivePlayer';

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
export default function Home() {
  const [content, setContent] = useState('');
  const [noteName, setNoteName] = useState('Note');
  const [timeMark, setTimeMark] = useState('TimeMark');
  const [url, setUrl] = useState('https://youtu.be/t6MXHczeEqc');
  const playerRef = useRef();
  const controlsRef = useRef();
  const canvasRef = useRef();
  const [bookmarks, setBookmarks] = useState([]);
  const format = (seconds) => {
    if (isNaN(seconds)) {
      return `00:00`;
    }
  };
  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = '160px';
    canvas.height = '90px';
    const dataUri = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    const bookmarksCopy = [...bookmarks];
    bookmarksCopy.push({
      time: playerRef.current.getCurrentTime(),
      bookmarkname: bookmarks.bookmarkname,
      note: bookmarks.note,
    });
    setBookmarks(bookmarksCopy);
  };
  return (
    <div>
      <Head>
        <title>Notic</title>
        <meta name="description" content="created by Kalsang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={videoPage}>
        <ResponsivePlayer
          url={url}
          playerRef={playerRef}
          addBookmark={addBookmark}
        />
        <div css={formStyles}>
          <h1 style={{ margin: 0, paddingLeft: '10px' }}>{noteName}</h1>
          <p style={{ margin: '0px', paddingLeft: '10px' }}>{timeMark}</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label>
              <textarea
                value={content}
                css={inputBox}
                rows="60"
                cols="60"
                name="content"
                placeholder="Enter Notes here..."
                onChange={(event) => setContent(event.currentTarget.value)}
              />
            </label>
            <button>Save</button>
            <Link href="/users">
              <a>Marketplace</a>
            </Link>
          </form>
        </div>
      </div>
      <Grid container style={{ marginTop: 20 }} spacing={3}>
        {bookmarks.map((bookmark, index) => (
          <Grid key={index} item>
            <Paper
              onClick={() => {
                playerRef.current.seekTo(bookmark.time);
                // controlsRef.current.visibility = 'visible';
                // setTimeout(() => {
                //   controlsRef.current.visibility = 'hidden';
                // }, 1000);
              }}
              elevation={3}
            >
              <img crossOrigin="anonymous" src={bookmark.image} alt="d" />
              <Typography variant="body2" align="center">
                bookmark at {format(bookmark.time)}
              </Typography>
            </Paper>
          </Grid>
        ))}
        {console.log('bookmark', bookmarks)}
      </Grid>
      <canvas ref={canvasRef} />
    </div>
  );
}
