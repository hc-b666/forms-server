"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_service_1 = __importDefault(require("./admin.service"));
const http_errors_1 = __importDefault(require("http-errors"));
class AdminController {
    constructor() {
        this.validateUserId = (userId) => {
            if (!userId || isNaN(parseInt(userId))) {
                throw (0, http_errors_1.default)(400, 'UserId is required');
            }
            return parseInt(userId);
        };
        this.findUsers = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminService.findUsers();
                res.status(200).json(users);
            }
            catch (err) {
                next(err);
            }
        });
        this.block = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateUserId(req.params.userId);
                const result = yield this.adminService.block(userId);
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Successfully blocked user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.unblock = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateUserId(req.params.userId);
                const result = yield this.adminService.unblock(userId);
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Succesfully unblocked user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.promote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateUserId(req.params.userId);
                const result = yield this.adminService.promote(userId);
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Succesfully promoted to admin' });
            }
            catch (err) {
                next(err);
            }
        });
        this.demote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateUserId(req.params.userId);
                const result = yield this.adminService.demote(userId);
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Successfully demoted to user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateUserId(req.params.userId);
                const result = yield this.adminService.delete(userId);
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Successfully deleted user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.adminService = admin_service_1.default.getInstance();
    }
}
exports.default = new AdminController();
