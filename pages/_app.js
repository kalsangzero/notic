import GlobalStyles from '../styles/globals';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <GlobalStyles />

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
