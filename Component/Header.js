import { css } from '@emotion/react';
import Link from 'next/link';

const navStyle = css`
  padding: 30px 54px;
  a {
    color: #f2f2f2;
    text-align: center;
    padding: 30px 56px;
    text-decoration: none;
    font-size: 20px;
  }
  a:hover {
    color: #ff1966;
  }
`;

export default function Header(props) {
  return (
    <nav css={navStyle}>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/contact">
        <a>Contact</a>
      </Link>
      <Link href="/videos">
        <a>Videos</a>
      </Link>
      <div style={{ float: 'right', paddingRight: '56px' }}>
        <Link href="/register">
          <a>Register</a>
        </Link>
        <Link href="/users/${user.id}">
          <a>Profile</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
        <Link href="/logout">
          <a>Logout</a>
        </Link>
      </div>
    </nav>
  );
}
