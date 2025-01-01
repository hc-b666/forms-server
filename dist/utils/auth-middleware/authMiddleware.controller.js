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
const client_1 = require("@prisma/client");
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = __importDefault(require("../jwt"));
const authMiddlware_service_1 = __importDefault(require("./authMiddlware.service"));
class AuthMiddlewareController {
    constructor() {
        this.validateAuthHeader = (authHeader) => {
            if (!authHeader) {
                throw (0, http_errors_1.default)(401, 'Authorization header is required');
            }
            const token = jwt_1.default.extractTokenFromHeader(authHeader);
            const decoded = jwt_1.default.verifyToken(token);
            return decoded;
        };
        this.checkUser = (decoded) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authMiddlewareService.findUserByEmail(decoded.email);
            if (!user) {
                throw (0, http_errors_1.default)(401, 'Unauthorized');
            }
            if (user.isBlocked) {
                throw (0, http_errors_1.default)(401, 'You are blocked. Ask from our customer services to unblock you.');
            }
            if (decoded.role === "ADMIN" && user.role === "USER") {
                throw (0, http_errors_1.default)(403, 'Forbidden');
            }
            return user;
        });
        this.addUserToRequest = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (authHeader) {
                    const token = jwt_1.default.extractTokenFromHeader(authHeader);
                    const decoded = jwt_1.default.verifyToken(token);
                    req.user = {
                        id: decoded.userId,
                        email: decoded.email,
                        role: decoded.role,
                    };
                }
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.authenticate = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this.validateAuthHeader(req.headers.authorization);
                const user = yield this.checkUser(decoded);
                req.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                };
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.validateId = (id, paramName) => {
            if (!id || isNaN(parseInt(id))) {
                throw (0, http_errors_1.default)(400, `${paramName} is required`);
            }
            return parseInt(id);
        };
        this.isAuthor = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const templateId = this.validateId(req.params.templateId, 'Template Id');
                const formId = this.validateId(req.params.formId, 'Form Id');
                const isAuthorOfTemplate = yield this.authMiddlewareService.isAuthorOfTemplate(user.id, templateId);
                const isAuthorOfForm = yield this.authMiddlewareService.isAuthorOfForm(user.id, formId);
                if (!isAuthorOfTemplate && !isAuthorOfForm && user.role !== client_1.UserRole.ADMIN) {
                    throw (0, http_errors_1.default)(403, 'Forbidden - You are not allowed');
                }
                req.templateId = templateId;
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.isTemplateAuthor = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const templateId = this.validateId(req.params.templateId, 'Template Id');
                const isAuthorOfTemplate = yield this.authMiddlewareService.isAuthorOfTemplate(user.id, templateId);
                if (!isAuthorOfTemplate && user.role !== client_1.UserRole.ADMIN) {
                    throw (0, http_errors_1.default)(403, 'Forbidden - You are not allowed');
                }
                req.templateId = templateId;
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.isFormAuthor = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const formId = this.validateId(req.params.formId, 'Form Id');
                const isAuthorOfForm = yield this.authMiddlewareService.isAuthorOfForm(userId, formId);
                if (!isAuthorOfForm && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== client_1.UserRole.ADMIN) {
                    throw (0, http_errors_1.default)(403, 'Forbidden - You are not allowed');
                }
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.isAdmin = (req, _res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                if (req.user.role !== client_1.UserRole.ADMIN) {
                    throw (0, http_errors_1.default)(403, 'Forbidden - You are not allowed');
                }
                next();
            }
            catch (err) {
                next(err);
            }
        });
        this.authMiddlewareService = authMiddlware_service_1.default.getInstance();
    }
}
exports.default = new AuthMiddlewareController();
