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
exports.createQuestionsQuery = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
const createQuestionSql = `
insert into question ("templateId", question, type)
values ($1, $2, $3)
returning id
`;
const createQuestionOptionSql = `
insert into "questionOption" ("questionId", option)
values ($1, $2)
`;
const createQuestionsQuery = (_a) => __awaiter(void 0, [_a], void 0, function* ({ templateId, questions }) {
    try {
        for (const q of questions) {
            const res = yield postgresDb_1.default.query(createQuestionSql, [templateId, q.question, q.type]);
            const questionId = res.rows[0].id;
            if (q.type === 'mcq' || q.type === 'checkbox') {
                for (const option of q.options) {
                    yield postgresDb_1.default.query(createQuestionOptionSql, [questionId, option]);
                }
            }
        }
    }
    catch (err) {
        console.error(`Error in createQuestionQuery: ${err}`);
        throw err;
    }
});
exports.createQuestionsQuery = createQuestionsQuery;
