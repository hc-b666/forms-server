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
const jwt_1 = __importDefault(require("../utils/jwt"));
const getErrorMessage_1 = require("../utils/getErrorMessage");
const userService_1 = __importDefault(require("../services/userService"));
class AuthMiddleware {
    constructor() {
        this.authenticate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    res.status(401).json({ message: 'No authorization header' });
                    return;
                }
                const token = jwt_1.default.extractTokenFromHeader(authHeader);
                const decoded = jwt_1.default.verifyToken(token);
                req.userId = decoded.userId;
                next();
            }
            catch (err) {
                const message = (0, getErrorMessage_1.getErrorMessage)(err);
                res.status(401).json({ message });
            }
        });
        this.isAuthor = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { templateId } = req.params;
                if (!templateId || isNaN(parseInt(templateId))) {
                    res.status(400).json({ message: 'Template ID is required' });
                    return;
                }
                const isAuthor = yield this.userService.checkIfUserIsAuthorOFTemplate(userId, parseInt(templateId));
                if (!isAuthor) {
                    res.status(403).json({ message: 'Action not allowed' });
                    return;
                }
                req.templateId = parseInt(templateId);
                next();
            }
            catch (err) {
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.userService = userService_1.default.getInstance();
    }
}
exports.default = AuthMiddleware;
