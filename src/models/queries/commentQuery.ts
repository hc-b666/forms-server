import pool from "../postgresDb";

const createCommentSql = `
insert into comment ("userId", "templateId", content)
values ($1, $2, $3)
`;

export const createCommentQuery = async (userId: number, templateId: number, content: string) => {
  try {
    await pool.query(createCommentSql, [userId, templateId, content]);
  } catch (err) {
    console.error(`Error at createCommentQuery: ${err}`);
    throw err;
  }
};

const getCommentsSql = `

`;

export const getCommentsQuery = async (templateId: number) => {};

