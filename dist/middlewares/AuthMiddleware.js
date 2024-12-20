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
const jwt_1 = __importDefault(require("../utils/jwt"));
const userService_1 = __importDefault(require("../services/userService"));
class AuthMiddleware {
    constructor() {
        this.authenticate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    throw (0, http_errors_1.default)(401, 'Authorization header is required');
                }
                const token = jwt_1.default.extractTokenFromHeader(authHeader);
                const decoded = jwt_1.default.verifyToken(token);
                req.userId = decoded.userId;
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.isAuthor = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (!userId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const { templateId } = req.params;
                if (!templateId || isNaN(parseInt(templateId))) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                const isAuthor = yield this.userService.checkIfUserIsAuthorOFTemplate(userId, parseInt(templateId));
                if (!isAuthor) {
                    throw (0, http_errors_1.default)(403, 'Action is not allowed');
                }
                req.templateId = parseInt(templateId);
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.userService = userService_1.default.getInstance();
    }
}
exports.default = AuthMiddleware;
