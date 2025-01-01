"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMIddleware_controller_1 = __importDefault(require("../../middlewares/authMIddleware.controller"));
const like_controller_1 = __importDefault(require("./like.controller"));
const router = (0, express_1.Router)();
router.get('/:templateId([0-9]+)', authMIddleware_controller_1.default.addUserToRequest, like_controller_1.default.findLikes);
router.post('/:templateId([0-9]+)', authMIddleware_controller_1.default.authenticate, like_controller_1.default.toggleLike);
exports.default = router;
