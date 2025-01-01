"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = exports.tagRoutes = void 0;
const tag_routes_1 = __importDefault(require("./tag.routes"));
exports.tagRoutes = tag_routes_1.default;
const tag_service_1 = __importDefault(require("./tag.service"));
exports.TagService = tag_service_1.default;
