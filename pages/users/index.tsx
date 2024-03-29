import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../Component/Layout';
import { User } from '../../util/database';

type UserWithFollowing = User & {
  following: boolean;
};

type Props = { username: string; users: UserWithFollowing[] };

export default function Users(props: Props) {
  return (
    <Layout username={props.username}>
      <Head>
        <title>users</title>
      </Head>
      <h2>Users List</h2>
      <ul>
        {props.users.map((user) => {
          return (
            <li key={`user-li-${user.id}`}>
              {user.username}:
              <Link href={`/users-protected/${user.id}`}>
                <a>{user.username} single page</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../../util/database');

  // Authorization: Allow only logged-in users
  const isValidSession = await getValidSessionByToken(
    context.req.cookies.sessionToken,
  );

  if (!isValidSession) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?returnTo=/users-protected',
      },
    };
  }

  // return { props: {} };
  const { getUsers } = await import('../../util/database');

  const users = await getUsers();

  const cookies = context.req.cookies.following || '[]';
  const following = JSON.parse(cookies);

  console.log(following);
  // [5,7]
  // [{id: 5, clapCount:13}, {id: 7, clapCount:0} ]
  console.log(users);

  const glorifiedUsers = users.map((user) => {
    const isTheUserFollowed = following.some(
      (userCookieObj: { id: number }) => {
        return Number(user.id) === userCookieObj.id;
      },
    );

    const userObj = following.find((cookieObj: { id: number }) => {
      return cookieObj.id === Number(user.id);
    });

    return {
      ...user,
      following: isTheUserFollowed,
      clap: isTheUserFollowed ? userObj.clapCount : 0,
    };
  });

  // { id: '4', name: 'Ines', favoriteColor: 'yellow', following: true }
  // { id: '4', name: 'Ines', favoriteColor: 'yellow', following: false, clap: 0 }

  // { id: '5', name: 'Lucas', favoriteColor: 'yellow', following: true }
  // { id: '5', name: 'Lucas', favoriteColor: 'yellow', following: true, clap: 13 }

  console.log(glorifiedUsers);

  return {
    props: {
      users,
    },
  };
}
