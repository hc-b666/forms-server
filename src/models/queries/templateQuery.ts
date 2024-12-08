export const createTemplateQuery = `
insert into "template" ("createdBy", "title", "description", "topic", "isPublic") 
values ($1, $2, $3, $4, $5) 
returning id
`;

export const getTop5Query = `
select t.id, t.title, t.topic, t."createdAt", u."email", count(f.id) as "formsCount", array_agg(ta."tagName") as tags
from "template" t
join "user" u on t."createdBy" = u.id
left join "form" f on t.id = f."templateId"
join "templateTag" tt on t.id = tt."templateId"
join "tag" ta on tt."tagId" = ta.id
where t."isPublic" = true
group by t.id, t.title, t.description, t.topic, t."isPublic", t."createdAt", u."firstName", u."lastName", u."email"
order by count(f.id) desc
limit 5
`;

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
select t.id, 
       t.title, 
       t.description, 
       t.topic, 
       t."isPublic", 
       t."createdAt", 
       u."firstName", 
       u."lastName", 
       u."email", 
       array_agg(distinct ta."tagName") as tags, 
       array_agg(distinct jsonb_build_object('id', c.id, 
                                             'content', c.content, 
                                             'createdAt', c."createdAt", 
                                             'user', jsonb_build_object('id', u2.id, 
                                                                        'firstName', u2."firstName", 
                                                                        'lastName', u2."lastName", 
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
group by t.id, t.title, t.description, t.topic, t."isPublic", t."createdAt", u."firstName", u."lastName", u."email"
`;
