import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // FK
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Comment', CommentSchema);
