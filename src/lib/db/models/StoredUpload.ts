import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';

/**
 * Uploaded image binaries live in MongoDB, not on disk.
 *
 * Serverless filesystems are ephemeral and read-only in production, so
 * anything written to `public/uploads` disappears on the next deployment.
 * Storing the bytes here means `/api/uploads/{folder}/{filename}` keeps
 * resolving across redeploys, cold starts and multiple instances.
 */
const storedUploadSchema = new Schema(
  {
    folder: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true, collection: 'stored_uploads' },
);

storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDoc = InferSchemaType<typeof storedUploadSchema>;

export const StoredUpload: Model<StoredUploadDoc> =
  (models.StoredUpload as Model<StoredUploadDoc>) ??
  model<StoredUploadDoc>('StoredUpload', storedUploadSchema);
