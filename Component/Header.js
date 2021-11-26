import { css } from '@emotion/react';
import Link from 'next/link';

const navStyle = css`
  padding: 30px 72px;
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
    <header>
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
          {!props.username && (
            <>
              <Link href="/register">
                <a>Register</a>
              </Link>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </>
          )}

          {
            // Nextlink only logsout at refresh
            props.username && (
              <>
                <a>{props.username}</a>

                <a href="/logout"> Logout</a>

                {/* for display last project use this  <a href="/logout">Logout</a> */}
              </>
            )
          }
        </div>
      </nav>
    </header>
  );
}
