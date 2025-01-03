"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./modules/auth");
const template_1 = require("./modules/template");
const form_1 = require("./modules/form");
const comment_1 = require("./modules/comment");
const tag_1 = require("./modules/tag");
const user_1 = require("./modules/user");
const admin_1 = require("./modules/admin");
const like_1 = require("./modules/like");
const router = express_1.default.Router();
router.use('/auth', auth_1.authRoutes);
router.use('/templates', template_1.templateRoutes);
router.use('/forms', form_1.formRoutes);
router.use('/comments', comment_1.commentRoutes);
router.use('/tags', tag_1.tagRoutes);
router.use('/user', user_1.userRoutes);
router.use('/admin', admin_1.adminRoutes);
router.use('/likes', like_1.likeRoutes);
exports.default = router;
