import { Schema, model } from 'mongoose';

const FormSchema = new Schema({
  filledBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // FK
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
  filledAt: { type: Date, default: Date.now },
});

export default model('Form', FormSchema);
