import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { imageRefSchema, orderField } from './shared';

/** Hero collage tiles — one photo per service pillar. */
const heroShowcaseItemSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    image: { type: imageRefSchema, default: () => ({ src: '', alt: '' }) },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'hero_showcase_items' },
);

export type HeroShowcaseItemDoc = InferSchemaType<typeof heroShowcaseItemSchema>;

export const HeroShowcaseItem: Model<HeroShowcaseItemDoc> =
  (models.HeroShowcaseItem as Model<HeroShowcaseItemDoc>) ??
  model<HeroShowcaseItemDoc>('HeroShowcaseItem', heroShowcaseItemSchema);
