import { css } from '@emotion/react';
import Link from 'next/link';

const navStyle = css`
  background-color: #333;
  padding: 30px 54px;
  a {
    color: #f2f2f2;
    text-align: center;
    padding: 30px 56px;
    text-decoration: none;
    font-size: 24px;
  }
  a:hover {
    background-color: #111;
    color: orange;
  }
`;

export default function Header(props) {
  return (
    <nav css={navStyle}>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/about">
        <a>About</a>
      </Link>
      <Link href="/contact">
        <a>Contact</a>
      </Link>
      <Link href="/videos">
        <a>Videos</a>
      </Link>
      <div style={{ float: 'right' }}>
        <Link href="/register">
          <a>Register</a>
        </Link>
        <Link href="/profile">
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
