exports.up = async function up(sql) {
  await sql`
	CREATE TABLE profile (
		id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
 		firstname varchar(40) UNIQUE NOT NULL,
    lastname varchar(40) UNIQUE NOT NULL
	);`;
};

exports.down = async function down(sql) {
  await sql`DROP TABLE profile`;
};
