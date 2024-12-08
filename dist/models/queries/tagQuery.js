"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsQuery = exports.createTemplateTagQuery = exports.createTagQuery = exports.findTagQuery = void 0;
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
