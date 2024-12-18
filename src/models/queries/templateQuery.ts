import pool from '../postgresDb';

const createTemplateSql = `
insert into template ("createdBy", title, description, topic, "isPublic")
values ($1, $2, $3, $4, $5)
returning id
`;

export const createTemplateQuery = async (userId: number, title: string, description: string, topic: string, isPublic: boolean) => {
  try {
    const { rows } = await pool.query(createTemplateSql, [userId, title, description, topic, isPublic]) as { rows: { id: number }[] };
    return rows[0].id;
  } catch (err) {
    console.error(`Error in createTemplateQuery: ${err}`);
    throw err;
  }
};

export const getTopTemplatesSql = `
select 
  t.id, 
  t.title, 
  t.description,
  t.topic, 
  t."createdAt", 
  u.email, 
  count(distinct f.id) as "responses", 
  count(distinct l."id") as "totalLikes",
  case 
    when $1::int is null then false
    else exists (
      select 1 
      from "like" l2
      where l2."templateId" = t.id and l2."userId" = $1::int
    )
  end as "hasLiked"
from template t
join "user" u on t."createdBy" = u.id
left join form f on t.id = f."templateId"
left join "like" l on l."templateId" = t.id
where t."isPublic" = true
group by t.id, u.email
order by count(distinct f.id) desc
limit 5
`;

export const getTopTemplatesQuery = async (userId: number | null) => {
  try {
    const { rows } = await pool.query(getTopTemplatesSql, [userId]) as { rows: ITopTemplate[] };
    return rows;
  } catch (err) {
    console.error(`Error in getTopTemplatesQuery: ${err}`);
    throw err;
  }
};

export const getLatestTemplatesSql = `
select 
  t.id, 
  t.title, 
  t.description, 
  t.topic, 
  t."createdAt", 
  u.email
from template t
join "user" u on t."createdBy" = u.id
where t."isPublic" = true
order by t."createdAt" desc
limit 10
`;

export const getLatestTemplatesQuery = async () => {
  try {
    const { rows } = await pool.query(getLatestTemplatesSql) as { rows: ILatestTemplate[] };
    return rows;
  } catch (err) {
    console.error(`Error in getLatestTemplatesQuery: ${err}`);
    throw err;
  }
};

const getTemplateByIdSql = `
select 
  t.id as "templateId", 
  t.title, 
  t.description, 
  t.topic, 
  t."createdAt", 
  u.id as "userId", 
  u.email 
from template t
join "user" u on t."createdBy" = u.id
where t.id = $1
`;

const getTemplateTagsSql = `
select ta."tagName"
from template t
join "templateTag" tt on t.id = tt."templateId"
join tag ta on tt."tagId" = ta.id
where t.id = $1
`;

const getTemplateQuestionsSql = `
select q.id, q.question, q.type
from template t
join question q on t.id = q."templateId"
where t.id = $1
`;

const getQuestionOptionsSql = `
select qo.id, qo.option
from "questionOption" qo
where qo."questionId" = $1
`;

const getTemplateCommentsSql = `
select c.id as "commentId", c.content, c."createdAt", u.id as "authorId", u.email
from template t
join comment c on t.id = c."templateId"
join "user" u on c."userId" = u.id
where t.id = $1
order by c."createdAt" desc
`;

export const getTemplateByIdQuery = async (templateId: number) => {
  try {
    const getTemplateRes = await pool.query(getTemplateByIdSql, [templateId]) as { rows: ISingleTemplate[] };
    if (getTemplateRes.rows.length === 0) {
      return null;
    }

    const template = getTemplateRes.rows[0];
    const getTagsRes = await pool.query(getTemplateTagsSql, [templateId]);
    template.tags = getTagsRes.rows.map(row => row.tagName);
    const getQuestionsRes = await pool.query(getTemplateQuestionsSql, [templateId]);
    template.questions = [];
    for (const question of getQuestionsRes.rows) {
      const getOptionsRes = await pool.query(getQuestionOptionsSql, [question.id]);
      question.options = getOptionsRes.rows;
      template.questions.push(question);
    }
    const getCommentsRes = await pool.query(getTemplateCommentsSql, [templateId]);
    template.comments = getCommentsRes.rows;
    
    return template;
  } catch (err) {
    console.error(`Error in getTemplateByIdQuery: ${err}`);
    throw err;
  }
};

const likeTemplateSql = `
insert into "like" ("userId", "templateId") 
values ($1, $2)
`;

const checkLikeTemplateSql = `
select count(*) 
from "like" 
where "userId" = $1 and "templateId" = $2
`;

export const likeTemplateQuery = async (userId: number, templateId: number) => {
  try {
    const res = await pool.query(checkLikeTemplateSql, [userId, templateId]);
    if (res.rows[0].count > 0) return;

    await pool.query(likeTemplateSql, [userId, templateId]);
  } catch (err) {
    console.error(`Error in likeTemplateQuery: ${err}`);
    throw err;
  }
};

const unlikeTemplateSql = `
delete 
from "like" 
where "userId" = $1 and "templateId" = $2
`;

export const unlikeTemplateQuery = async (userId: number, templateId: number) => {
  try {
    await pool.query(unlikeTemplateSql, [userId, templateId]);

  } catch (err) {
    console.error(`Error in unlikeTemplateQuery: ${err}`);
    throw err;
  }
};

const searchByTagSql = `
select
  t.id,
  t.title,
  t.description,
  t.topic,
  t."createdAt",
  u.email,
  count(distinct f.id) as "responses",
  count(distinct l."id") as "totalLikes",
  case 
    when $1::int is null then false
    else exists (
      select 1 
      from "like" l2
      where l2."templateId" = t.id and l2."userId" = $1::int
    )
  end as "hasLiked"
from template t
join "templateTag" tt on t.id = tt."templateId"
join tag ta on tt."tagId" = ta.id
where ta.id = $2
`;

export const searchByTagQuery = async (userId: number | null, tagId: number) => {
  try {
    const { rows } = await pool.query(searchByTagSql, [userId, tagId]);
    return rows;
  } catch (err) {
    console.error(`Error in searchByTagQuery: ${err}`);
    throw err;
  }
};
