import pool from "../postgresDb";

const createQuestionSql = `
insert into question ("templateId", question, type, options)
values ($1, $2, $3, $4)
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
      await pool.query(createQuestionSql, [templateId, q.question, q.type, q.options]);
    }
  } catch (err) {
    console.error(`Error in createQuestionQuery: ${err}`);
    throw err;
  }
};
