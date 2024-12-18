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
const tagService_1 = __importDefault(require("../services/tagService"));
class TagController {
    constructor() {
        this.getTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield this.tagService.getTags();
                res.status(200).json(tags);
            }
            catch (err) {
                console.log(`Error in getTags: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.searchTags = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                if (!query || typeof query !== 'string') {
                    res.status(400).json({ message: 'Invalid query' });
                    return;
                }
                const tags = yield this.tagService.searchTags(query);
                res.status(200).json(tags);
            }
            catch (err) {
                console.log(`Error in searchTags: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.tagService = new tagService_1.default();
    }
}
exports.default = TagController;
