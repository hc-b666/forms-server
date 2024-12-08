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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const getErrorMessage_1 = require("../utils/getErrorMessage");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifySecretTokenFromHeader)(authHeader);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        const message = (0, getErrorMessage_1.getErrorMessage)(err);
        res.status(403).json({ message });
    }
});
exports.authMiddleware = authMiddleware;
