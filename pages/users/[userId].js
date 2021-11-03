import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useState } from 'react';

export default function User(props) {
  return (
    <div>
      <Head>
        <title>single user</title>
      </Head>

      <div>Personal user page of {props.user.username}</div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { getUser } = await import('../../util/database');
  console.log(getUser);
  const user = await getUser(context.query.userId);

  //  { id: '6', name: 'Andrea', favoriteColor: 'purple' },

  return {
    props: {
      user,
    },
  };
}
