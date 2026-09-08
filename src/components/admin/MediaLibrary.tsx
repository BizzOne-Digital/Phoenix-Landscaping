'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';
import LocalImageField from '@/components/admin/LocalImageField';
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmptyState,
  AdminHeading,
  AdminSpinner,
} from '@/components/admin/ui';
import { UPLOAD_FOLDERS, formatBytes, type UploadFolder } from '@/lib/uploads';

type MediaItem = {
  id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string | null;
};

type MediaResponse = {
  success?: boolean;
  items?: MediaItem[];
  total?: number;
  message?: string;
};

const filters = ['all', ...UPLOAD_FOLDERS] as const;

/**
 * Uploaded-image browser.
 *
 * The listing endpoint projects metadata only — no image binaries are loaded
 * to render this screen; each thumbnail is fetched by the browser from
 * `/api/uploads/...`.
 */
export default function MediaLibrary({ canDelete }: { canDelete: boolean }) {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [folder, setFolder] = useState<(typeof filters)[number]>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadFolder, setUploadFolder] = useState<UploadFolder>('misc');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = folder === 'all' ? '' : `?folder=${folder}`;
      const response = await fetch(`/api/admin/media${query}`, { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as MediaResponse;

      if (!response.ok || !payload.success) {
        setError(payload.message ?? 'Could not load the media library.');
        return;
      }

      setItems(payload.items ?? []);
      setTotal(payload.total ?? 0);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(item: MediaItem) {
    if (
      !window.confirm(
        `Delete ${item.filename}? Any content still pointing at it will fall back to a placeholder.`,
      )
    ) {
      return;
    }

    setDeletingId(item.id);

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' });
      const payload = (await response.json().catch(() => ({}))) as MediaResponse;

      if (!response.ok || !payload.success) {
        toast(payload.message ?? 'Could not delete that image.', 'error');
        return;
      }

      toast('Image deleted.', 'success');
      await load();
    } catch {
      toast('Could not reach the server. Nothing was deleted.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <AdminHeading>Media library</AdminHeading>
          <p className="mt-1 max-w-2xl text-[0.85rem] text-slate-500">
            Every admin upload, stored as binary data in MongoDB and served from{' '}
            <code className="text-slate-600">/api/uploads/…</code>. These files survive
            redeployments.
          </p>
        </div>
        <AdminButton variant="secondary" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Refresh
        </AdminButton>
      </div>

      <AdminCard className="p-5">
        <AdminHeading as="h2">Upload an image</AdminHeading>
        <p className="mt-1 text-[0.82rem] text-slate-500">
          Useful for adding images before you attach them to content.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="media-upload-folder"
              className="block text-[0.8rem] font-medium text-slate-700"
            >
              Folder
            </label>
            <select
              id="media-upload-folder"
              value={uploadFolder}
              onChange={(event) => setUploadFolder(event.target.value as UploadFolder)}
              className="mt-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {UPLOAD_FOLDERS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[18rem] flex-1">
            <LocalImageField
              label="New image"
              folder={uploadFolder}
              value=""
              onChange={() => {
                void load();
              }}
            />
          </div>
        </div>
      </AdminCard>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFolder(value)}
            aria-pressed={folder === value}
            className={`rounded-full border px-3 py-1 text-[0.8rem] font-medium capitalize transition ${
              folder === value
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {value}
          </button>
        ))}
        <span className="ml-1 text-[0.8rem] text-slate-500">
          {loading ? 'Loading…' : `${total} image${total === 1 ? '' : 's'}`}
        </span>
      </div>

      <AdminCard>
        {loading ? (
          <div className="flex items-center gap-2 px-6 py-14 text-sm text-slate-500">
            <AdminSpinner />
            Loading…
          </div>
        ) : error ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <AdminButton variant="secondary" size="sm" className="mt-4" onClick={() => void load()}>
              Try again
            </AdminButton>
          </div>
        ) : items.length === 0 ? (
          <AdminEmptyState
            title="No uploads yet"
            description="Images you upload from any content screen appear here."
          />
        ) : (
          <ul className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-md border border-slate-200">
                <div className="relative aspect-[4/3] bg-slate-50">
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 90vw"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5 p-3">
                  <p className="break-all font-sans text-[0.78rem] font-medium text-slate-800">
                    {item.filename}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <AdminBadge>{item.folder}</AdminBadge>
                    <AdminBadge>{item.mimeType.replace('image/', '')}</AdminBadge>
                    <AdminBadge>{formatBytes(item.size)}</AdminBadge>
                  </div>
                  <p className="text-[0.72rem] text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.76rem] font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
                    >
                      Open
                    </a>
                    {canDelete ? (
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        disabled={deletingId === item.id}
                        onClick={() => void remove(item)}
                      >
                        {deletingId === item.id ? (
                          <AdminSpinner />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        Delete
                      </AdminButton>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
