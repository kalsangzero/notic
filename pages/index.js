import { css } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../Component/Layout';

export default function Home() {
  const frontPage = css`
    justify-content: center;
    text-align: center;
    background-image: url('/123.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    color: white;
  `;
  const heading = css`
    justify-content: center;
    text-align: center;
    padding: 50px;
    margin: 160px 50px 40px;
  `;
  const buttontype = css`
    margin: 24px;
    padding: 10px 20px;
    font-size: 24px;
    cursor: pointer;
    border-radius: 5px;
    :hover {
      background-color: white;
      color: #ff1966;
    }
  `;

  //   window is not defined shown because even our frontend code are rendered in the backend.
  // next js does server side rendering , next js gonna render it in backend, and gonna send front end

  return (
    <div css={frontPage}>
      <CssBaseline />
      <Layout>
        <Head>
          <title>Home Page</title>
        </Head>
        <div css={heading}>
          <h1>
            Welcome to
            <span style={{ fontSize: '40px', paddingLeft: '10px' }}>notic</span>
          </h1>
          <h1 style={{ margin: '40px 0px 0px', fontSize: '60px' }}>
            Bookmark videos with Timestamps
          </h1>
          <h2 style={{ margin: '10px', fontSize: '40px' }}>
            Take notes and watch them later
          </h2>
        </div>
        <p
          style={{
            padding: ' 20px 100px',
            margin: '0 200px',
            fontSize: '20px',
          }}
        >
          Ever stumbled upon an awesome video and cannot watch it immediately?
          Notic allows you to bookmark Timestamps across the Video with a single
          tap and easily take notes on the side and save it for future
          reference.
        </p>

        <br />

        {/* {button to toggle on off}
      local storage is always string
      state variable will allow toggle to function on the div below*/}
        <br />
        <p
          style={{
            padding: '50px 100px',
            margin: '0 200px',
            fontSize: '20px',
          }}
        >
          No more copy pasting links in your notes app or remembering keywords
          to search the video later. Even Save link or Watch it later options on
          sites require multiple taps to save or retrieve the videos when you
          are ready to watch them. With notic you can bookmark videos with a
          single tap using our browser extensions for Chrome. The currently
          supported sites where you can Notic videos easily are Facebook,
          YouTube, Vimeo, Dailymotion and Reddit. Lookout for the Notic Button
          or Icon next to the video title. All recently bookmarked videos will
          show up in your device in a seperatesection. You can revisit videos
          timestamp again and also edit the notes. You will never miss
          aparticular topic taught bookmarked Video with notic. Notic is easy
          Video Bookmarking. Enjoy notic!
        </p>
        <Link href="/users">
          <a css={buttontype}>VideosMarker</a>
        </Link>
        {/* react by default dont show undefined true false (boolean),
      therefore u need to stringify it */}
      </Layout>
    </div>
  );
}
