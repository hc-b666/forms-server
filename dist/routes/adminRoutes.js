"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const userController_1 = __importDefault(require("../controllers/userController"));
const router = express_1.default.Router();
const authMiddleware = new AuthMiddleware_1.default();
const userController = new userController_1.default();
router.get('/users', authMiddleware.authenticate, authMiddleware.isAdmin, userController.getUsers);
exports.default = router;
