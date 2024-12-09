export const createQuestionQuery = `
insert into "question" ("templateId", "question", "type", "options") 
values ($1, $2, $3, $4)
`;
