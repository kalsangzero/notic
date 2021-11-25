import Link from 'next/link';

export default function Footer() {
  return (
    <div
      style={{
        display: 'flex',
        bottom: '0',
        justifyContent: 'center',
        width: '100%',
        margin: '100px 0 0',
        color: 'white',
      }}
    >
      <Link href="/">
        <a
          style={{
            margin: ' 0 36px',
            padding: '20px',
          }}
        >
          Data Protection
        </a>
      </Link>
      <Link href="/">
        <a
          style={{
            margin: ' 0 36px',
            padding: '20px',
          }}
        >
          Privacy Policy
        </a>
      </Link>
      <Link href="/contact">
        <a
          style={{
            margin: ' 0 36px',
            padding: '20px',
          }}
        >
          Contact
        </a>
      </Link>
      <Link href="/contact">
        <a
          style={{
            margin: ' 0 36px',
            padding: '20px',
          }}
        >
          Media Structure
        </a>
      </Link>
    </div>
  );
}
