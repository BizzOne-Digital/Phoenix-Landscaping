import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { orderField } from './shared';

/** "Why Phoenix" grid, shown on the home and about pages. */
const whyChooseItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'Award' },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'why_choose_items' },
);

export type WhyChooseItemDoc = InferSchemaType<typeof whyChooseItemSchema>;

export const WhyChooseItem: Model<WhyChooseItemDoc> =
  (models.WhyChooseItem as Model<WhyChooseItemDoc>) ??
  model<WhyChooseItemDoc>('WhyChooseItem', whyChooseItemSchema);
