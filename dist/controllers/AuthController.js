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
exports.validateToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const postgresDb_1 = __importDefault(require("../models/postgresDb"));
const userQuery_1 = require("../models/queries/userQuery");
const jwt_1 = require("../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            res.status(400).json({ message: 'All inputs are required for registration' });
            return;
        }
        const exists = yield postgresDb_1.default.query(userQuery_1.userExists, [username, email]);
        if (exists.rows.length > 0) {
            res.status(409).json({ message: 'User already exists with this email or username. Please login' });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const newUser = { firstName, lastName, username, email, passwordHash, role: 'user' };
        const values = [newUser.firstName, newUser.lastName, newUser.username, newUser.email, newUser.passwordHash, newUser.role];
        yield postgresDb_1.default.query(userQuery_1.createUser, values);
        res.status(200).json({ message: 'Successfully registered!' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'All inputs are required for logging in' });
            return;
        }
        const user = yield postgresDb_1.default.query(userQuery_1.getUserQuery, [email]);
        if (user.rows.length === 0 || !(yield bcrypt_1.default.compare(password, user.rows[0].passwordHash))) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const u = user.rows[0];
        const token = (0, jwt_1.createSecretToken)(u.id, u.email);
        const ures = {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            username: u.username,
            email: u.email,
            role: u.role,
        };
        res.status(200).json({ token, user: ures, message: 'Successfully logged in!' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.login = login;
// ToDo
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, user } = req.body;
        if (!token || !user) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const decoded = (0, jwt_1.verifySecretToken)(token);
        if (decoded.userId !== user.id || decoded.email !== user.email) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const u = yield postgresDb_1.default.query(userQuery_1.getUserQuery, [decoded.email]);
        if (u.rows.length === 0) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const us = u.rows[0];
        if (us.id !== user.id || us.email !== user.email || us.role !== user.role) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const tkn = (0, jwt_1.createSecretToken)(us.id, us.email);
        const ures = {
            id: us.id,
            firstName: us.firstName,
            lastName: us.lastName,
            username: us.username,
            email: us.email,
            role: us.role,
        };
        res.status(200).json({ token: tkn, user: ures });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.validateToken = validateToken;
