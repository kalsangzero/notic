export default function Home(props) {
  return (
    <main>
      <p>singla page for ${props.bookmark}</p>
    </main>
  );
}
export async function getServerSideProps(context) {
  const { getBookmark } = await import('../../../../util/database');

  const bookmark = await getBookmark(context.query.videoId);

  return {
    props: {
      bookmark,
    },
  };
}
