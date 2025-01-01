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
const comment_service_1 = __importDefault(require("./comment.service"));
const comment_dto_1 = require("./dto/comment.dto");
class CommentController {
    constructor() {
        this.validateId = (id) => {
            if (!id || isNaN(parseInt(id))) {
                throw (0, http_errors_1.default)(400, 'Template Id is required');
            }
            return parseInt(id);
        };
        this.findComments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = this.validateId(req.params.templateId);
                const comments = yield this.commentService.findComments(templateId);
                res.status(200).json(comments);
            }
            catch (err) {
                next(err);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const templateId = this.validateId(req.params.templateId);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const result = comment_dto_1.commentSchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(400, firstError.message);
                }
                yield this.commentService.create(templateId, userId, result.data.content);
                res.status(200).json({ message: 'Successfully created comment' });
            }
            catch (err) {
                next(err);
            }
        });
        this.commentService = comment_service_1.default.getInstance();
    }
}
exports.default = new CommentController();
