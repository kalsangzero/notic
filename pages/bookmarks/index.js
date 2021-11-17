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
const inputBox = css`
  margin-left: 5px;
  width: 600px;
  height: 100px;
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
  const [showForm, SetShowForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const router = useRouter();
  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  }
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
    SetShowForm(true);
    setTime(playerRef.current.getCurrentTime());
  };
  const showFormFunction = () => {
    return (
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
              onChange={(event) => setBookmarkname(event.currentTarget.value)}
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
        <button onClick={createFullBookmark}>Save</button>
      </form>
    );
  };

  async function deleteBookmark(id) {
    const bookmarkResponse = await fetch(`/api/bookmarks`, {
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

  async function updateBookmark(id, bookmarkname, note) {
    const bookmarkResponse = await fetch(`${props.baseUrl}/api/bookmarks`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookmarkname: bookmarkname, note: note }),
    });

    const updatedBookmark = await bookmarkResponse.json();

    const newSate = [...bookmarkList];

    const outdatedBookmark = newSate.find(
      (bookmark) => bookmark.id === updatedBookmark.id,
    );

    outdatedBookmark.bookmarkname = updatedBookmark.bookmarkname;
    outdatedBookmark.note = updatedBookmark.note;

    setBookmarkList(newSate);
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
          <h2>Note List</h2>
          {showForm ? showFormFunction() : null}
          {console.log('bmlist', bookmarkList)}
          {bookmarkList.map((bookmark) => (
            <div key={`bookmark-li-${bookmark.id}`}>
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
                      value={bookmark.bookmarkname}
                      onChange={(event) => event.currentTarget.value}
                    />
                  </label>
                </h1>
                <p style={{ margin: '0px', paddingLeft: '10px' }}>
                  {bookmark.time}
                  <span style={{ marginLeft: '100px' }}>
                    <button
                      onClick={() => {
                        deleteBookmark(bookmark.id);
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
                    <button
                      onClick={() => {
                        deleteBookmark(bookmark.id);
                      }}
                    >
                      <EditIcon
                        style={{
                          width: '20px',
                          height: '30px',
                          padding: '0px',
                          margin: '0px',
                        }}
                      />
                    </button>
                  </span>
                  {console.log('bookmarkdbstime', bookmark.time)}
                </p>

                <label>
                  <textarea
                    value={bookmark.note}
                    css={inputBox}
                    rows="60"
                    cols="60"
                    name="content"
                    placeholder="Enter Notes here..."
                    onChange={(event) => event.currentTarget.value}
                  />
                </label>

                <button>Save</button>
              </form>
            </div>
          ))}
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
