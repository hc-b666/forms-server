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
const http_errors_1 = __importDefault(require("http-errors"));
const commentService_1 = __importDefault(require("../services/commentService"));
class CommentController {
    constructor() {
        this.createComment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const { content } = req.body;
                if (!content) {
                    throw (0, http_errors_1.default)(400, 'Content is required to comment');
                }
                yield this.commentService.createComment(parseInt(templateId), userId, content);
                res.status(200).json({ message: 'Successfully created comment' });
            }
            catch (err) {
                next(err);
            }
        });
        this.commentService = commentService_1.default.getInstance();
    }
}
exports.default = CommentController;
