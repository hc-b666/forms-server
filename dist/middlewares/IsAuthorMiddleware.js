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
exports.isAuthorMiddleware = void 0;
const formQuery_1 = require("../models/queries/formQuery");
const isAuthorMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const { templateId } = req.params;
        if (!templateId || isNaN(parseInt(templateId))) {
            res.status(400).json({ message: 'Template ID is required' });
            return;
        }
        const isAuthor = yield (0, formQuery_1.checkIfUserIsAuthorOfTemplateQuery)(parseInt(req.params.templateId), userId);
        if (!isAuthor) {
            res.status(401).json({ message: 'Action not allowed' });
            return;
        }
        req.templateId = parseInt(templateId);
        next();
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.isAuthorMiddleware = isAuthorMiddleware;
