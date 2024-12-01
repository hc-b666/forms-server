import { Schema, model } from 'mongoose';

const TagSchema = new Schema({
  name: { type: String, required: true },
});

export default model('Tag', TagSchema);
