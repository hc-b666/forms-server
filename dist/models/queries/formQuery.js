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
exports.hasUserSubmittedFormQuery = exports.createFormQuery = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
const createFormSql = `
insert into form ("filledBy", "templateId") 
values ($1, $2)
returning id
`;
const createResponseSql = `
insert into response ("formId", "questionId", answer, "optionId")
values ($1, $2, $3, $4)
`;
const createFormQuery = (_a) => __awaiter(void 0, [_a], void 0, function* ({ filledBy, templateId, responses }) {
    try {
        const { rows } = yield postgresDb_1.default.query(createFormSql, [filledBy, templateId]);
        const formId = rows[0].id;
        for (const response of responses) {
            if (typeof response.answer === "string") {
                yield postgresDb_1.default.query(createResponseSql, [formId, response.questionId, response.answer, null]);
            }
            else if (typeof response.answer === "number") {
                yield postgresDb_1.default.query(createResponseSql, [formId, response.questionId, null, response.answer]);
            }
            else {
                for (const optionId of response.answer) {
                    yield postgresDb_1.default.query(createResponseSql, [formId, response.questionId, null, optionId]);
                }
            }
        }
    }
    catch (err) {
        console.error(`Error in createFormQuery: ${err}`);
        throw err;
    }
});
exports.createFormQuery = createFormQuery;
const hasUserSubmittedFormSql = `
select exists (
  select 1
  from form
  where "filledBy" = $1 and "templateId" = $2
)
`;
const hasUserSubmittedFormQuery = (filledBy, templateId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(hasUserSubmittedFormSql, [filledBy, templateId]);
        return rows[0].exists;
    }
    catch (err) {
        console.error(`Error in hasUserSubmittedFormQuery: ${err}`);
        throw err;
    }
});
exports.hasUserSubmittedFormQuery = hasUserSubmittedFormQuery;
