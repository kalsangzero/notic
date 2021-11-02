import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';

// // readin the environment variables
// // in the .env file, making it possible
// // to connect to PostgresSQL
dotenvSafe.config();

// connect toPostgresSQL
const sql = postgres();
sql`SELECT 1;`.then((result) => console.log(result));

// postgres js will always giv back an array
// to get data from real database using function

export async function getProducts() {
  const products = await sql`
      SELECT * FROM products`;
  // console.log('proooo', products);
  return products.map((product) => {
    return camelcaseKeys(product);
  });
}
export async function insertUser({ username, passwordHash }) {
  const [user] = await sql`
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
