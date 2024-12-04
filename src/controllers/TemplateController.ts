import { RequestHandler } from 'express';
import { Schema } from 'mongoose';

import TemplateModel, { Topic } from '../models/TemplateModel';
import QuestionModel, { QuestionType } from '../models/QuestionModel';
import LikeModel from '../models/LikeModel';

interface ICreateTemplateBody {
  title: string;
  description: string;
  createdBy: Schema.Types.ObjectId;
  topic: Topic;
  type: string;
  questions: {
    question: string;
    type: QuestionType;
    options: string[];
  }[];
}

// ToDo - Optimize
export const createTemplate: RequestHandler<unknown, unknown, ICreateTemplateBody, unknown> = async (req, res) => {
  try {
    const { title, description, createdBy, topic, type, questions } = req.body;

    if (!title || !description || !createdBy || !topic || !type || questions.length === 0) {
      res.status(400).json({ message: 'All inputs are required for creating the template' });
      return;
    }

    const newTemplate = new TemplateModel({
      title,
      description,
      createdBy,
      topic: topic.toLowerCase(),
      isPublic: type === 'public' ? true : false,
    });

    await newTemplate.save();

    const createQuestions = async () => {
      await Promise.all(
        questions.map(async (q) => {
          const newQuestion = new QuestionModel({
            templateId: newTemplate._id,
            question: q.question,
            type: q.type,
            options: q.options,
          });
    
          await newQuestion.save();
        })
      );
    };

    createQuestions();

    res.status(200).json({ message: 'Successfully created template' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const getTop5Templates: RequestHandler = async (req, res) => {
  try {
    const topTemplates = await LikeModel.aggregate([
      { $group: { _id: '$templateId', likeCount: { $sum: 0 } } },
      { $sort: { likeCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'templates', localField: 'templateId', foreignField: '_id', as: 'template' } },
      { $unwind: '$template' },
      { $project: { _id: 0, template: 1, likeCount: 1 }}
    ]);

    res.status(200).json({ topTemplates });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const likeTemplate: RequestHandler = async (req, res) => {
  try {
    const { userId, templateId } = req.body;
    if (!userId || !templateId) {
      res.status(400).json({ message: 'User ID and Template ID are required' });
      return;
    }

    const existingLike = await LikeModel.findOne({ userId, templateId });
    if (existingLike) return;

    const newLike = new LikeModel({ userId, templateId });
    await newLike.save();

    res.status(200).json({ message: 'Template liked successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const latestTemplates: RequestHandler = async (req, res) => {
  try {
    const latestTemplates = await TemplateModel.aggregate([
      { $match: { isPublic: true } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'author' } },
      { $unwind: '$author' },
      { $project: { _id: 0, title: 1, description: 1, topic: 1, created: 1, 'author.firstName': 1, 'author.lastName': 1,'author.email': 1 } },
    ]);

    res.status(200).json(latestTemplates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
