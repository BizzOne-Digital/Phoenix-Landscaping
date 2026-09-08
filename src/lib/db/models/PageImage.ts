import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { imageRefSchema } from './shared';

/**
 * Page-level photography keyed by slot name (`hero`, `aboutHero`, ...).
 * Service, audience and season photos live on their own documents.
 */
const pageImageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    label: { type: String, default: '' },
    image: { type: imageRefSchema, default: () => ({ src: '', alt: '' }) },
  },
  { timestamps: true, collection: 'page_images' },
);

export type PageImageDoc = InferSchemaType<typeof pageImageSchema>;

export const PageImage: Model<PageImageDoc> =
  (models.PageImage as Model<PageImageDoc>) ?? model<PageImageDoc>('PageImage', pageImageSchema);
