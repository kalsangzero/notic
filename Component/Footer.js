import { css } from '@emotion/react';
import Link from 'next/link';

const allButFooter = css`
  display: flex;
  bottom: 0;
  justify-content: center;
  width: 100%;
`;
const footerStyle = css`
  margin-top: 20px;
  padding: 20px;
  background-color: #030454;
  a {
    text-decoration: none;
    color: white;
    margin: 0 36px;
    padding: 20px;
    text-align: center;
    justify-content: space-between;
    width: 100%;
  }
`;

export default function Footer() {
  return (
    <div css={allButFooter}>
      <nav css={footerStyle}>
        <Link href="/">
          <a>Data Protection</a>
        </Link>
        <Link href="/">
          <a>Privacy Policy</a>
        </Link>
        <Link href="/contact">
          <a>Contact</a>
        </Link>
        <Link href="/contact">
          <a style={{ textAlign: 'right' }}>Media Structure</a>
        </Link>
      </nav>
    </div>
  );
}
