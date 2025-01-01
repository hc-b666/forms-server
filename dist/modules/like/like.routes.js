"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../utils/auth-middleware");
const like_controller_1 = __importDefault(require("./like.controller"));
const router = (0, express_1.Router)();
router.get('/:templateId([0-9]+)', auth_middleware_1.AuthMiddleware.addUserToRequest, like_controller_1.default.findLikes);
router.post('/:templateId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, like_controller_1.default.toggleLike);
exports.default = router;
