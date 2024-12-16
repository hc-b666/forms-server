import { RequestHandler } from 'express';

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
import { 
  createFormQuery, 
  getFormQuery, 
  getFormsQuery, 
  hasUserSubmittedFormQuery 
} from '../models/queries/formQuery';

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
    const templates = await getLatestTemplatesQuery();
    res.status(200).json(templates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

interface IGetTemplateByIdParams {
  templateId: number;
}
export const getTemplateById: RequestHandler<IGetTemplateByIdParams> = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    const template = await getTemplateByIdQuery(templateId);

    res.status(200).json(template);
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

interface ICreateFormParams {
  templateId?: number;
}
interface ICreateFormBody {
  responses: {
    questionId: number;
    answer: string | number | number[];
  }[];
}
export const createForm: RequestHandler<ICreateFormParams, unknown, ICreateFormBody, unknown> = async (req, res) => {
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
    
    const { responses } = req.body;
    if (!responses || responses.length === 0) {
      res.status(400).json({ message: 'Responses are required' });
      return;
    }

    await createFormQuery({ filledBy: userId, templateId: templateId, responses });

    res.status(200).json({ message: 'Successfully submitted!' });
  } catch (err) {
    console.log(`Error in createForm: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const hasUserSubmittedForm: RequestHandler = async (req, res) => {
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

    const hasSubmitted = await hasUserSubmittedFormQuery(userId, parseInt(templateId));

    res.status(200).json({ hasSubmitted });
  } catch (err) {
    console.log(`Error in hasUserSubmittedForm: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getForms: RequestHandler = async (req, res) => {
  try {
    const templateId = req.templateId;
    if (!templateId) {
      res.status(400).json({ message: 'Template ID is required' });
      return;
    }

    const template = await getTemplateByIdQuery(templateId);
    const forms = await getFormsQuery(templateId);

    res.status(200).json({ forms, template });
  } catch (err) {
    console.log(`Error in getForms: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getForm: RequestHandler = async (req, res) => {
  try {
    const { formId } = req.params;
    if (!formId) {
      res.status(400).json({ message: 'Form ID is required' });
      return;
    }

    const responses = await getFormQuery(parseInt(formId));

    res.status(200).json(responses);
  } catch (err) {
    console.log(`Error in getForm: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};
