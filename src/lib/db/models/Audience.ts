import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { imageRefSchema, orderField } from './shared';

const audienceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Home' },
    image: { type: imageRefSchema, default: () => ({ src: '', alt: '' }) },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'audiences' },
);

export type AudienceDoc = InferSchemaType<typeof audienceSchema>;

export const Audience: Model<AudienceDoc> =
  (models.Audience as Model<AudienceDoc>) ?? model<AudienceDoc>('Audience', audienceSchema);
