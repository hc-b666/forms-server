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

const getFormSql = `
select 
  r.id as "responseId",
  r."questionId",
  r.answer,
  r."optionId",
  
  q.question,
  q.type as "questionType",
  
  qo.id as "questionOptionId",
  qo.option as "questionOptionText"

from response r
join question q on r."questionId" = q.id
left join "questionOption" qo on r."optionId" = qo.id
where r."formId" = $1
`;

// const getFormSql = `
// with checkbox_responses as (
//   select 
//     r."questionId",
//     jsonb_build_object('optionId', qo.id, 'option', qo.option) as "selectedOptions"
//   from response r
//   join question q on r."questionId" = q.id
//   join "questionOption" qo on r."optionId" = qo.id
//   where r."formId" = $1 and q.type = 'checkbox'
//   group by r."questionId", qo.id
// ),
// all_responses as (
//   select
//     r.id as "responseId",
//     r."questionId",
//     r.answer,
//     r."optionId",

//     q.id as "questionId",
//     q.question,
//     q.type as "questionType",

//     qo.id as "questionOptionId",
//     qo.option as "questionOptionText"

//   from response r
//   join question q on r."questionId" = q.id
//   left join "questionOption" qo on r."optionId" = qo.id
//   where r."formId" = $1
// )

// select ar.*, coalesce(cr."selectedOptions", '[]'::jsonb) as "selectedOptions"
// from all_responses ar
// left join checkbox_responses cr on ar."questionId" = cr."questionId"
// order by ar."questionId"
// `;

export const getFormQuery = async (formId: number) => {
  try {
    const { rows } = await pool.query(getFormSql, [formId]) as { rows: IResponse[] };
    const responses: any = [];
    rows.forEach((response) => {
      const responseIndex = responses.findIndex((r: any) => r.questionId === response.questionId);
      if (responseIndex === -1) {
        responses.push({
          questionId: response.questionId,
          question: response.question,
          questionType: response.questionType,
          selectedOptions: response.questionType === 'checkbox' ? [] : null,
          responseId: response.responseId,
          answer: response.answer,
          options: response.questionType === 'checkbox' ? [] : null,
        });
      } else {
        if (response.questionType === 'checkbox') {
          responses[responseIndex].selectedOptions.push({
            optionId: response.questionOptionId,
            option: response.questionOptionText,
          });
        } else {
          responses[responseIndex].answer = response.answer;
        }
      }
    });
    
    return { rows, responses };
  } catch (err) {
    console.error(`Error in getFormQuery: ${err}`);
    throw err;
  }
};

const getFormsSql = `
select
  f.id as "formId",
  f."filledBy",
  u.email,
  f."filledAt"
from form f
join template t on f."templateId" = t.id
join "user" u on f."filledBy" = u.id
where f."templateId" = $1
order by f."filledAt" desc
`;
export const getFormsQuery = async(templateId: number) => {
  try {
    const { rows } = await pool.query(getFormsSql, [templateId]);
    return rows;
  } catch (err) {
    console.error(`Error in getFormsQuery: ${err}`);
    throw err;
  }
};
