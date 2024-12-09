import pool from '../postgresDb';

export const userExists = `
select * 
from "user" 
where username = $1 or email = $2
`;

export const createUser = `
insert into "user" ("firstName", "lastName", username, email, "passwordHash", role) 
values ($1, $2, $3, $4, $5, $6)
`;

export const getUserByIdSql = `
select u.id, u."firstName", u."lastName", u.username, u.email
from "user" u
where id = $1
`;
export const getUserByIdQuery = async (userId: number) => {
  try {
    const { rows } = await pool.query(getUserByIdSql, [userId]) as { rows: IProfileUser[] };

    return rows[0];
  } catch (err) {
    console.error(`Error in getUserByIdQuery: ${err}`);
    throw err;
  }
};

export const getUserQuery = `
select * 
from "user" 
where email = $1;
`;
