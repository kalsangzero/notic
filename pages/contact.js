import { css } from '@emotion/react';
import Head from 'next/head';
import Layout from '../Component/Layout';

const frontPage = css`
  justify-content: center;
  text-align: center;
  background-image: url('/contact.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  width: 100%;
  height: 100%;
`;
const registercss = css`
  margin: 262px 0;
`;

export default function Contact(props) {
  return (
    <main css={frontPage}>
      <Layout username={props.username}>
        <div css={registercss}>
          <Head>
            <title>Contact Page</title>
          </Head>

          <p>
            we are also constantly working to make the service better each day.
            we would love to hear your feedback & suggestions to make notic
            better.
            <br /> You can write to us on support@notic.in or get in touch even
            faster on Twitter @kalsangcoder
          </p>
        </div>
      </Layout>
    </main>
  );
}
