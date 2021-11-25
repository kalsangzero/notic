import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../Component/Layout';

const frontPage = css`
  justify-content: center;
  text-align: center;
  background-color: black;
  /* background-image: url('/start.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat; */
  color: white;
  width: 100%;
  height: 100%;
`;

const formStyles = css`
  margin-top: 120px;
  label {
    display: block;
  }
`;
const headingcss = css`
  margin-top: 200px;
`;

const imageParaStyle = css`
  display: flex;
  justify-content: space-evenly;
  margin-top: 100px;
`;

const paraStyle = css`
  width: 500px;
  align-items: center;
  padding-top: 100px;
  font-size: large;
  justify-content: center;
`;

export default function User(props) {
  return (
    <main css={frontPage}>
      <Layout username={props.username}>
        <Head>
          <title>single user</title>
        </Head>

        <h1 css={headingcss}>Hello {props.user.username}!</h1>
        <p style={{ marginTop: '50px', fontSize: 'large' }}>
          we at notic are happy to have you and you can get started with
          creating video bookmarks
          <Link href="/videos">
            <a> here</a>
          </Link>
        </p>
        <div css={formStyles}>
          <h2>
            New User? then let me give you a brief run down of how you can use
            Notic <br />
            to make your learning experience much easier.
          </h2>
          <div css={imageParaStyle}>
            <Image
              src="/short3.png"
              alt="Picture of the author"
              width={650}
              height={350}
            />
            <p css={paraStyle}>
              Simply Select Videos on the Navigation which allows you to access
              the videos you have bookmarked or create a new video bookmark.
            </p>
          </div>
          <div css={imageParaStyle}>
            <p css={paraStyle}>
              Now give your own Title name which discribes the Video and what
              you would be implementing inside. The currently supported sites
              where you can Notic videos easily are publicly viewable videos on
              Facebook, YouTube, Vimeo, Dailymotion and Reddit. Copy the
              URL-link of the Video that you would like to mark some bookmarks
              and then paste it in the url input.
            </p>
            <Image
              src="/short1.png"
              alt="upload a video image"
              width={650}
              height={350}
            />
          </div>

          <div css={imageParaStyle}>
            <Image
              src="/short2.png"
              alt="Picture of the author"
              width={650}
              height={350}
            />
            <p css={paraStyle}>
              When u click register, the Video would be added to the Video list
              down below. There you can also delete Videos. When you click on
              the Video, it will take you to Video Bookmark page with loaded
              Video.
            </p>
          </div>
          <div css={imageParaStyle}>
            <p css={paraStyle}>
              Under the Video there are Controls and below is the Bookmark Icon.
              In the middle of the video, whenever u want to crete a bookmark,
              simply click the Bookmark Icon.
            </p>
            <Image
              src="/short 4.png"
              alt="upload a video image"
              width={650}
              height={350}
            />
          </div>
          <div css={imageParaStyle}>
            <Image
              src="/short5.png"
              alt="picture create a bookmark"
              width={650}
              height={350}
            />
            <p css={paraStyle}>
              A Form will pop up which will allow you to Name the current Topic
              and also write a note. On clicking save, The name and note would
              save to that Current Time of the video Played.
            </p>
          </div>
          <div css={imageParaStyle}>
            <p css={paraStyle}>
              Atlast your saved Videos would be displayed on the side of the
              video and when you click on the video name the video player would
              take you to that time saved on that note.
            </p>
            <Image
              src="/short6.png"
              alt="picture list of bookmarks"
              width={650}
              height={350}
            />
          </div>
          <p style={{ marginTop: '50px', fontSize: 'large' }}>
            You will never miss a particular topic taught bookmarked Video with
            notic. Notic is easy Video Bookmarking.
            <br /> Enjoy notic!
          </p>
        </div>
      </Layout>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { getUser } = await import('../../util/database');
  console.log(getUser);
  const user = await getUser(context.query.userId);
  const { getVideos } = await import('../../util/database');
  const videos = await getVideos();

  //  { id: '6', name: 'Andrea', favoriteColor: 'purple' },

  return {
    props: {
      user,
      videos,
    },
  };
}
