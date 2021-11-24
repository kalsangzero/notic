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
  background-image: url('/front.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  width: 100%;
  height: 100%;
`;

const registercss = css`
  margin: 130px 0;
`;
const formStyles = css`
  label {
    display: block;
  }
`;
const buttoncss = css`
  padding: 10px 20px;
  font-size: 19px;
  margin-top: 10px;
  border-radius: 5px;
`;

const errorsStyles = css`
  color: red;
`;

const labelcss = css`
  margin: 10px 0 0 0;
  font-size: 18px;
  input {
    margin-left: 15px;
    padding: 10px 5px;
    outline: none;
    border: 1px solid #8c8f94;
    border-radius: 10px;
  }

  input:focus {
    border-color: #16056b;
  }
`;
type Props = {
  refreshUsername: () => void;
  // csrfToken: string;
};

export default function RegisterPage(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <main css={frontPage}>
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
            <label css={labelcss}>
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </label>
            <label css={labelcss}>
              First Name
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.currentTarget.value)}
              />
            </label>
            <label css={labelcss}>
              Last Name
              <input
                value={lastName}
                onChange={(event) => setLastName(event.currentTarget.value)}
              />
            </label>
            <label css={labelcss}>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>

            <button css={buttoncss}>Register</button>
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
