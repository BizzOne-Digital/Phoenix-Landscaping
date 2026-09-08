import mongoose from 'mongoose';

/**
 * Cached Mongoose connection.
 *
 * Serverless platforms (Vercel) re-use the same Node process across
 * invocations but re-evaluate modules, so the connection is parked on
 * `globalThis` to avoid opening a new pool on every request.
 */

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  __phoenixMongoose?: MongooseCache;
};

const cached: MongooseCache =
  globalForMongoose.__phoenixMongoose ?? { conn: null, promise: null };

globalForMongoose.__phoenixMongoose = cached;

/** True when the app has been given a connection string. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB_NAME || undefined,
        // Fail fast instead of hanging a request (or a build) for 30s.
        serverSelectionTimeoutMS: 10_000,
        maxPoolSize: 10,
      })
      .catch((error) => {
        // Clear the promise so the next request can retry.
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
