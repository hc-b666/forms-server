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
exports.createTagsQuery = exports.getTagsQuery = exports.createTemplateTagQuery = exports.createTagQuery = exports.findTagQuery = void 0;
const postgresDb_1 = __importDefault(require("../postgresDb"));
exports.findTagQuery = `
SELECT id 
FROM tag 
WHERE "tagName" = $1
`;
exports.createTagQuery = `
INSERT INTO tag ("tagName") 
VALUES ($1) 
RETURNING id
`;
exports.createTemplateTagQuery = `
INSERT INTO "templateTag" ("templateId", "tagId") 
VALUES ($1, $2)
`;
exports.getTagsQuery = `
select t.id, t."tagName"
from "tag" t
limit 20
`;
const createTagsQuery = (_a) => __awaiter(void 0, [_a], void 0, function* ({ templateId, tags }) {
    try {
        for (const tag of tags) {
            let tagRes = yield postgresDb_1.default.query(exports.findTagQuery, [tag]);
            let tagId;
            if (tagRes.rows.length === 0) {
                tagRes = yield postgresDb_1.default.query(exports.createTagQuery, [tag]);
                tagId = tagRes.rows[0].id;
            }
            else {
                tagId = tagRes.rows[0].id;
            }
            yield postgresDb_1.default.query(exports.createTemplateTagQuery, [templateId, tagId]);
        }
    }
    catch (err) {
        console.error(`Error in createTagsQuery: ${err}`);
        throw err;
    }
});
exports.createTagsQuery = createTagsQuery;
