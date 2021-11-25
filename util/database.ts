import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';

// import setPostgresDefaultsOnHeroku from './node-heroku-postgres-env-vars';

// setPostgresDefaultsOnHeroku();

// // readin the environment variables
// // in the .env file, making it possible
// // to connect to PostgresSQL

export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
};

export type Video = {
  id: number;
  videoname: string;
  url: string;
  profileId: number;
};

export type Bookmark = {
  id: number;
  bookmarkname: string;
  time: string;
  note: string;
  videoId: number;
};
export type UserWithPasswordHash = User & {
  password_hash: string;
};

export type Session = {
  id: number;
  token: string;
  userId: number;
  expiryTimestamp: Date;
};

dotenvSafe.config();

// connect toPostgresSQL on local host
const sql = postgres();
sql`SELECT 1;`.then((result) => console.log(result));

// postgres js will always giv back an array
// to get data from real database using function
// Type needed for the connection function below

// Type needed for the connection function below
// declare module globalThis {
//   let postgresSqlClient: ReturnType<typeof postgres> | undefined;
// }

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
// function connectOneTimeToDatabase() {
//   let sql;

//   if (process.env.NODE_ENV === 'production') {
//     // Heroku needs SSL connections but
//     // has an "unauthorized" certificate
//     // https://devcenter.heroku.com/changelog-items/852
//     sql = postgres({ ssl: { rejectUnauthorized: false } });
//   } else {
//     // When we're in development, make sure that we connect only
//     // once to the database
//     if (!globalThis.postgresSqlClient) {
//       globalThis.postgresSqlClient = postgres();
//     }
//     sql = globalThis.postgresSqlClient;
//   }
//   return sql;
// }

// // Connect to PostgreSQL
// const sql = connectOneTimeToDatabase();

export async function getUsers() {
  const users = await sql<User[]>`
      SELECT
         id,
         username
      FROM
         users;
         `;
  // console.log('proooo', products);
  return users.map((user) => {
    return camelcaseKeys(user);
  });
}

export async function getUser(id: number) {
  const [user] = await sql<[User]>`
      SELECT
      id,
      username
      FROM
      users
      Where
      id =${id}
      `;
  return camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
      SELECT
      id,
      username,
      password_hash
      FROM
      users
      Where
      username =${username}
      `;
  return user && camelcaseKeys(user);
}
export async function insertUser({
  username,
  passwordHash,
  firstName,
  lastName,
}: {
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}) {
  const [user] = await sql<[User | undefined]>`
    INSERT INTO users
      (username, password_hash, first_name, last_name)
    VALUES
      (${username}, ${passwordHash}, ${firstName}, ${lastName})
    RETURNING
      id,
      username,
      first_name,
      last_name

  `;
  return user && camelcaseKeys(user);
}
export async function deleteUserById(id: number) {
  const [user] = await sql<[User | undefined]>`
    DELETE FROM
      users
    WHERE
      id = ${id}
    RETURNING
    id,
      username,
      first_name,
      last_name

  `;
  return user && camelcaseKeys(user);
}

export async function updateUserById(
  id: number,
  {
    username,
    firstName,
    lastName,
  }: {
    username: string;
    firstName: string;
    lastName: string;
  },
) {
  const [user] = await sql<[User | undefined]>`
    UPDATE
      users
    SET
      username = ${username},
      first_name = ${firstName},
      last_name = ${lastName}
    WHERE
      id = ${id}
    RETURNING
      id,
      username,
      first_name,
      last_name
  `;
  return user && camelcaseKeys(user);
}

export async function getValidSessionByToken(token: string) {
  if (!token) return undefined;

  const [session] = await sql<[Session | undefined]>`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${token} AND
      expiry_timestamp > NOW()
  `;

  return session && camelcaseKeys(session);
}

export async function createSession(token: string, userId: number) {
  const [session] = await sql<[Session]>`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token}, ${userId})
    RETURNING
      *
  `;

  return camelcaseKeys(session);
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      expiry_timestamp < NOW()
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session));
}

export async function deleteSessionByToken(token: string) {
  const sessions = await sql<Session[]>`
    DELETE FROM
      sessions
    WHERE
      token = ${token}
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function insertVideo({
  videoname,
  url,
}: {
  videoname: string;
  url: string;
}) {
  const [video] = await sql<[Video | undefined]>`
    INSERT INTO videos
      (videoname, url)
    VALUES
      (${videoname}, ${url})
    RETURNING
      id,
      videoname,
      url


  `;
  return video && camelcaseKeys(video);
}

