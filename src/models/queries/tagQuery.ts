import pool from "../postgresDb";

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
interface ICreateTagsQuery {
  templateId: number;
  tags: string[];
}
export const createTagsQuery = async ({ templateId, tags }: ICreateTagsQuery) => {
  try {
    for (const tag of tags) {
      let tagRes = await pool.query(findTagQuery, [tag]);
      let tagId: number;

      if (tagRes.rows.length === 0) {
        tagRes = await pool.query(createTagQuery, [tag]);
        tagId = tagRes.rows[0].id;
      } else {
        tagId = tagRes.rows[0].id;
      }

      await pool.query(createTemplateTagQuery, [templateId, tagId]);
    }
  } catch (err) {
    console.error(`Error in createTagsQuery: ${err}`);
    throw err;
  }
};
