"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importStar(require("../models/UserModel"));
const jwt_1 = require("../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            res.status(400).json({ message: 'All inputs are required for registration' });
            return;
        }
        const exists = yield UserModel_1.default.findOne({ email });
        if (exists) {
            res.status(409).json({ message: 'User already exists with this email. Please login' });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const newUser = new UserModel_1.default({
            firstName,
            lastName,
            username,
            email,
            passwordHash,
            role: UserModel_1.UserRole.USER,
        });
        yield newUser.save();
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
        const user = yield UserModel_1.default.findOne({ email });
        if (!user || !(yield bcrypt_1.default.compare(password, user.passwordHash))) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = (0, jwt_1.createSecretToken)(user._id, user.email);
        const ures = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
        res.status(200).json({ token, user: ures, message: 'Successfully logged in!' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.login = login;
