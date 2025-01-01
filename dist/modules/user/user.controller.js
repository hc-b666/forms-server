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
const http_errors_1 = __importDefault(require("http-errors"));
const user_service_1 = __importDefault(require("./user.service"));
class UserController {
    constructor() {
        this.findById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (!userId || isNaN(parseInt(userId))) {
                    throw (0, http_errors_1.default)('User Id is required');
                }
                const user = yield this.userService.findById(parseInt(userId));
                if (!user) {
                    throw (0, http_errors_1.default)('There is no user with this id');
                }
                res.status(200).json(user);
            }
            catch (err) {
                next(err);
            }
        });
        this.searchByEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const { query } = req.query;
                const users = yield this.userService.searchByEmaiL(query, user.id);
                res.status(200).json(users);
            }
            catch (err) {
                next(err);
            }
        });
        this.userService = user_service_1.default.getInstance();
    }
}
exports.default = new UserController();
