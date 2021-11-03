import { css } from '@emotion/react';
import Head from 'next/head';
import Link from 'next/link';

export default function Users(props) {
  return (
    <div style={{ margin: '100px 50px' }}>
      <Head>
        <title>USERS</title>
      </Head>
      {/* Layout is already applied so we dont have to put the layout here */}
      <h2>Notic</h2>
      <div>
        {/* props is collected from userServersite with name as userList
        and here we use props which has name userList and then map each ..which is shown in the list */}
        {props.users.map((user) => {
          // actually props.liked user
          return (
            <div key={`user-li-${user.id}`}>
              <br />
              <Link href={`/users/${user.id}`}>{user.username}</Link>
              {console.log('idid', user.id)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// NODE:J PART OF SERVER
export async function getServerSideProps(context) {
  const { getUsers } = await import('../../util/database');

  const users = await getUsers();

  return {
    props: {
      users,
    },
  };
}
