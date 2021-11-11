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
