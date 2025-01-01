"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = exports.templateRoutes = void 0;
const template_routes_1 = __importDefault(require("./template.routes"));
exports.templateRoutes = template_routes_1.default;
const template_service_1 = __importDefault(require("./template.service"));
exports.TemplateService = template_service_1.default;
