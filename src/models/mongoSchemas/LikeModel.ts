import { Schema, model } from 'mongoose';

const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // FK
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
});

export default model('Like', LikeSchema);
