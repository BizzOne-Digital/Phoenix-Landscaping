/** The only folders an upload may be filed under. */
export const UPLOAD_FOLDERS = ['products', 'gallery', 'pages', 'misc'] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** 8 MB. */
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Allow-list keyed by MIME type — the browser-reported extension is ignored. */
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** Public prefix for images whose binary lives in MongoDB. */
export const MANAGED_UPLOAD_PREFIX = '/api/uploads/';

/** Legacy prefix from an older filesystem-based upload scheme. */
export const LEGACY_UPLOAD_PREFIX = '/uploads/';

/** Shown in place of an image whose file no longer exists. */
export const IMAGE_PLACEHOLDER = '/images/placeholder.png';

export function isUploadFolder(value: unknown): value is UploadFolder {
  return typeof value === 'string' && (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function isAllowedImageType(mimeType: string): boolean {
  return Object.prototype.hasOwnProperty.call(ALLOWED_IMAGE_TYPES, mimeType);
}

/**
 * Accepts only the exact shape `generateFilename` produces plus a small
 * amount of slack, and rejects traversal (`..`), separators and anything
 * that is not a plain image filename.
 */
export function isSafeFilename(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value.length === 0 || value.length > 200) return false;
  if (value.includes('..') || value.includes('/') || value.includes('\\')) return false;
  if (value.includes('\0')) return false;
  return /^[A-Za-z0-9._-]+$/.test(value) && !value.startsWith('.');
}

export function uploadUrl(folder: UploadFolder, filename: string): string {
  return `${MANAGED_UPLOAD_PREFIX}${folder}/${filename}`;
}

export function isManagedUploadUrl(url: unknown): url is string {
  return typeof url === 'string' && url.startsWith(MANAGED_UPLOAD_PREFIX);
}

export function isLegacyUploadUrl(url: unknown): url is string {
  return typeof url === 'string' && url.startsWith(LEGACY_UPLOAD_PREFIX);
}

/** Splits a `/api/uploads/{folder}/{filename}` URL, or returns null. */
export function parseUploadUrl(
  url: unknown,
): { folder: UploadFolder; filename: string } | null {
  if (!isManagedUploadUrl(url)) return null;

  // Drop any query string or hash before splitting.
  const path = url.slice(MANAGED_UPLOAD_PREFIX.length).split(/[?#]/)[0];
  const parts = path.split('/');
  if (parts.length !== 2) return null;

  const [folder, filename] = parts;
  if (!isUploadFolder(folder) || !isSafeFilename(decodeURIComponent(filename))) return null;

  return { folder, filename: decodeURIComponent(filename) };
}

/**
 * Public-facing image path.
 *
 * Legacy `/uploads/...` URLs were written to a filesystem that no longer
 * exists on serverless hosts, so they resolve to a placeholder instead of a
 * broken image. Everything else passes through untouched.
 */
export function resolveImageSrc(src: unknown, fallback = IMAGE_PLACEHOLDER): string {
  if (typeof src !== 'string' || src.trim().length === 0) return fallback;
  const value = src.trim();
  if (value.startsWith(LEGACY_UPLOAD_PREFIX)) return fallback;
  if (value.startsWith('/') && !value.startsWith('//')) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return fallback;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
}
