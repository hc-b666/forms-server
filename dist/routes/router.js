"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../modules/auth");
const templateRoutes_1 = __importDefault(require("./templateRoutes"));
const formRoutes_1 = __importDefault(require("./formRoutes"));
const commentRoutes_1 = __importDefault(require("./commentRoutes"));
const tagRoutes_1 = __importDefault(require("./tagRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const likeRoutes_1 = __importDefault(require("./likeRoutes"));
const router = express_1.default.Router();
router.use('/auth', auth_1.authRoutes);
router.use('/templates', templateRoutes_1.default);
router.use('/forms', formRoutes_1.default);
router.use('/comments', commentRoutes_1.default);
router.use('/tags', tagRoutes_1.default);
router.use('/user', userRoutes_1.default);
router.use('/admin', adminRoutes_1.default);
router.use('/likes', likeRoutes_1.default);
exports.default = router;
