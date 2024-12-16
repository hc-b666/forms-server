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
exports.getCommentsQuery = exports.createCommentQuery = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
const createCommentSql = `
insert into comment ("userId", "templateId", content)
values ($1, $2, $3)
`;
const createCommentQuery = (userId, templateId, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield postgresDb_1.default.query(createCommentSql, [userId, templateId, content]);
    }
    catch (err) {
        console.error(`Error at createCommentQuery: ${err}`);
        throw err;
    }
});
exports.createCommentQuery = createCommentQuery;
const getCommentsSql = `

`;
const getCommentsQuery = (templateId) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getCommentsQuery = getCommentsQuery;
