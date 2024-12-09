"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserQuery = exports.getUserByIdQuery = exports.createUser = exports.userExists = void 0;
exports.userExists = `
select * 
from "user" 
where username = $1 or email = $2
`;
exports.createUser = `
insert into "user" ("firstName", "lastName", username, email, "passwordHash", role) 
values ($1, $2, $3, $4, $5, $6)
`;
exports.getUserByIdQuery = `
select u.id, u."firstName", u."lastName", u.username, u.email
from "user" u
where id = $1
`;
exports.getUserQuery = `
select * 
from "user" 
where email = $1;
`;
