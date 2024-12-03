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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dbConnection_1 = __importDefault(require("./models/dbConnection"));
const TestModel_1 = __importDefault(require("./models/TestModel"));
const corsConfig = {
    origin: ['http://localhost:5173', 'https://customizable-forms-client.vercel.app/'],
    credentials: true,
};
const app = (0, express_1.default)();
(0, dbConnection_1.default)();
app.use((0, cors_1.default)(corsConfig));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const test = yield TestModel_1.default.create({ name: 'Test worked' });
        res.json({ message: test });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server err' });
    }
}));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
