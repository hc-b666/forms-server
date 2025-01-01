"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tag_controller_1 = __importDefault(require("./tag.controller"));
const router = (0, express_1.Router)();
router.get('/', tag_controller_1.default.findTags);
router.get('/search', tag_controller_1.default.searchTags);
exports.default = router;
