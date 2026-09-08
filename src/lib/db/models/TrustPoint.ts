import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { orderField } from './shared';

/** "Why Clients Stay" cards (home page and testimonials page). */
const trustPointSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Award' },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'trust_points' },
);

export type TrustPointDoc = InferSchemaType<typeof trustPointSchema>;

export const TrustPoint: Model<TrustPointDoc> =
  (models.TrustPoint as Model<TrustPointDoc>) ??
  model<TrustPointDoc>('TrustPoint', trustPointSchema);
