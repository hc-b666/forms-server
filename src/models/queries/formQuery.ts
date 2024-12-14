import pool from "../postgresDb";

const createFormSql = `
insert into form ("filledBy", "templateId") 
values ($1, $2)
returning id
`;

const createResponseSql = `
insert into response ("formId", "questionId", answer, "optionId")
values ($1, $2, $3, $4)
`;

interface ICreateFormQuery {
  filledBy: number;
  templateId: number;
  responses: {
    questionId: number;
    answer: string | number | number[];
  }[];
}
export const createFormQuery = async ({ filledBy, templateId, responses }: ICreateFormQuery) => {
  try {
    const { rows } = await pool.query(createFormSql, [filledBy, templateId]);
    const formId = rows[0].id;

    for (const response of responses) {  
      if (typeof response.answer === "string") {
        await pool.query(createResponseSql, [formId, response.questionId, response.answer, null]);
      } else if (typeof response.answer === "number") {
        await pool.query(createResponseSql, [formId, response.questionId, null, response.answer]);
      } else {
        for (const optionId of response.answer) {
          await pool.query(createResponseSql, [formId, response.questionId, null, optionId]);
        }
      }
    }

  } catch (err) {
    console.error(`Error in createFormQuery: ${err}`);
    throw err;
  }
};

const hasUserSubmittedFormSql = `
select exists (
  select 1
  from form
  where "filledBy" = $1 and "templateId" = $2
)
`;
export const hasUserSubmittedFormQuery = async (filledBy: number, templateId: number) => {
  try {
    const { rows } = await pool.query(hasUserSubmittedFormSql, [filledBy, templateId]);
    return rows[0].exists;
  } catch (err) {
    console.error(`Error in hasUserSubmittedFormQuery: ${err}`);
    throw err;
  }
};

const checkIfUserIsAuthorOfTemplateSql = `
select exists (
  select 1 
  from template 
  where id = $1 and "createdBy" = $2
) as is_author
`;
export const checkIfUserIsAuthorOfTemplateQuery = async (templateId: number, userId: number) => {
  try {
    const { rows } = await pool.query(checkIfUserIsAuthorOfTemplateSql, [templateId, userId]);
    return rows[0].is_author;
  } catch (err) {
    console.error(`Error in checkIfUserIsAuthorOfTemplateQuery: ${err}`);
    throw err;
  }
};

const getFormsSql = `
select 
  f.id as "formId", 
  f."filledBy", 
  f."filledAt", 
  t.title as "templateTitle",
  (select json_agg(
    json_build_object(
      'questionId', q.id,
      'question', q.question,
      'answer', r.answer,
      'optionId', r."optionId",
      'option', qo.option,
      'questionType', q.type
    )
  )
  from response r
  join question q on r."questionId" = q.id
  left join "questionOption" qo on r."optionId" = qo.id
  where r."formId" = f.id
  ) as responses
from form f
join template t on f."templateId" = t.id
where f."templateId" = $1
order by f.id
`;
export const getFormsQuery = async (templateId: number) => {
  try {
    const { rows } = await pool.query(getFormsSql, [templateId]);
    return rows;
  } catch (err) {
    console.error(`Error in getFormsQuery: ${err}`);
    throw err;
  }
};
