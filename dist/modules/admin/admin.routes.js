"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_controller_1 = __importDefault(require("../../middlewares/authMiddleware.controller"));
const admin_controller_1 = __importDefault(require("./admin.controller"));
const router = (0, express_1.Router)();
router.get('/users', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isAdmin, admin_controller_1.default.findUsers);
router.put('/block/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isAdmin, admin_controller_1.default.block);
router.put('/unblock/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isAdmin, admin_controller_1.default.unblock);
router.put('/promote/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isAdmin, admin_controller_1.default.promote);
router.put('/demote/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isAdmin, admin_controller_1.default.demote);
router.delete('/users/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isAdmin, admin_controller_1.default.delete);
exports.default = router;
