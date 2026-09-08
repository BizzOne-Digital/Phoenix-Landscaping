import { Schema, type Model } from 'mongoose';

/** Matches the `SiteImage` shape the public components already expect. */
export type ImageRefDoc = {
  src: string;
  alt: string;
};

export const imageRefSchema = new Schema<ImageRefDoc>(
  {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
  },
  { _id: false },
);

/** Every ordered CMS list uses the same sort key. */
export const orderField = { type: Number, default: 0, index: true } as const;

/**
 * A content model of unspecified shape.
 *
 * Mongoose generates a distinct document type per schema, and the shared CRUD
 * factory plus the seed helper are deliberately shape-agnostic: each caller
 * supplies its own validation schema, which is what actually constrains the
 * data. `any` here is the escape hatch that lets one implementation serve
 * every model rather than duplicating it a dozen times.
 */
// eslint-disable-next-line -- see note above
export type AnyContentModel = Model<any>;
