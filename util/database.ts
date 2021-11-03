import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';

// // readin the environment variables
// // in the .env file, making it possible
// // to connect to PostgresSQL

export type User = {
  id: number;
  username: string;
};

export type UserWithPasswordHash = User & {
  password_hash: string;
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
}: {
  username: string;
  passwordHash: string;
}) {
  const [user] = await sql<[User | undefined]>`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username}, ${passwordHash})
    RETURNING
      id,
      username

  `;
  return user && camelcaseKeys(user);
}
