import pool from '../postgresDb';

export const createTemplateQuery = `
insert into "template" ("createdBy", "title", "description", "topic", "isPublic") 
values ($1, $2, $3, $4, $5) 
returning id
`;

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
from "template" t
join "user" u on t."createdBy" = u.id
left join "form" f on t.id = f."templateId"
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
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
select t.id, t.title, t.topic, t."createdAt", u."email", array_agg(ta."tagName") as tags
from "template" t
join "user" u on t."createdBy" = u.id
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
where t."isPublic" = true
group by t.id, t.title, t.description, t.topic, t."isPublic", t."createdAt", u."firstName", u."lastName", u."email"
order by t."createdAt" desc
limit 10
`;

export const getTemplateByIdQuery = `
select t.id as "templateId", 
       t.title, 
       t.description, 
       t.topic, 
       t."createdAt",
       u."email",
       u."id" as "userId",
       array_agg(distinct ta."tagName") as tags, 
       array_agg(distinct jsonb_build_object('id', c.id, 
                                             'content', c.content, 
                                             'createdAt', c."createdAt", 
                                             'user', jsonb_build_object('id', u2.id, 
                                                                        'email', u2.email)) 
                 ) FILTER (WHERE c.id IS NOT NULL) as comments,
       array_agg(distinct jsonb_build_object('id', q.id, 'question', q.question, 'type', q.type, 'options', q.options)) as questions
from "template" t
join "user" u on t."createdBy" = u.id
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
left join "comment" c on t.id = c."templateId"
left join "user" u2 on c."userId" = u2.id
left join "question" q on t.id = q."templateId"
where t.id = $1
group by t.id, t.title, t.description, t.topic, t."isPublic", t."createdAt", u."firstName", u."lastName", u."email", u."id"
`;

const getProfileTemplatesSql = `
select t.id as "templateId", t.title, t.topic, t."createdAt", array_agg(distinct ta."tagName") as tags, count(f.id) as "responses"
from "template" t
join "user" u on t."createdBy" = u.id
left join "form" f on t.id = f."templateId"
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
where t."createdBy" = $1
group by t.id, t.title, t.topic, t."createdAt"
order by t."createdAt" desc
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

const likeTemplateSql = `insert into "like" ("userId", "templateId") values ($1, $2)`;
const checkLikeTemplateSql = `select count(*) from "like" where "userId" = $1 and "templateId" = $2`;
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

const unlikeTemplateSql = `delete from "like" where "userId" = $1 and "templateId" = $2`;
export const unlikeTemplateQuery = async (userId: number, templateId: number) => {
  try {
    await pool.query(unlikeTemplateSql, [userId, templateId]);

  } catch (err) {
    console.error(`Error in unlikeTemplateQuery: ${err}`);
    throw err;
  }
};
