"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const templateRoutes_1 = __importDefault(require("./templateRoutes"));
const formRoutes_1 = __importDefault(require("./formRoutes"));
const commentRoutes_1 = __importDefault(require("./commentRoutes"));
const tagRoutes_1 = __importDefault(require("./tagRoutes"));
const router = express_1.default.Router();
router.use('/auth', authRoutes_1.default);
router.use('/templates', templateRoutes_1.default);
router.use('/forms', formRoutes_1.default);
router.use('/comments', commentRoutes_1.default);
router.use('/tags', tagRoutes_1.default);
exports.default = router;
