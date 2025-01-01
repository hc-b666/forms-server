"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../utils/auth-middleware");
const user_controller_1 = __importDefault(require("./user.controller"));
const router = (0, express_1.Router)();
router.get('/profile/:userId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, user_controller_1.default.findById);
router.get('/search', auth_middleware_1.AuthMiddleware.authenticate, user_controller_1.default.searchByEmail);
exports.default = router;
