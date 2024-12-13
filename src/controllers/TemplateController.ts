import { RequestHandler } from 'express';

import pool from '../models/postgresDb';
import { 
  createTemplateQuery, 
  getLatestTemplatesQuery, 
  getTemplateByIdQuery, 
  likeTemplateQuery, 
  unlikeTemplateQuery, 
  getProfileTemplatesQuery,
  getTopTemplatesQuery
} from "../models/queries/templateQuery";
import { createQuestionsQuery } from '../models/queries/questionQuery';
import { createTagsQuery } from '../models/queries/tagQuery';
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

    const templateId = await createTemplateQuery(userId, title, description, topic, type === 'public' ? true : false);

    await createQuestionsQuery({ templateId, questions }); 

    await createTagsQuery({ templateId, tags });

    res.status(200).json({ message: 'Successfully created template' });
  } catch (err) {
    console.log(`Error in createTemplate: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getTopTemplates: RequestHandler = async (req, res) => {
  try {
    const userId = req.userId;

    const templates = await getTopTemplatesQuery(userId ? userId : null);
    res.status(200).json(templates);
  } catch (err) {
    console.log(`Error in getTopTemplates: ${err}`);
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
    console.log(`Error in getTemplateById: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const templates = await getProfileTemplatesQuery(parseInt(userId));
    const user = await getUserByIdQuery(parseInt(userId));

    res.status(200).json({ templates, user });
  } catch (err) {
    console.log(`Error in getProfile: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const likeTemplate: RequestHandler = async (req, res) => {
  try {
    const { templateId } = req.params;
    if (!templateId) {
      res.status(400).json({ message: 'Template ID is required' });
      return;
    }

    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    await likeTemplateQuery(userId, parseInt(templateId));

    res.status(200).json({ message: 'Successfully liked template' });
  } catch (err) {
    console.log(`Error in likeTemplate: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const unlikeTemplate: RequestHandler = async (req, res) => {
  try {
    const { templateId } = req.params;
    if (!templateId) {
      res.status(400).json({ message: 'Template ID is required' });
      return;
    }

    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    await unlikeTemplateQuery(userId, parseInt(templateId));

    res.status(200).json({ message: 'Successfully unliked template' });
  } catch (err) {
    console.log(`Error in unlikeTemplate: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};
