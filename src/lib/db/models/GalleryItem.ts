import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { orderField } from './shared';

/**
 * Job-photo gallery managed from the admin dashboard.
 *
 * Only the URL is stored here — the binary lives in `StoredUpload` and is
 * served from `/api/uploads/gallery/{filename}`.
 */
const galleryItemSchema = new Schema(
  {
    title: { type: String, default: '' },
    image: { type: String, default: '' },
    alt: { type: String, default: '' },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'gallery_items' },
);

export type GalleryItemDoc = InferSchemaType<typeof galleryItemSchema>;

export const GalleryItem: Model<GalleryItemDoc> =
  (models.GalleryItem as Model<GalleryItemDoc>) ??
  model<GalleryItemDoc>('GalleryItem', galleryItemSchema);
