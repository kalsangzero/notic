import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import Layout from '../Component/Layout';
import { Errors } from '../util/types';
import { LoginResponse } from './api/login';

const frontPage = css`
  justify-content: center;
  text-align: center;
  background-image: url('/front.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  width: 100%;
  height: 100%;
`;

const errorsStyles = css`
  color: red;
`;
const inputStyle = css`
  padding-top: 130px;
`;

const mainBody = css`
  width: 500px;
  height: 500px;
  text-align: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  padding: 20px;
`;
const labelcss = css`
  margin: 10px 0 0 0;
  font-size: 18px;
  input {
    margin: 20px 0 0 10px;
    padding: 10px 5px;
    outline: none;
    border: 1px solid #8c8f94;
    border-radius: 10px;
  }

  input:focus {
    border-color: #16056b;
  }
`;
const buttoncss = css`
  padding: 10px 20px;
  font-size: 19px;
  margin-top: 20px;
  border-radius: 5px;
`;

export default function LoginPage(props: {
  refreshUsername: () => void;
  baseUrl: string;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <main css={frontPage}>
      <Layout>
        <h1 style={{ display: 'flex', justifyContent: 'center' }}>Login</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <form
            css={mainBody}
            onSubmit={async (event) => {
              event.preventDefault();

              const loginResponse = await fetch(`/api/login`, {
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
                typeof router.query.returnTo === 'string' &&
                router.query.returnTo
                  ? router.query.returnTo
                  : `${props.baseUrl}/users/${loginJson.user.id}`;

              props.refreshUsername();

              router.push(destination);
            }}
          >
            <div css={inputStyle}>
              <label css={labelcss}>
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                />
              </label>
              <br />
              <label css={labelcss}>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </label>
              <br />
              <button css={buttoncss}>Login</button>
            </div>
          </form>

          <div css={errorsStyles}>
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
        </div>
      </Layout>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const baseUrl = process.env.BASE_URL;

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
