"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const errors_1 = require("./utils/errors");
const corsConfig = {
    origin: ['http://localhost:8080', 'https://customizable-forms-client.vercel.app'],
    credentials: true,
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsConfig));
app.use('/api/v1', router_1.default);
app.use(errors_1.endpointNotFound);
app.use(errors_1.errorMiddleware);
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
