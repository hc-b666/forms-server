"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplateQuery = void 0;
exports.createTemplateQuery = `insert into "template" ("createdBy", "title", "description", "topic", "isPublic") values ($1, $2, $3, $4, $5) returning id;`;
