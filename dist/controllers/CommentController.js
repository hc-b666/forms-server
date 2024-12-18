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
const commentService_1 = __importDefault(require("../services/commentService"));
class CommentController {
    constructor() {
        this.createComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    res.status(400).json({ message: 'Template ID is required' });
                    return;
                }
                const userId = req.userId;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { content } = req.body;
                if (!content) {
                    res.status(400).json({ message: 'Content is required' });
                    return;
                }
                yield this.commentService.createComment(parseInt(templateId), userId, content);
                res.status(200).json({ message: 'Successfully created comment' });
            }
            catch (err) {
                console.log(`Error in createComment: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.commentService = commentService_1.default.getInstance();
    }
}
exports.default = CommentController;
