export const userExists = `
select * 
from "user" 
where username = $1 or email = $2
`;

export const createUser = `
insert into "user" ("firstName", "lastName", username, email, "passwordHash", role) 
values ($1, $2, $3, $4, $5, $6)
`;

export const getUserByIdQuery = `
select u.id, u."firstName", u."lastName", u.username, u.email
from "user" u
where id = $1
`;

export const getUserQuery = `
select * 
from "user" 
where email = $1;
`;
