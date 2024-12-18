"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TagController_1 = __importDefault(require("../controllers/TagController"));
const router = express_1.default.Router();
const tagController = new TagController_1.default();
router.get('/', tagController.getTags);
router.get('/search', tagController.searchTags);
exports.default = router;
