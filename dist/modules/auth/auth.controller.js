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
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const jwt_1 = __importDefault(require("../../utils/jwt"));
const auth_service_1 = __importDefault(require("./auth.service"));
const register_dto_1 = require("./dto/register.dto");
const verify_dto_1 = require("./dto/verify.dto");
const login_dto_1 = require("./dto/login.dto");
const refreshToken_dto_1 = require("./dto/refreshToken.dto");
class AuthController {
    constructor() {
        this.sendVerificationEmail = (email, token, firstName) => __awaiter(this, void 0, void 0, function* () {
            const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
            yield this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify your email',
                html: `
        <h1>Email Verification</h1>
        <p>Hi ${firstName},</p>
        <p>Please click the link below to verify your email and complete your registration:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
            });
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = register_dto_1.registerSchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(400, firstError.message);
                }
                const { firstName, email, password } = result.data;
                const userExists = yield this.authService.findUserByEmail(email);
                if (userExists) {
                    throw (0, http_errors_1.default)(409, `User already exists with this email. Please login.`);
                }
                const passwordHash = yield bcrypt_1.default.hash(password, 10);
                const token = crypto_1.default.randomBytes(32).toString('hex');
                const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                yield this.authService.createVerificationToken(result.data, passwordHash, token, expires);
                yield this.sendVerificationEmail(email, token, firstName);
                res.status(200).json({ message: 'Please check your email to verify your account.' });
            }
            catch (err) {
                next(err);
            }
        });
        this.isValidToken = (token) => {
            if (!token) {
                throw (0, http_errors_1.default)(400, 'Invalid verification token');
            }
            if (token.expires < new Date()) {
                throw (0, http_errors_1.default)(400, 'Verification token has expired');
            }
            return true;
        };
        this.verify = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = verify_dto_1.verifySchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(400, firstError.message);
                }
                const { token } = result.data;
                const verificationToken = yield this.authService.findVerificationToken(token);
                if (!this.isValidToken(verificationToken)) {
                    return;
                }
                yield this.authService.createUser(verificationToken);
                yield this.authService.deleteVerificationToken(token);
                res.status(200).json({ message: 'Email verified successfully. Please login.' });
            }
            catch (err) {
                next(err);
            }
        });
        this.findUser = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.findUserByEmail(email);
            if (!user) {
                throw (0, http_errors_1.default)(400, `There is no user with this email`);
            }
            if (!user.verified) {
                throw (0, http_errors_1.default)(400, `Please verify your email before logging in`);
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw (0, http_errors_1.default)(400, `Invalid credentials`);
            }
            if (user.isBlocked) {
                throw (0, http_errors_1.default)(401, 'You are blocked. Ask from our customer services to unblock you.');
            }
            return user;
        });
        this.loginResponse = (user) => {
            const accessToken = jwt_1.default.createAccessToken(user.id, user.email, user.role);
            const refreshToken = jwt_1.default.createRefreshToken(user.id, user.email, user.role);
            return {
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
        };
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = login_dto_1.loginSchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(400, firstError.message);
                }
                const { email, password } = result.data;
                const user = yield this.findUser(email, password);
                const response = this.loginResponse(user);
                res.status(200).json(response);
            }
            catch (err) {
                next(err);
            }
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = refreshToken_dto_1.refreshTokenSchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(401, firstError.message);
                }
                const { refreshToken } = result.data;
                const decoded = jwt_1.default.verifyToken(refreshToken);
                const user = yield this.authService.findUserByEmail(decoded.email);
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
        this.authService = auth_service_1.default.getInstance();
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
}
exports.default = new AuthController();
