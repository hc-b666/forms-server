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
    t.topic, 
    t."createdAt", 
    u.email, 
    count(f.id) as "responses", 
    array_agg(ta."tagName") as tags,
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
join "templateTag" tt on t.id = tt."templateId"
join tag ta on tt."tagId" = ta.id
left join "like" l on l."templateId" = t.id
where t."isPublic" = true
group by t.id, t.title, t.topic, t."createdAt", u."email"
order by count(f.id) desc
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

export const getLatestTemplatesQuery = `
select t.id, t.title, t.topic, t."createdAt", u.email, array_agg(ta."tagName") as tags
from "template" t
join "user" u on t."createdBy" = u.id
join "templateTag" tt on t.id = tt."templateId"
join tag ta on tt."tagId" = ta.id
where t."isPublic" = true
group by t.id, t.title, t.topic, t."createdAt", u.email
order by t."createdAt" desc
limit 10
`;

const getTemplateByIdSql = `
select t.id as "templateId", t.title, t.description, t.topic, t."createdAt", u.id as "userId", u.email 
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
`;

export const getTemplateByIdQuery = async (templateId: number) => {
  try {
    const getTemplateRes = await pool.query(getTemplateByIdSql, [templateId]) as { rows: ISingleTemplate[] };
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

const getProfileTemplatesSql = `
with templatedata as (
  select 
    t.id, 
    t.title, 
    t.topic, 
    t."createdAt",
    array_agg(distinct ta."tagName") as tags,
    count(distinct f.id) as "responses"
  from template t
  join "user" u ON t."createdBy" = u.id
  left join form f on t.id = f."templateId"
  left join "templateTag" tt on t.id = tt."templateId"
  left join tag ta on tt."tagId" = ta.id
  where t."createdBy" = $1
  group by t.id, t.title, t.topic, t."createdAt"
)
select * from templatedata
order by "createdAt" desc
`;

export const getProfileTemplatesQuery = async (userId: number) => {
  try {
    const { rows } = await pool.query(getProfileTemplatesSql, [userId]) as { rows: IProfileTemplate[] };
    return rows;
  } catch (err) {
    console.error(`Error in getProfileQuery: ${err}`);
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
