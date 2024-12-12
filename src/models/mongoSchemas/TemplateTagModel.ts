import { Schema, model } from 'mongoose';

const TemplateTagSchema = new Schema({
  tagId: { type: Schema.Types.ObjectId, ref: 'Tag', required: true }, // FK
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
});

export default model('TemplateTag', TemplateTagSchema);
