import { Schema, model } from 'mongoose';

enum QuestionType {
  SHORT = 'short',
  PARAGRAPH = 'paragraph',
  MCQ = 'mcq',
  CHECKBOX = 'checkbox',
}

const QuestionSchema = new Schema({
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
  question: { type: String, required: true },
  type: { type: String, enum: Object.values(QuestionType), required: true },
  options: { type: [String], required: false },
});

export default model('Question', QuestionSchema);
