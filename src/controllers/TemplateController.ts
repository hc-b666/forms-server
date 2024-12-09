import { RequestHandler } from 'express';

import pool from '../models/postgresDb';
import { createTemplateQuery, getTop5Query, getLatestTemplatesQuery, getTemplateByIdQuery, getTemplatesForUserQuery } from "../models/queries/templateQuery";
import { createQuestionQuery } from '../models/queries/questionQuery';
import { createTagQuery, createTemplateTagQuery, findTagQuery } from '../models/queries/tagQuery';
import { getUserByIdQuery } from '../models/queries/userQuery';

interface ICreateTemplateBody {
  title: string;
  description: string;
  createdBy: number;
  topic: TemplateTopic;
  type: string;
  questions: {
    question: string;
    type: QuestionType;
    options: string[];
  }[];
  tags: string[];
}

export const createTemplate: RequestHandler<unknown, unknown, ICreateTemplateBody, unknown> = async (req, res) => {
  try {
    const { title, description, createdBy, topic, type, questions, tags } = req.body;
    if (!title || !description || !createdBy || !topic || questions.length === 0) {
      res.status(400).json({ message: 'All inputs are required for creating the template' });
      return;
    }

    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const templateRest = await pool.query(createTemplateQuery, [userId, title, description, topic, type === 'public' ? true : false]);
    const templateId = templateRest.rows[0].id as number;

    for (const q of questions) {
      await pool.query(createQuestionQuery, [templateId, q.question, q.type, q.options]);
    }

    for (const tag of tags) {
      let tagRes = await pool.query(findTagQuery, [tag]);
      let tagId: number;

      if (tagRes.rows.length === 0) {
        tagRes = await pool.query(createTagQuery, [tag]);
        tagId = tagRes.rows[0].id;
      } else {
        tagId = tagRes.rows[0].id;
      }

      await pool.query(createTemplateTagQuery, [templateId, tagId]);
    }

    res.status(200).json({ message: 'Successfully created template' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getTop5Templates: RequestHandler = async (req, res) => {
  try {
    const templates = await pool.query(getTop5Query);
    res.status(200).json(templates.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getLatestTemplates: RequestHandler = async (req, res) => {
  try {
    const templates = await pool.query(getLatestTemplatesQuery);
    res.status(200).json(templates.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

interface IGetTemplateByIdParams {
  id: number;
}

export const getTemplateById: RequestHandler<IGetTemplateByIdParams> = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await pool.query(getTemplateByIdQuery, [id]);

    res.status(200).json(template.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getTemplatesForUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const templates = await pool.query(getTemplatesForUserQuery, [parseInt(userId)]);
    const user = await pool.query(getUserByIdQuery, [parseInt(userId)]);
    res.status(200).json({ templates: templates.rows, user: user.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};
