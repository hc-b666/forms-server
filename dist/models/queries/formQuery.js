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
exports.getFormsQuery = exports.getFormQuery = exports.checkIfUserIsAuthorOfTemplateQuery = exports.hasUserSubmittedFormQuery = exports.createFormQuery = void 0;
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
const checkIfUserIsAuthorOfTemplateSql = `
select exists (
  select 1 
  from template 
  where id = $1 and "createdBy" = $2
) as is_author
`;
const checkIfUserIsAuthorOfTemplateQuery = (templateId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(checkIfUserIsAuthorOfTemplateSql, [templateId, userId]);
        return rows[0].is_author;
    }
    catch (err) {
        console.error(`Error in checkIfUserIsAuthorOfTemplateQuery: ${err}`);
        throw err;
    }
});
exports.checkIfUserIsAuthorOfTemplateQuery = checkIfUserIsAuthorOfTemplateQuery;
const getFormSql = `
select 
  r.id as "responseId",
  r."questionId",
  r.answer,
  r."optionId",
  
  q.question,
  q.type as "questionType",
  
  qo.id as "questionOptionId",
  qo.option as "questionOptionText"

from response r
join question q on r."questionId" = q.id
left join "questionOption" qo on r."optionId" = qo.id
where r."formId" = $1
`;
// const getFormSql = `
// with checkbox_responses as (
//   select 
//     r."questionId",
//     jsonb_build_object('optionId', qo.id, 'option', qo.option) as "selectedOptions"
//   from response r
//   join question q on r."questionId" = q.id
//   join "questionOption" qo on r."optionId" = qo.id
//   where r."formId" = $1 and q.type = 'checkbox'
//   group by r."questionId", qo.id
// ),
// all_responses as (
//   select
//     r.id as "responseId",
//     r."questionId",
//     r.answer,
//     r."optionId",
//     q.id as "questionId",
//     q.question,
//     q.type as "questionType",
//     qo.id as "questionOptionId",
//     qo.option as "questionOptionText"
//   from response r
//   join question q on r."questionId" = q.id
//   left join "questionOption" qo on r."optionId" = qo.id
//   where r."formId" = $1
// )
// select ar.*, coalesce(cr."selectedOptions", '[]'::jsonb) as "selectedOptions"
// from all_responses ar
// left join checkbox_responses cr on ar."questionId" = cr."questionId"
// order by ar."questionId"
// `;
const getFormQuery = (formId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(getFormSql, [formId]);
        const responses = [];
        rows.forEach((response) => {
            const responseIndex = responses.findIndex((r) => r.questionId === response.questionId);
            if (responseIndex === -1) {
                responses.push({
                    questionId: response.questionId,
                    question: response.question,
                    questionType: response.questionType,
                    selectedOptions: response.questionType === 'checkbox' ? [] : null,
                    responseId: response.responseId,
                    answer: response.answer,
                    options: response.questionType === 'checkbox' ? [] : null,
                });
            }
            else {
                if (response.questionType === 'checkbox') {
                    responses[responseIndex].selectedOptions.push({
                        optionId: response.questionOptionId,
                        option: response.questionOptionText,
                    });
                }
                else {
                    responses[responseIndex].answer = response.answer;
                }
            }
        });
        return { rows, responses };
    }
    catch (err) {
        console.error(`Error in getFormQuery: ${err}`);
        throw err;
    }
});
exports.getFormQuery = getFormQuery;
const getFormsSql = `
select
  f.id as "formId",
  f."filledBy",
  u.email,
  f."filledAt"
from form f
join template t on f."templateId" = t.id
join "user" u on f."filledBy" = u.id
where f."templateId" = $1
order by f."filledAt" desc
`;
const getFormsQuery = (templateId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(getFormsSql, [templateId]);
        return rows;
    }
    catch (err) {
        console.error(`Error in getFormsQuery: ${err}`);
        throw err;
    }
});
exports.getFormsQuery = getFormsQuery;
