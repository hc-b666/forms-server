"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestionQuery = void 0;
exports.createQuestionQuery = `insert into "question" ("templateId", "question", "type", "options") values ($1, $2, $3, $4);`;
