import pool from "../postgresDb";

const createQuestionSql = `
insert into question ("templateId", question, type)
values ($1, $2, $3)
returning id
`;

const createQuestionOptionSql = `
insert into "questionOption" ("questionId", option)
values ($1, $2)
`;

interface ICreateQuestionsQuery {
  templateId: number;
  questions: {
    question: string;
    type: string;
    options: string[];
  }[];
}
export const createQuestionsQuery = async ({ templateId, questions }: ICreateQuestionsQuery) => {
  try {
    for (const q of questions) {
      const res = await pool.query(createQuestionSql, [templateId, q.question, q.type]);
      const questionId = res.rows[0].id;

      if (q.type === 'mcq' || q.type === 'checkbox') {
        for (const option of q.options) {
          await pool.query(createQuestionOptionSql, [questionId, option]);
        }
      }
    }
  } catch (err) {
    console.error(`Error in createQuestionQuery: ${err}`);
    throw err;
  }
};
