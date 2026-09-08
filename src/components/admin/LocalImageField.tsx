'use client';

import Image from 'next/image';
import { useCallback, useId, useRef, useState } from 'react';
import { ImageOff, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';
import { AdminButton, AdminFieldError, AdminLabel, AdminSpinner } from '@/components/admin/ui';
import {
  ALLOWED_IMAGE_TYPES,
  IMAGE_PLACEHOLDER,
  MAX_UPLOAD_BYTES,
  isLegacyUploadUrl,
  type UploadFolder,
} from '@/lib/uploads';

const ACCEPT = Object.keys(ALLOWED_IMAGE_TYPES).join(',');

type UploadResponse = {
  success?: boolean;
  url?: string;
  message?: string;
};

type LocalImageFieldProps = {
  /** Current image path, or an empty string. */
  value: string;
  /** Receives the saved public URL, or an empty string when removed. */
  onChange: (url: string) => void;
  folder: UploadFolder;
  label?: string;
  hint?: string;
  disabled?: boolean;
};

/**
 * Admin image picker.
 *
 * Uploads go to `POST /api/upload`, which stores the binary in MongoDB and
 * returns a `/api/uploads/{folder}/{filename}` URL. Only that URL is kept in
 * the content document.
 *
 * Removing or replacing an image clears the field here; the corresponding
 * `StoredUpload` is deleted server-side when the parent record is saved, so a
 * failed upload never destroys the image that is still live.
 */
export default function LocalImageField({
  value,
  onChange,
  folder,
  label = 'Image',
  hint,
  disabled = false,
}: LocalImageFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { toast } = useToast();

  const legacy = isLegacyUploadUrl(value);
  const previewSrc = value && !legacy ? value : IMAGE_PLACEHOLDER;

  const upload = useCallback(
    async (file: File) => {
      setError(undefined);

      if (!Object.prototype.hasOwnProperty.call(ALLOWED_IMAGE_TYPES, file.type)) {
        setError('Choose a JPEG, PNG, WebP or GIF image.');
        return;
      }

      if (file.size > MAX_UPLOAD_BYTES) {
        setError('Images must be 8 MB or smaller.');
        return;
      }

      setUploading(true);

      try {
        const body = new FormData();
        body.append('file', file);
        body.append('folder', folder);

        const response = await fetch('/api/upload', { method: 'POST', body });
        const payload = (await response.json().catch(() => ({}))) as UploadResponse;

        if (!response.ok || !payload.success || !payload.url) {
          const message =
            response.status === 401
              ? 'Your session has expired. Sign in again.'
              : payload.message ?? 'The upload failed. Please try again.';
          setError(message);
          toast(message, 'error');
          return;
        }

        onChange(payload.url);
        toast('Image uploaded.', 'success');
      } catch {
        const message = 'The upload could not be completed. Check your connection.';
        setError(message);
        toast(message, 'error');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [folder, onChange, toast],
  );

  return (
    <div>
      <AdminLabel htmlFor={inputId} hint={hint}>
        {label}
      </AdminLabel>

      <div className="mt-2 flex items-start gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          {value ? (
            <Image
              src={previewSrc}
              alt=""
              fill
              sizes="112px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-slate-300">
              <ImageOff className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
            </span>
          )}

          {uploading ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-slate-700">
              <AdminSpinner />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            disabled={disabled || uploading}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />

          <div className="flex flex-wrap gap-2">
            <AdminButton
              variant="secondary"
              size="sm"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? <AdminSpinner /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
              {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload image'}
            </AdminButton>

            {value ? (
              <AdminButton
                variant="danger"
                size="sm"
                disabled={disabled || uploading}
                onClick={() => {
                  onChange('');
                  setError(undefined);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </AdminButton>
            ) : null}
          </div>

          {uploading ? (
            <div
              className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-label="Uploading image"
            >
              <span className="block h-full w-1/3 animate-[fade-up_1s_ease-in-out_infinite] bg-slate-500" />
            </div>
          ) : null}

          <p className="mt-2 break-all text-[0.75rem] text-slate-500">
            {value ? value : 'JPEG, PNG, WebP or GIF · up to 8 MB'}
          </p>

          {legacy ? (
            <p className="mt-1 text-[0.75rem] text-amber-700">
              This is a legacy /uploads path. The file is no longer on the server, so the site shows
              a placeholder — upload a replacement.
            </p>
          ) : null}

          <AdminFieldError message={error} />
        </div>
      </div>
    </div>
  );
}
