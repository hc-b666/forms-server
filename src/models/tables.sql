drop table if exists "response", "form", "question", "questionOption", "template", "user", "accessControl", "like", "comment", "tag", "templateTag" cascade;

create table "user" (
  "id" serial primary key,
  "firstName" varchar(255) not null,
  "lastName" varchar(255) not null,
  "username" varchar(50) unique not null,
  "email" varchar(100) unique not null,
  "passwordHash" varchar(255) not null,
  "role" varchar(10) check ("role" in ('user', 'admin')) not null,
  "isBlocked" boolean default false not null,
  "createdAt" timestamp with time zone default current_timestamp not null
);

create table "template" (
  "id" serial primary key,
  "createdBy" int not null references "user"(id),
  "title" varchar(255) not null,
  "description" text not null,
  "createdAt" timestamp with time zone default current_timestamp not null,
  "topic" varchar(50) check ("topic" in ('edu', 'quiz', 'other')) not null,
  "isPublic" boolean default false not null
);

create table "question" (
  "id" serial primary key,
  "templateId" int not null references "template"(id),
  "question" text not null,
  "type" varchar(50) check ("type" in ('short', 'paragraph', 'mcq', 'checkbox')) not null
);

create table "questionOption" (
  "id" serial primary key,
  "questionId" int not null references "question"(id),
  "option" text not null
);

create table "form" (
  "id" serial primary key,
  "filledBy" int not null references "user"(id),
  "templateId" int not null references "template"(id),
  "filledAt" timestamp with time zone default current_timestamp not null
);

create table "response" (
  "id" serial primary key,
  "formId" int not null references "form"(id),
  "questionId" int not null references "question"(id),
  "answer" text,
  "optionId" int references "questionOption"(id)
);

create table "accessControl" (
  "id" serial primary key,
  "templateId" int not null references "template"(id),
  "userId" int not null references "user"(id)
);

create table "comment" (
  "id" serial primary key,
  "userId" int not null references "user"(id),
  "templateId" int not null references "template"(id),
  "content" text not null,
  "createdAt" timestamp with time zone default current_timestamp not null
);

create table "like" (
  "id" serial primary key,
  "userId" int not null references "user"(id),
  "templateId" int not null references "template"(id)
);

create table "tag" (
  "id" serial primary key,
  "tagName" varchar(255) not null
);

create table "templateTag" (
  "id" serial primary key,
  "tagId" int not null references "tag"(id),
  "templateId" int not null references "template"(id)
);
