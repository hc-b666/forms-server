"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../utils/auth-middleware");
const form_controller_1 = __importDefault(require("./form.controller"));
const router = (0, express_1.Router)();
router.get('/user/:userId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, form_controller_1.default.getByUserId);
router.get('/:templateId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, auth_middleware_1.AuthMiddleware.isTemplateAuthor, form_controller_1.default.getByTemplateId);
router.get('/:templateId([0-9]+)/responses/:formId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, auth_middleware_1.AuthMiddleware.isAuthor, form_controller_1.default.getById);
router.get('/check/:templateId([0-9]+)', auth_middleware_1.AuthMiddleware.addUserToRequest, form_controller_1.default.hasSubmittedForm);
router.post('/submit/:templateId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, form_controller_1.default.create);
router.put('/:formId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, auth_middleware_1.AuthMiddleware.isFormAuthor, form_controller_1.default.update);
router.delete('/:formId([0-9]+)', auth_middleware_1.AuthMiddleware.authenticate, auth_middleware_1.AuthMiddleware.isFormAuthor, form_controller_1.default.delete);
exports.default = router;
