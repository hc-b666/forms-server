
import { Schema, model } from 'mongoose';

const TestSchema = new Schema({
  name: { type: String, required: true },
});

export default model('Test', TestSchema);

