import { Bookmark } from '@mui/icons-material';
import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';

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
  videoUrl: string;
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

// connect toPostgresSQL
const sql = postgres();
sql`SELECT 1;`.then((result) => console.log(result));

// postgres js will always giv back an array
// to get data from real database using function

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
  profileId,
}: {
  videoname: string;
  url: string;
  profileId: number;
}) {
  const [video] = await sql<[Video | undefined]>`
    INSERT INTO videos
      (videoname, url, profile_id)
    VALUES
      (${videoname}, ${url}, ${profileId})
    RETURNING
      id,
      videoname,
      url,
      profile_id

  `;
  return video && camelcaseKeys(video);
}

export async function getVideos() {
  const videos = await sql<User[]>`
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
  const [video] = await sql<[User]>`
      SELECT
      id,
      videoname
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
    profileId,
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
      url = ${url},
      profile_id = ${profileId}
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

export async function insertBookmark({
  bookmarkname,
  note,
  time,
}: {
  bookmarkname: string;
  note: string;
  time: string;
}) {
  const [bookmark] = await sql<[Bookmark | undefined]>`
    INSERT INTO bookmarks
      (bookmarkname,  note, time)
    VALUES
     (${bookmarkname}, ${note}, ${time})
    RETURNING
    bookmarkname,
    note,
    time
  `;
  return bookmark && camelcaseKeys(bookmark);
}

export async function getBookmarks() {
  const bookmarks = await sql<Bookmark[]>`
      SELECT
         id,
         bookmarkname,
         note,
         time
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
      videos
      Where
      id =${id}
      `;
  return camelcaseKeys(bookmark);
}

export async function deleteBookmarkById(id: number) {
  const [bookmark] = await sql<[Bookmark | undefined]>`
    DELETE FROM
      videos
    WHERE
      id = ${id}
    RETURNING
    id,
      bookmarkname,
      time,
      note,
      video_id,
      video_url

  `;
  return bookmark && camelcaseKeys(bookmark);
}

export async function updateBookmarkById(
  id: number,
  {
    bookmarkname,
    note,
    videoId,
    videoUrl,
  }: {
    bookmarkname: string;
    note: string;
    videoUrl: string;
    videoId: number;
  },
) {
  const [bookmark] = await sql<[Bookmark | undefined]>`
    UPDATE
      bookmarks
    SET
      bookmarkname = ${bookmarkname},
      note =${note},
      video_id = ${videoId},
      video_url=${videoUrl}
    WHERE
      id = ${id}
    RETURNING
      id,
      bookmarkname,
      time,
      note,
      video_id,
      video_url

  `;
  return bookmark && camelcaseKeys(bookmark);
}
