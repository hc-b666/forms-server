export const findTagQuery = `
SELECT id 
FROM tag 
WHERE "tagName" = $1
`;

export const createTagQuery = `
INSERT INTO tag ("tagName") 
VALUES ($1) 
RETURNING id
`;

export const createTemplateTagQuery = `
INSERT INTO "templateTag" ("templateId", "tagId") 
VALUES ($1, $2)
`;

export const getTagsQuery = `
select t.id, t."tagName"
from "tag" t
limit 20
`;