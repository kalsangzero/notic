import Head from 'next/head';
import Layout from '../Component/Layout';

export default function Contact() {
  return (
    <Layout>
      <div>
        <Head>
          <title>Contact Page</title>
        </Head>

        <p>
          {' '}
          We are also constantly working to make the service better each day. We
          would love to hear your feedback & suggestions to make notic better.
          You can write to us on support@nfnlabs.in or get in touch even faster
          on Twitter @notic
        </p>
      </div>
    </Layout>
  );
}
