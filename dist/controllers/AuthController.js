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
exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userQuery_1 = require("../models/queries/userQuery");
const jwt_1 = __importDefault(require("../utils/jwt"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            res.status(400).json({ message: 'All inputs are required for registration' });
            return;
        }
        const users = yield (0, userQuery_1.userExistsQuery)(username, email);
        if (users.length > 0) {
            res.status(409).json({ message: 'User already exists with this email or username. Please login' });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        yield (0, userQuery_1.createUserQuery)(firstName, lastName, username, email, passwordHash, 'user');
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
        const userResult = yield (0, userQuery_1.getUserQuery)(email);
        if (userResult.rows.length === 0) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const user = userResult.rows[0];
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const accessToken = jwt_1.default.createAccessToken(user.id, user.email);
        const refreshToken = jwt_1.default.createRefreshToken(user.id, user.email);
        const response = {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            message: 'Successfully logged in!',
        };
        res.status(200).json(response);
    }
    catch (err) {
        console.log(`Error at login: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ message: 'No refresh token provided' });
            return;
        }
        const decoded = jwt_1.default.verifyToken(refreshToken);
        const newAccessToken = jwt_1.default.createAccessToken(decoded.userId, decoded.email);
        res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        console.log(`Error at refreshToken: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.refreshToken = refreshToken;
