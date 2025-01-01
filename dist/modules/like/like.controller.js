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
const like_service_1 = __importDefault(require("./like.service"));
class LikeController {
    constructor() {
        this.validateId = (id) => {
            if (!id || isNaN(parseInt(id))) {
                throw (0, http_errors_1.default)(400, 'Invalid templateId');
            }
            return parseInt(id);
        };
        this.findLikes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const templateId = this.validateId(req.params.templateId);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (userId) {
                    const likeInfo = yield this.likeService.findLikes(userId, templateId);
                    res.json(likeInfo);
                }
                else {
                    const likeCount = yield this.likeService.getLikeCount(templateId);
                    res.json({ isLiked: false, likeCount });
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.toggleLike = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const templateId = this.validateId(req.params.templateId);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const isLiked = yield this.likeService.toggleLike(userId, templateId);
                res.json({ message: isLiked ? 'Template liked' : 'Template unliked' });
            }
            catch (err) {
                next(err);
            }
        });
        this.likeService = like_service_1.default.getInstance();
    }
}
exports.default = new LikeController();
