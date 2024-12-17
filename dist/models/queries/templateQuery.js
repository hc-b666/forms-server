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
exports.searchByTagQuery = exports.unlikeTemplateQuery = exports.likeTemplateQuery = exports.getProfileTemplatesQuery = exports.getTemplateByIdQuery = exports.getLatestTemplatesQuery = exports.getLatestTemplatesSql = exports.getTopTemplatesQuery = exports.getTopTemplatesSql = exports.createTemplateQuery = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
const createTemplateSql = `
insert into template ("createdBy", title, description, topic, "isPublic")
values ($1, $2, $3, $4, $5)
returning id
`;
const createTemplateQuery = (userId, title, description, topic, isPublic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(createTemplateSql, [userId, title, description, topic, isPublic]);
        return rows[0].id;
    }
    catch (err) {
        console.error(`Error in createTemplateQuery: ${err}`);
        throw err;
    }
});
exports.createTemplateQuery = createTemplateQuery;
exports.getTopTemplatesSql = `
select 
  t.id, 
  t.title, 
  t.description,
  t.topic, 
  t."createdAt", 
  u.email, 
  count(distinct f.id) as "responses", 
  count(distinct l."id") as "totalLikes",
  case 
    when $1::int is null then false
    else exists (
      select 1 
      from "like" l2
      where l2."templateId" = t.id and l2."userId" = $1::int
    )
  end as "hasLiked"
from template t
join "user" u on t."createdBy" = u.id
left join form f on t.id = f."templateId"
left join "like" l on l."templateId" = t.id
where t."isPublic" = true
group by t.id, u.email
order by count(distinct f.id) desc
limit 5
`;
const getTopTemplatesQuery = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(exports.getTopTemplatesSql, [userId]);
        return rows;
    }
    catch (err) {
        console.error(`Error in getTopTemplatesQuery: ${err}`);
        throw err;
    }
});
exports.getTopTemplatesQuery = getTopTemplatesQuery;
exports.getLatestTemplatesSql = `
select 
  t.id, 
  t.title, 
  t.description, 
  t.topic, 
  t."createdAt", 
  u.email
from template t
join "user" u on t."createdBy" = u.id
where t."isPublic" = true
order by t."createdAt" desc
limit 10
`;
const getLatestTemplatesQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(exports.getLatestTemplatesSql);
        return rows;
    }
    catch (err) {
        console.error(`Error in getLatestTemplatesQuery: ${err}`);
        throw err;
    }
});
exports.getLatestTemplatesQuery = getLatestTemplatesQuery;
const getTemplateByIdSql = `
select 
  t.id as "templateId", 
  t.title, 
  t.description, 
  t.topic, 
  t."createdAt", 
  u.id as "userId", 
  u.email 
from template t
join "user" u on t."createdBy" = u.id
where t.id = $1
`;
const getTemplateTagsSql = `
select ta."tagName"
from template t
join "templateTag" tt on t.id = tt."templateId"
join tag ta on tt."tagId" = ta.id
where t.id = $1
`;
const getTemplateQuestionsSql = `
select q.id, q.question, q.type
from template t
join question q on t.id = q."templateId"
where t.id = $1
`;
const getQuestionOptionsSql = `
select qo.id, qo.option
from "questionOption" qo
where qo."questionId" = $1
`;
const getTemplateCommentsSql = `
select c.id as "commentId", c.content, c."createdAt", u.id as "authorId", u.email
from template t
join comment c on t.id = c."templateId"
join "user" u on c."userId" = u.id
where t.id = $1
order by c."createdAt" desc
`;
const getTemplateByIdQuery = (templateId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getTemplateRes = yield postgresDb_1.default.query(getTemplateByIdSql, [templateId]);
        if (getTemplateRes.rows.length === 0) {
            return null;
        }
        const template = getTemplateRes.rows[0];
        const getTagsRes = yield postgresDb_1.default.query(getTemplateTagsSql, [templateId]);
        template.tags = getTagsRes.rows.map(row => row.tagName);
        const getQuestionsRes = yield postgresDb_1.default.query(getTemplateQuestionsSql, [templateId]);
        template.questions = [];
        for (const question of getQuestionsRes.rows) {
            const getOptionsRes = yield postgresDb_1.default.query(getQuestionOptionsSql, [question.id]);
            question.options = getOptionsRes.rows;
            template.questions.push(question);
        }
        const getCommentsRes = yield postgresDb_1.default.query(getTemplateCommentsSql, [templateId]);
        template.comments = getCommentsRes.rows;
        return template;
    }
    catch (err) {
        console.error(`Error in getTemplateByIdQuery: ${err}`);
        throw err;
    }
});
exports.getTemplateByIdQuery = getTemplateByIdQuery;
const getProfileTemplatesSql = `
with templatedata as (
  select 
    t.id, 
    t.title, 
    t.topic, 
    t."createdAt",
    array_agg(distinct ta."tagName") as tags,
    count(distinct f.id) as "responses"
  from template t
  join "user" u ON t."createdBy" = u.id
  left join form f on t.id = f."templateId"
  left join "templateTag" tt on t.id = tt."templateId"
  left join tag ta on tt."tagId" = ta.id
  where t."createdBy" = $1
  group by t.id
)
select * from templatedata
order by "createdAt" desc
`;
const getProfileTemplatesQuery = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(getProfileTemplatesSql, [userId]);
        return rows;
    }
    catch (err) {
        console.error(`Error in getProfileQuery: ${err}`);
        throw err;
    }
});
exports.getProfileTemplatesQuery = getProfileTemplatesQuery;
const likeTemplateSql = `
insert into "like" ("userId", "templateId") 
values ($1, $2)
`;
const checkLikeTemplateSql = `
select count(*) 
from "like" 
where "userId" = $1 and "templateId" = $2
`;
const likeTemplateQuery = (userId, templateId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield postgresDb_1.default.query(checkLikeTemplateSql, [userId, templateId]);
        if (res.rows[0].count > 0)
            return;
        yield postgresDb_1.default.query(likeTemplateSql, [userId, templateId]);
    }
    catch (err) {
        console.error(`Error in likeTemplateQuery: ${err}`);
        throw err;
    }
});
exports.likeTemplateQuery = likeTemplateQuery;
const unlikeTemplateSql = `
delete 
from "like" 
where "userId" = $1 and "templateId" = $2
`;
const unlikeTemplateQuery = (userId, templateId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield postgresDb_1.default.query(unlikeTemplateSql, [userId, templateId]);
    }
    catch (err) {
        console.error(`Error in unlikeTemplateQuery: ${err}`);
        throw err;
    }
});
exports.unlikeTemplateQuery = unlikeTemplateQuery;
const searchByTagSql = `
select
  t.id,
  t.title,
  t.description,
  t.topic,
  t."createdAt",
  u.email,
  count(distinct f.id) as "responses",
  count(distinct l."id") as "totalLikes",
  case 
    when $1::int is null then false
    else exists (
      select 1 
      from "like" l2
      where l2."templateId" = t.id and l2."userId" = $1::int
    )
  end as "hasLiked"
from template t
join "templateTag" tt on t.id = tt."templateId"
join tag ta on tt."tagId" = ta.id
where ta.id = $2
`;
const searchByTagQuery = (userId, tagId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield postgresDb_1.default.query(searchByTagSql, [userId, tagId]);
        return rows;
    }
    catch (err) {
        console.error(`Error in searchByTagQuery: ${err}`);
        throw err;
    }
});
exports.searchByTagQuery = searchByTagQuery;
