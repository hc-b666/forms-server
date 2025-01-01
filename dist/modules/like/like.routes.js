"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_controller_1 = __importDefault(require("../../middlewares/authMiddleware.controller"));
const like_controller_1 = __importDefault(require("./like.controller"));
const router = (0, express_1.Router)();
router.get('/:templateId([0-9]+)', authMiddleware_controller_1.default.addUserToRequest, like_controller_1.default.findLikes);
router.post('/:templateId([0-9]+)', authMiddleware_controller_1.default.authenticate, like_controller_1.default.toggleLike);
exports.default = router;
