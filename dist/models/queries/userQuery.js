"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserQuery = exports.getUserByIdQuery = exports.getUserByIdSql = exports.createUserQuery = exports.userExistsQuery = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
const userExistsSql = `
select * 
from "user" 
where username = $1 or email = $2
`;
const userExistsQuery = (username, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(userExistsSql, [username, email]);
        return rows;
    }
    catch (err) {
        console.error(`Error in userExistsQuery: ${err}`);
        throw err;
    }
});
exports.userExistsQuery = userExistsQuery;
const createUserSql = `
insert into "user" ("firstName", "lastName", username, email, "passwordHash", role) 
values ($1, $2, $3, $4, $5, $6)
`;
const createUserQuery = (firstName, lastName, username, email, passwordHash, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield postgresDb_1.default.query(createUserSql, [firstName, lastName, username, email, passwordHash, role]);
    }
    catch (err) {
        console.error(`Error in createUserQuery: ${err}`);
        throw err;
    }
});
exports.createUserQuery = createUserQuery;
exports.getUserByIdSql = `
select u.id, u."firstName", u."lastName", u.username, u.email
from "user" u
where id = $1
`;
const getUserByIdQuery = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(exports.getUserByIdSql, [userId]);
        return rows[0];
    }
    catch (err) {
        console.error(`Error in getUserByIdQuery: ${err}`);
        throw err;
    }
});
exports.getUserByIdQuery = getUserByIdQuery;
const getUserSql = `
select * 
from "user" 
where email = $1;
`;
const getUserQuery = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userResult = yield postgresDb_1.default.query(getUserSql, [email]);
        return userResult;
    }
    catch (err) {
        console.error(`Error in getUserQuery: ${err}`);
        throw err;
    }
});
exports.getUserQuery = getUserQuery;
