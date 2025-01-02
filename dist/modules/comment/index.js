"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = exports.CommentService = exports.commentRoutes = void 0;
const comment_routes_1 = __importDefault(require("./comment.routes"));
exports.commentRoutes = comment_routes_1.default;
const comment_service_1 = __importDefault(require("./comment.service"));
exports.CommentService = comment_service_1.default;
const comment_dto_1 = require("./dto/comment.dto");
Object.defineProperty(exports, "commentSchema", { enumerable: true, get: function () { return comment_dto_1.commentSchema; } });
