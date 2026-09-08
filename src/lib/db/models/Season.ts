import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { imageRefSchema, orderField } from './shared';

const seasonSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    headline: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Sun' },
    image: { type: imageRefSchema, default: () => ({ src: '', alt: '' }) },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'seasons' },
);

export type SeasonDoc = InferSchemaType<typeof seasonSchema>;

export const Season: Model<SeasonDoc> =
  (models.Season as Model<SeasonDoc>) ?? model<SeasonDoc>('Season', seasonSchema);
