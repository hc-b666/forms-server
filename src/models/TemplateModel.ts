import { Schema, model } from 'mongoose';

export enum Topic {
  EDUCATION = 'education',
  QUIZ = 'quiz',
  OTHER = 'other',
}

const TemplateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // FK
  topic: { type: String, enum: Object.values(Topic), required: true },
  isPublic: { type: Boolean, required: true },
});

export default model('Template', TemplateSchema);
