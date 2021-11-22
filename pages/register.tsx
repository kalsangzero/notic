import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import Layout from '../Component/Layout';
import { Errors } from '../util/types';
import { RegisterResponse } from './api/register';

const frontPage = css`
  justify-content: center;
  text-align: center;
  background-image: url('/registration.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  width: 100%;
  height: 100%;
`;

const registercss = css`
  margin: 300px 0;
`;
const formStyles = css`
  label {
    display: block;
  }
`;

const errorsStyles = css`
  color: red;
`;

type Props = {
  refreshUsername: () => void;
  csrfToken: string;
};

export default function RegisterPage(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <div css={frontPage}>
      <Layout>
        <div css={registercss}>
          <h1>Register</h1>

          <form
            css={formStyles}
            onSubmit={async (event) => {
              event.preventDefault();

              const registerResponse = await fetch('/api/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username: username,
                  password: password,
                  firstName: firstName,
                  lastName: lastName,
                  // csrfToken: props.csrfToken,
                }),
              });

              const registerJson =
                (await registerResponse.json()) as RegisterResponse;

              if ('errors' in registerJson) {
                setErrors(registerJson.errors);
                return;
              }
              console.log(registerJson.user);

              const destination =
                typeof router.query.returnTo === 'string' &&
                router.query.returnTo
                  ? router.query.returnTo
                  : `/users/${registerJson.user.id}`;

              props.refreshUsername();

              router.push(destination);
            }}
          >
            <label>
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </label>
            <label>
              First Name
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.currentTarget.value)}
              />
            </label>
            <label>
              Last Name
              <input
                value={lastName}
                onChange={(event) => setLastName(event.currentTarget.value)}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>

            <button>Register</button>
          </form>

          <div css={errorsStyles}>
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');
  const { createToken } = await import('../util/csrf');

  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/register`,
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
    props: {
      // csrfToken: createToken(),
    },
  };
}
