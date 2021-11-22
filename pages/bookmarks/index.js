import { css, jsx } from '@emotion/react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import { useRef, useState } from 'react';
import Layout from '../../Component/Layout';
import ResponsivePlayer from '../../Component/ResponsivePlayer';

const videoPage = css`
  display: flex;
  position: relative;
`;

const buttonStyle = css`
  margin: 0px;
  padding-left: 10px;
  cursor: pointer;
`;

const inputBox = css`
  margin: 5px 0 5px 10px;
  width: 600px;
  height: 100px;
  border-radius: 5px;
  background-color: rgb(255, 255, 255);
  box-sizing: content-box;
  border: solid black;
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
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const createFullBookmark = async () => {
    const bookmarkResponse = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookmarkname: bookmarkname,
        note: note,
        time: time,
      }),
    });
    const bookmark = await bookmarkResponse.json();
    if ('errors' in bookmark) {
      setErrors(bookmark.errors);
      return;
    }
    const newState = { ...bookmarkList, bookmark };
    setBookmarkList(newState);
  };

  const addBookmark = () => {
    setShowForm(true);
    setTime(playerRef.current.getCurrentTime());
  };
  const showFormFunction = () => {
    return (
      <form
        onSubmit={async (event) => {
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
              onChange={(event) => setBookmarkname(event.currentTarget.value)}
            />
          </label>
        </h1>
        <p style={{ margin: '0px', paddingLeft: '12px' }}>{time}</p>

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
        <button style={{ marginLeft: '10px' }} onClick={createFullBookmark}>
          Save
        </button>
      </form>
    );
  };

  async function deleteBookmark(id) {
    const bookmarkResponse = await fetch(`/api/bookmarks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const deletedBookmark = await bookmarkResponse.json();
    const newState = bookmarkList.filter(
      (bookmark) => bookmark.id !== deletedBookmark.id,
    );
    setBookmarkList(newState);
  }

  // Stretch goals Update
  // async function updateBookmark(id, newName, newNote) {
  //   const bookmarkResponse = await fetch(`/api/bookmarks/${id}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ bookmarkname: newName, note: newNote }),
  //   });

  //   const updatedBookmark = await bookmarkResponse.json();

  //   const newState = [...bookmarkList];

  //   const outdatedBookmark = newState.find(
  //     (bookmark) => bookmark.id === updatedBookmark.id,
  //   );

  //   outdatedBookmark.bookmarkname = updatedBookmark.bookmarkname;
  //   outdatedBookmark.note = updatedBookmark.note;

  //   setBookmarkList(newState);
  // }
  return (
    <Layout username={props.username}>
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
        />
        <div css={formStyles}>
          <h2>Note List</h2>
          {showForm ? showFormFunction() : null}
          {bookmarkList.map((bookmark) => {
            return (
              <div key={`bookmark-li-${bookmark.id}`}>
                <p style={{ margin: '20px 0px 0px 0px ', paddingLeft: '10px' }}>
                  <button
                    css={buttonStyle}
                    onClick={() => {
                      playerRef.current.seekTo(bookmark.time);
                    }}
                  >
                    <span style={{ marginRight: '20px', fontSize: '16px' }}>
                      {bookmark.bookmarkname}
                    </span>
                    {bookmark.time}
                  </button>

                  <button
                    style={{ float: 'right', marginRight: '90px' }}
                    onClick={() => {
                      deleteBookmark(bookmark.id);
                    }}
                  >
                    remove
                  </button>
                </p>
                <p css={inputBox}>{bookmark.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  const { getBookmarks } = await import('../../util/database');
  // const { getVideo } = await import('../../util/database');

  // const video = await getVideo(context.query.videoId);

  const bookmarks = await getBookmarks();

  return {
    props: {
      bookmarks,
      // video,
    },
  };
}
