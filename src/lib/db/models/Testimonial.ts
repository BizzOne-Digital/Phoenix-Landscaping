import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
import { orderField } from './shared';

/** Real client testimonials only — see src/lib/testimonials.ts. */
const testimonialSchema = new Schema(
  {
    quote: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    role: { type: String, default: '' },
    location: { type: String, default: '' },
    service: { type: String, default: '' },
    order: orderField,
    published: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'testimonials' },
);

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema>;

export const Testimonial: Model<TestimonialDoc> =
  (models.Testimonial as Model<TestimonialDoc>) ??
  model<TestimonialDoc>('Testimonial', testimonialSchema);
