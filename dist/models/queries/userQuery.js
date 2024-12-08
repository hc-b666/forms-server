"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createUser = exports.userExists = void 0;
exports.userExists = `select * from "user" where username = $1 or email = $2;`;
exports.createUser = `insert into "user" ("firstName", "lastName", username, email, "passwordHash", role) values ($1, $2, $3, $4, $5, $6);`;
exports.getUser = `select * from "user" where email = $1;`;
