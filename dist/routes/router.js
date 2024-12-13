"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController = __importStar(require("../controllers/AuthController"));
const TemplateController = __importStar(require("../controllers/TemplateController"));
const TagController = __importStar(require("../controllers/TagController"));
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const router = express_1.default.Router();
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/validate-token', AuthController.validateToken);
router.get('/templates/top5', TemplateController.getTopTemplates);
router.get('/templates/latest', TemplateController.getLatestTemplates);
router.get('/templates/:id', TemplateController.getTemplateById);
router.get('/templates/profile/:userId', AuthMiddleware_1.authMiddleware, TemplateController.getProfile);
router.post('/templates/create', AuthMiddleware_1.authMiddleware, TemplateController.createTemplate);
// router.patch('/templates/update/:templateId', authMiddleware, TemplateController.updateTemplate);
// router.delete('/templates/delete/:templateId', authMiddleware, TemplateController.deleteTemplate);
router.post('/templates/like/:templateId', AuthMiddleware_1.authMiddleware, TemplateController.likeTemplate);
router.post('/templates/unlike/:templateId', AuthMiddleware_1.authMiddleware, TemplateController.unlikeTemplate);
// router.post('/templates/comment/:templateId', authMiddleware, TemplateController.commentOnTemplate);
router.get('/tags', TagController.getTags);
router.post('/forms/submit/:templateId', AuthMiddleware_1.authMiddleware, TemplateController.createForm);
router.post('/forms/check/:templateId', AuthMiddleware_1.authMiddleware, TemplateController.hasUserSubmittedForm);
exports.default = router;
