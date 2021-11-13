import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import Layout from '../Component/Layout';
import { Errors } from '../util/types';
import { LoginResponse } from './api/login';

const errorsStyles = css`
  color: red;
`;
const inputStyle = css`
  padding-top: 200px;
`;

const mainBody = css`
  width: 500px;
  height: 500px;
  text-align: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  padding: 20px;

  &:hover {
    width: 520px;
    /* background: linear-gradient(140deg, red, purple, purple);
    box-shadow: rgba(240, 46, 170, 0.4) -5px 5px,
      rgba(240, 46, 170, 0.3) -10px 10px, rgba(240, 46, 170, 0.2) -15px 15px,
      rgba(240, 46, 170, 0.1) -20px 20px, rgba(240, 46, 170, 0.05) -25px 25px;
    // Size can also be negative; see how it's smaller than the element */
  }
`;
export default function LoginPage(props: { refreshUsername: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <Layout>
      <h1 style={{ display: 'flex', justifyContent: 'center' }}>Login</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form
          css={mainBody}
          onSubmit={async (event) => {
            event.preventDefault();

            const loginResponse = await fetch('/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
              }),
            });

            const loginJson = (await loginResponse.json()) as LoginResponse;

            if ('errors' in loginJson) {
              setErrors(loginJson.errors);
              return;
            }

            const destination =
              typeof router.query.returnTo === 'string' && router.query.returnTo
                ? router.query.returnTo
                : `/users/${loginJson.user.id}`;

            // props.refreshUsername();

            router.push(destination);
          }}
        >
          <div css={inputStyle}>
            <label>
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </label>
            <br />
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>
            <br />
            <button>Login</button>
          </div>
        </form>

        <div css={errorsStyles}>
          {errors.map((error) => (
            <div key={`error-${error.message}`}>{error.message}</div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');

  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  console.log(session);

  if (session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
