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
const express_1 = __importDefault(require("express"));
const likeController_1 = __importDefault(require("../controllers/likeController"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const router = express_1.default.Router();
const authMiddleware = new AuthMiddleware_1.default();
const addUserToRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
router.get('/:templateId([0-9]+)', addUserToRequest, likeController_1.default.getTemplateLikes);
router.post('/:templateId([0-9]+)', authMiddleware.authenticate, likeController_1.default.toggleTemplateLike);
exports.default = router;
