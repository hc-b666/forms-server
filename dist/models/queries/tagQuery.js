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
exports.searchTagsQuery = exports.searchTagsSql = exports.createTagsQuery = exports.getTagsSql = exports.createTemplateTagSql = exports.createTagSql = exports.findTagSql = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
exports.findTagSql = `
SELECT id 
FROM tag 
WHERE "tagName" = $1
`;
exports.createTagSql = `
INSERT INTO tag ("tagName") 
VALUES ($1) 
RETURNING id
`;
exports.createTemplateTagSql = `
INSERT INTO "templateTag" ("templateId", "tagId") 
VALUES ($1, $2)
`;
exports.getTagsSql = `
select t.id, t."tagName"
from "tag" t
limit 20
`;
const createTagsQuery = (_a) => __awaiter(void 0, [_a], void 0, function* ({ templateId, tags }) {
    try {
        for (const tag of tags) {
            let tagRes = yield postgresDb_1.default.query(exports.findTagSql, [tag]);
            let tagId;
            if (tagRes.rows.length === 0) {
                tagRes = yield postgresDb_1.default.query(exports.createTagSql, [tag]);
                tagId = tagRes.rows[0].id;
            }
            else {
                tagId = tagRes.rows[0].id;
            }
            yield postgresDb_1.default.query(exports.createTemplateTagSql, [templateId, tagId]);
        }
    }
    catch (err) {
        console.error(`Error in createTagsQuery: ${err}`);
        throw err;
    }
});
exports.createTagsQuery = createTagsQuery;
exports.searchTagsSql = `
select id, "tagName"
from tag t
where t."tagName" ilike $1
order by t."tagName"
limit 10
`;
const searchTagsQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield postgresDb_1.default.query(exports.searchTagsSql, [`%${query}%`]);
        return tags.rows;
    }
    catch (err) {
        console.error(`Error in searchTagsQuery: ${err}`);
        throw err;
    }
});
exports.searchTagsQuery = searchTagsQuery;
