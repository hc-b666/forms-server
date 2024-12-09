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
exports.unlikeTemplateQuery = exports.likeTemplateQuery = exports.getProfileTemplatesQuery = exports.getTemplateByIdQuery = exports.getLatestTemplatesQuery = exports.getTop5Query = exports.createTemplateQuery = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
exports.createTemplateQuery = `
insert into "template" ("createdBy", "title", "description", "topic", "isPublic") 
values ($1, $2, $3, $4, $5) 
returning id
`;
exports.getTop5Query = `
select t.id, t.title, t.topic, t."createdAt", u."email", count(f.id) as "responses", array_agg(ta."tagName") as tags
from "template" t
join "user" u on t."createdBy" = u.id
left join "form" f on t.id = f."templateId"
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
where t."isPublic" = true
group by t.id, t.title, t.description, t.topic, t."isPublic", t."createdAt", u."firstName", u."lastName", u."email"
order by count(f.id) desc
limit 5
`;
exports.getLatestTemplatesQuery = `
select t.id, t.title, t.topic, t."createdAt", u."email", array_agg(ta."tagName") as tags
from "template" t
join "user" u on t."createdBy" = u.id
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
where t."isPublic" = true
group by t.id, t.title, t.description, t.topic, t."isPublic", t."createdAt", u."firstName", u."lastName", u."email"
order by t."createdAt" desc
limit 10
`;
exports.getTemplateByIdQuery = `
select t.id as "templateId", 
       t.title, 
       t.description, 
       t.topic, 
       t."createdAt",
       u."email",
       u."id" as "userId",
       array_agg(distinct ta."tagName") as tags, 
       array_agg(distinct jsonb_build_object('id', c.id, 
                                             'content', c.content, 
                                             'createdAt', c."createdAt", 
                                             'user', jsonb_build_object('id', u2.id, 
                                                                        'email', u2.email)) 
                 ) FILTER (WHERE c.id IS NOT NULL) as comments,
       array_agg(distinct jsonb_build_object('id', q.id, 'question', q.question, 'type', q.type, 'options', q.options)) as questions
from "template" t
join "user" u on t."createdBy" = u.id
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
left join "comment" c on t.id = c."templateId"
left join "user" u2 on c."userId" = u2.id
left join "question" q on t.id = q."templateId"
where t.id = $1
group by t.id, t.title, t.description, t.topic, t."isPublic", t."createdAt", u."firstName", u."lastName", u."email", u."id"
`;
const getProfileTemplatesSql = `
select t.id as "templateId", t.title, t.topic, t."createdAt", array_agg(distinct ta."tagName") as tags, count(f.id) as "responses"
from "template" t
join "user" u on t."createdBy" = u.id
left join "form" f on t.id = f."templateId"
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
where t."createdBy" = $1
group by t.id, t.title, t.topic, t."createdAt"
order by t."createdAt" desc
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
const likeTemplateSql = `insert into like ("userId", "templateId") values ($1, $2)`;
const likeTemplateQuery = (userId, templateId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield postgresDb_1.default.query(likeTemplateSql, [userId, templateId]);
    }
    catch (err) {
        console.error(`Error in likeTemplateQuery: ${err}`);
        throw err;
    }
});
exports.likeTemplateQuery = likeTemplateQuery;
const unlikeTemplateSql = `delete from like where "userId" = $1 and "templateId" = $2`;
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
