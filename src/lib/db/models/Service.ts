import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { imageRefSchema, orderField } from './shared';

/** Mirrors the `Service` type consumed by the public site. */
const serviceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: '' },
    longDescription: { type: String, default: '' },
    benefits: { type: [String], default: [] },
    suitableFor: { type: [String], default: [] },
    icon: { type: String, default: 'Sprout' },
    image: { type: imageRefSchema, default: () => ({ src: '', alt: '' }) },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'services' },
);

export type ServiceDoc = InferSchemaType<typeof serviceSchema>;

export const Service: Model<ServiceDoc> =
  (models.Service as Model<ServiceDoc>) ?? model<ServiceDoc>('Service', serviceSchema);
