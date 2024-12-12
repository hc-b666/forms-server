import { Schema, model } from 'mongoose';

const ResponseSchema = new Schema({
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true }, // FK
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true }, // FK
  answer: { type: String, required: true },
});

export default model('Response', ResponseSchema);
