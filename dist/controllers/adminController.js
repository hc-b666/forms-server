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
const adminService_1 = __importDefault(require("../services/adminService"));
const http_errors_1 = __importDefault(require("http-errors"));
class AdminController {
    constructor() {
        this.blockUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'UserId is required');
                }
                const result = yield this.adminService.blockUser(parseInt(userId));
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Successfully blocked user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.unblockUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'UserId is required');
                }
                const result = yield this.adminService.unblockUser(parseInt(userId));
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Succesfully unblocked user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.promoteToAdmin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'UserId is required');
                }
                const result = yield this.adminService.promoteToAdmin(parseInt(userId));
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Succesfully promoted to admin' });
            }
            catch (err) {
                next(err);
            }
        });
        this.demoteToUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'UserId is required');
                }
                const result = yield this.adminService.demoteToUser(parseInt(userId));
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Successfully demoted to user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'UserId is required');
                }
                const result = yield this.adminService.deleteUser(parseInt(userId));
                if (!result) {
                    throw (0, http_errors_1.default)(404, `User with ${userId} is not found`);
                }
                res.status(200).json({ message: 'Successfully deleted user' });
            }
            catch (err) {
                next(err);
            }
        });
        this.adminService = adminService_1.default.getInstance();
    }
}
exports.default = new AdminController();
