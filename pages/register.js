import { css } from '@emotion/react';
import { useState } from 'react';

const formStyles = css`
  justify-content: center;
  text-align: center;
  label {
    display: block;
    justify-content: center;
    text-align: center;
  }
  button {
    margin: 10px;
  }
  input {
    margin-left: 5px;
  }
`;
const errorsStyles = css`
  color: red;
`;

export default function RegisterPage() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  return (
    <div>
      <div css={formStyles}>
        <h1>Register</h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch('/api/register', {
              method: 'POST', // create
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
              }),
            });
          }}
        >
          <label>
            Username:
            <input
              value={username}
              onChange={(event) => setUserName(event.currentTarget.value)}
            />
          </label>
          <label>
            Password:
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
    </div>
  );
}
