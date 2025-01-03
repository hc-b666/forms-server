"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const errors_1 = require("./utils/errors");
const cors_2 = require("./config/cors");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)(cors_2.corsConfig));
    app.use('/api/v1', router_1.default);
    app.use(errors_1.endpointNotFound);
    app.use(errors_1.errorMiddleware);
    return app;
};
exports.createApp = createApp;
