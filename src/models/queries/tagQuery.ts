import pool from "../postgresDb";

export const findTagSql = `
SELECT id 
FROM tag 
WHERE "tagName" = $1
`;

export const createTagSql = `
INSERT INTO tag ("tagName") 
VALUES ($1) 
RETURNING id
`;

export const createTemplateTagSql = `
INSERT INTO "templateTag" ("templateId", "tagId") 
VALUES ($1, $2)
`;

export const getTagsSql = `
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
      let tagRes = await pool.query(findTagSql, [tag]);
      let tagId: number;

      if (tagRes.rows.length === 0) {
        tagRes = await pool.query(createTagSql, [tag]);
        tagId = tagRes.rows[0].id;
      } else {
        tagId = tagRes.rows[0].id;
      }

      await pool.query(createTemplateTagSql, [templateId, tagId]);
    }
  } catch (err) {
    console.error(`Error in createTagsQuery: ${err}`);
    throw err;
  }
};

export const searchTagsSql = `
select id, "tagName"
from tag t
where t."tagName" ilike $1
order by t."tagName"
limit 10
`;

export const searchTagsQuery = async (query: string) => {
  try {
    const tags = await pool.query(searchTagsSql, [`%${query}%`]);

    return tags.rows;
  } catch (err) {
    console.error(`Error in searchTagsQuery: ${err}`);
    throw err;
  }
};
