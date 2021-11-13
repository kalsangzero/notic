import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../Component/Layout';

export default function Home() {
  const frontPage = css`
    justify-content: center;
    text-align: center;
    padding: 10px;
  `;
  const heading = css`
    justify-content: center;
    text-align: center;
    padding: 50px;
    margin: 50px 50px 10px;
  `;
  const buttontype = css`
    margin: 24px;
    padding: 10px 20px;
    font-size: 24px;
    cursor: pointer;
    border-radius: 5px;
    :hover {
      background-color: white;
      color: orange;
    }
  `;

  //   window is not defined shown because even our frontend code are rendered in the backend.
  // next js does server side rendering , next js gonna render it in backend, and gonna send front end

  return (
    <Layout>
      <div css={frontPage}>
        <Head>
          <title>Home Page</title>
        </Head>
        <div css={heading}>
          <h1>Welcome to Notic</h1>
          {/* Layout is already applied so we dont have to put the layout here */}
          <h1 style={{ margin: '20px', fontSize: '50px' }}>
            Bookmark videos with Timestamps.
          </h1>
          <h2 style={{ margin: '10px', fontSize: '40px' }}>
            Watch them later anytime on any device
          </h2>
        </div>
        <p
          style={{
            padding: ' 20px 100px',
            margin: '0 200px',
            fontSize: '20px',
          }}
        >
          Welcome to Notic! Bookmark videos with timestamps easily. Watch them
          later anytime on any device. Ever stumbled upon an awesome video and
          cannot watch it immediately? Notic allows you to bookmark videos
          across the web with a single tap and watch it later on your Pc
        </p>
        <img
          style={{ margin: '10px 20px' }}
          src="/aboutpic1.png"
          alt="aboutpic1"
          width="500px"
          height="300px"
        />
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
          show up in your mobiles device in the New section. You can revisit
          videos again in the Watched section or even mark videos as favourite
          for quick access. You will never miss watching your favourite videos
          with notic. Get started by downloading the browser extensions on
          https://notic.co We are also constantly working to make the service
          better each day. We would love to hear your feedback & suggestions to
          make notic better. You can write to us on support@nfnlabs.in or get in
          touch even faster on Twitter @getnotic Notic is easy Video
          Bookmarking. Enjoy the Videos! :)
        </p>
        <Link href="/users">
          <a css={buttontype}>VideosMarker</a>
        </Link>
        {/* react by default dont show undefined true false (boolean),
      therefore u need to stringify it */}
      </div>
    </Layout>
  );
}
