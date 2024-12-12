import { Schema, model } from 'mongoose';

export enum QuestionType {
  SHORT = 'short',
  PARAGRAPH = 'paragraph',
  MCQ = 'mcq',
  CHECKBOX = 'checkbox',
}

const QuestionSchema = new Schema({
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
  question: { type: String, required: true },
  type: { type: String, enum: Object.values(QuestionType), required: true },
  options: { type: [String], required: true },
});

const QuestionModel = model('Question', QuestionSchema);

export default QuestionModel;

interface ICreateQuestion {
  templateId: Schema.Types.ObjectId;
  question: string;
  type: QuestionType;
  options: string[];
}

export const createQuestion = async ({ templateId, question, type, options }: ICreateQuestion) => {
  const newQ = new QuestionModel({
    templateId,
    question,
    type,
    options,
  });

  await newQ.save();
};

interface ICreateQuestions {
  templateId: Schema.Types.ObjectId;
  questions: {
    question: string;
    type: QuestionType;
    options: string[];
  }[];
}

export const createQuestions = ({ questions, templateId }: ICreateQuestions) => {
  questions.forEach((q) => createQuestion({ templateId, ...q }));
};
