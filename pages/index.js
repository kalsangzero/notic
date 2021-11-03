import { css, jsx } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import BookmarkDisplay from '../Component/BookmarkDisplay';
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
  const [bookmarks, setBookmarks] = useState([]);
  return (
    <div>
      <Head>
        <title>Notic</title>
        <meta name="description" content="created by Kalsang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={videoPage}>
        <ResponsivePlayer url={url} />
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
        <BookmarkDisplay bookmark={bookmarks} setBookmarks={setBookmarks} />
      </div>
    </div>
  );
}
