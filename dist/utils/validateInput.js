"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
const http_errors_1 = __importDefault(require("http-errors"));
function validateInput(data, requiredFields) {
    for (const field of requiredFields) {
        if (!data[field]) {
            throw (0, http_errors_1.default)(400, `${field} is required`);
        }
    }
}