export async function getVideos() {
  const videos = await sql<Video[]>`
      SELECT
         id,
         videoname
      FROM
         videos;
         `;
  // console.log('proooo', products);
  return videos.map((video) => {
    return camelcaseKeys(video);
  });
}

export async function getVideo(id: number) {
  const [video] = await sql<[Video]>`
      SELECT
      id,
      videoname,
      url
      FROM
      videos
      Where
      id =${id}
      `;
  return camelcaseKeys(video);
}

export async function deleteVideoById(id: number) {
  const [video] = await sql<[Video | undefined]>`
    DELETE FROM
      videos
    WHERE
      id = ${id}
    RETURNING
    id,
      videoname,
      url,
      profile_id

  `;
  return video && camelcaseKeys(video);
}

export async function updateVideoById(
  id: number,
  {
    videoname,
    url,
  }: {
    videoname: string;
    url: string;
    profileId: number;
  },
) {
  const [video] = await sql<[Video | undefined]>`
    UPDATE
      videos
    SET
      videoname = ${videoname},
      url = ${url}
    WHERE
      id = ${id}
    RETURNING
      id,
      videoname,
      url

  `;
  return video && camelcaseKeys(video);
}

export async function insertBookmark({
  bookmarkname,
  note,
  time,
  videoId,
}: {
  bookmarkname: string;
  note: string;
  time: string;
  videoId: number;
}) {
  const [bookmark] = await sql<[Bookmark | undefined]>`
    INSERT INTO bookmarks
      (bookmarkname,  note, time, video_id)
    VALUES
     (${bookmarkname}, ${note}, ${time}, ${videoId})
    RETURNING
    bookmarkname,
    note,
    time,
    video_id
  `;
  return bookmark && camelcaseKeys(bookmark);
}

export async function getBookmarks() {
  const bookmarks = await sql<Bookmark[]>`
      SELECT
         id,
         bookmarkname,
         note,
         time,
         video_id
      FROM
         bookmarks
         `;
  // console.log('proooo', products);
  return bookmarks.map((bookmark) => {
    return camelcaseKeys(bookmark);
  });
}

export async function getBookmark(id: number) {
  const [bookmark] = await sql<[Bookmark]>`
      SELECT
      id,
      bookamrkname,
      note,
      time
      FROM
      bookmarks
      Where
      id =${id}
      `;
  return camelcaseKeys(bookmark);
}

export async function deleteBookmarkById(id: number) {
  const [bookmark] = await sql<[Bookmark | undefined]>`
    DELETE FROM
      bookmarks
    WHERE
      id = ${id}
    RETURNING
    id,
      bookmarkname,
      time,
      note,
      video_id
  `;
  return bookmark && camelcaseKeys(bookmark);
}

export async function updateBookmarkById(
  id: number,
  {
    bookmarkname,
    note,
  }: {
    bookmarkname: string;
    note: string;
  },
) {
  const [bookmark] = await sql<[Bookmark | undefined]>`
    UPDATE
      bookmarks
    SET
      bookmarkname = ${bookmarkname},
      note =${note}
    WHERE
      id = ${id}
    RETURNING
      id,
      bookmarkname,
      note
  `;
  return bookmark && camelcaseKeys(bookmark);
}

export async function getBookmarksByVideoId(id: number) {
  const bookmarks = await sql<Bookmark[]>`
     SELECT
   bookmarks.id,
   bookmarks.note,
   bookmarks.bookmarkname,
   bookmarks.time,
   videos.id as video_id
  FROM
   videos,
   bookmarks
  WHERE
   bookmarks.video_id = videos.id
  AND
    videos.id = ${id}
;
`;
  // console.log('proooo', products);
  return bookmarks.map((bookmark) => {
    return camelcaseKeys(bookmark);
  });
}
