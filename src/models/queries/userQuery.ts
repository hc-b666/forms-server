import pool from '../postgresDb';

const userExistsSql = `
select * 
from "user" 
where username = $1 or email = $2
`;

export const userExistsQuery = async (username: string, email: string) => {
  try {
    const { rows } = await pool.query(userExistsSql, [username, email]) as { rows: IUser[] };
    return rows;
  } catch (err) {
    console.error(`Error in userExistsQuery: ${err}`);
    throw err;
  }
};

const createUserSql = `
insert into "user" ("firstName", "lastName", username, email, "passwordHash", role) 
values ($1, $2, $3, $4, $5, $6)
`;

export const createUserQuery = async (firstName: string, lastName: string, username: string, email: string, passwordHash: string, role: string) => {
  try {
    await pool.query(createUserSql, [firstName, lastName, username, email, passwordHash, role]);
  } catch (err) {
    console.error(`Error in createUserQuery: ${err}`);
    throw err;
  }
};

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

const getUserSql = `
select * 
from "user" 
where email = $1;
`;

export const getUserQuery = async (email: string) => {
  try {
    const userResult = await pool.query(getUserSql, [email]) as { rows: IUser[] };

    return userResult;
  } catch (err) {
    console.error(`Error in getUserQuery: ${err}`);
    throw err;
  }
};
