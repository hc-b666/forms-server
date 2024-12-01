"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const corsConfig = {
    origin: ['http://localhost:5173'],
    credentials: true,
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsConfig));
app.get('/', (req, res) => {
    res.json({ message: 'We got your request!' });
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
