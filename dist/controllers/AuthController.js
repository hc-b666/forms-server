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
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const userService_1 = __importDefault(require("../services/userService"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const validateInput_1 = require("../utils/validateInput");
class AuthController {
    constructor() {
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, username, email, password } = req.body;
                (0, validateInput_1.validateInput)(req.body, ['firstName', 'lastName', 'username', 'email', 'password']);
                const userExists = yield this.userService.checkUserExists(email);
                if (userExists) {
                    throw (0, http_errors_1.default)(409, `User already exists with this email. Please login.`);
                }
                const passwordHash = yield bcrypt_1.default.hash(password, 10);
                yield this.userService.createUser({ firstName, lastName, username, email, passwordHash });
                res.status(200).json({ message: 'Successfully registered!' });
            }
            catch (err) {
                next(err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                (0, validateInput_1.validateInput)(req.body, ['email', 'password']);
                const user = yield this.userService.getUserByEmail(email);
                if (!user) {
                    throw (0, http_errors_1.default)(400, `There is no user with this email`);
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordHash);
                if (!isPasswordValid) {
                    throw (0, http_errors_1.default)(400, `Invalid credentials`);
                }
                if (user.isBlocked) {
                    throw (0, http_errors_1.default)(401, 'You are blocked. Ask from our customer services to unblock you.');
                }
                const accessToken = jwt_1.default.createAccessToken(user.id, user.email, user.role);
                const refreshToken = jwt_1.default.createRefreshToken(user.id, user.email, user.role);
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
                next(err);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    throw (0, http_errors_1.default)(401, `Invalid token`);
                }
                const decoded = jwt_1.default.verifyToken(refreshToken);
                const user = yield this.userService.checkUserExists(decoded.email);
                if (!user) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                if (user.isBlocked) {
                    throw (0, http_errors_1.default)(401, 'You are blocked. Ask from our customer services to unblock you.');
                }
                const newAccessToken = jwt_1.default.createAccessToken(decoded.userId, decoded.email, decoded.role);
                res.status(200).json({ accessToken: newAccessToken });
            }
            catch (err) {
                next(err);
            }
        });
        this.userService = userService_1.default.getInstance();
    }
}
exports.default = AuthController;
