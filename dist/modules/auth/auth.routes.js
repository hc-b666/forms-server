"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.default.register);
router.post('/verify', auth_controller_1.default.verify);
router.post('/login', auth_controller_1.default.login);
router.post('/refresh-token', auth_controller_1.default.refreshToken);
exports.default = router;
