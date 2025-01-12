"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../utils/auth-middleware");
const comment_controller_1 = __importDefault(require("./comment.controller"));
const router = (0, express_1.Router)();
router.get('/:templateId([0-9]+)', comment_controller_1.default.findComments);
router.post('/create/:templateId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, comment_controller_1.default.create);
exports.default = router;
