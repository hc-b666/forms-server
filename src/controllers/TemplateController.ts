import { RequestHandler } from 'express';
import { Schema } from 'mongoose';

import TemplateModel, { Topic } from '../models/TemplateModel';
import QuestionModel, { QuestionType } from '../models/QuestionModel';

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
    console.log("created", req.body);
    res.status(200).json({ message: 'Successfully created template' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};
