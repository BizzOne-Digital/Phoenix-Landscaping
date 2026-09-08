'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';
import FieldRenderer from '@/components/admin/FieldRenderer';
import {
  emptyValues,
  getFieldValue,
  type CollectionItem,
  type ColumnConfig,
  type FieldConfig,
} from '@/components/admin/fields';
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmptyState,
  AdminHeading,
  AdminSpinner,
  inputClasses,
} from '@/components/admin/ui';
import { IMAGE_PLACEHOLDER, isLegacyUploadUrl } from '@/lib/uploads';

type ApiListResponse = {
  success?: boolean;
  items?: CollectionItem[];
  message?: string;
};

type ApiItemResponse = {
  success?: boolean;
  item?: CollectionItem;
  message?: string;
  errors?: Record<string, string>;
};

type CollectionManagerProps = {
  /** e.g. `/api/admin/services` */
  endpoint: string;
  title: string;
  description?: string;
  /** Singular noun used in buttons and confirmations. */
  itemNoun: string;
  fields: readonly FieldConfig[];
  columns: readonly ColumnConfig[];
  /** Fields searched by the filter box. Dot paths allowed. */
  searchKeys?: readonly string[];
  allowCreate?: boolean;
  allowDelete?: boolean;
};

function textOf(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.join(', ');
  return '';
}

/**
 * One reusable CRUD screen for every CMS collection.
 *
 * Every mutation goes through the admin API, which re-checks authentication,
 * validates the body and revalidates the public pages.
 */
export default function CollectionManager({
  endpoint,
  title,
  description,
  itemNoun,
  fields,
  columns,
  searchKeys = [],
  allowCreate = true,
  allowDelete = true,
}: CollectionManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, unknown> } | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as ApiListResponse;

      if (!response.ok || !payload.success) {
        setLoadError(
          response.status === 401
            ? 'Your session has expired. Sign in again.'
            : payload.message ?? `Could not load ${title.toLowerCase()}.`,
        );
        return;
      }

      setItems(payload.items ?? []);
    } catch {
      setLoadError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || searchKeys.length === 0) return items;

    return items.filter((item) =>
      searchKeys.some((key) => textOf(getFieldValue(item, key)).toLowerCase().includes(needle)),
    );
  }, [items, query, searchKeys]);

  function startCreate() {
    setFieldErrors({});
    setFormError(null);
    setEditing({ id: null, values: emptyValues(fields) });
  }

  function startEdit(item: CollectionItem) {
    setFieldErrors({});
    setFormError(null);
    // Start from blanks so a field missing on an older document still renders.
    setEditing({ id: item.id, values: { ...emptyValues(fields), ...item } });
  }

  async function save() {
    if (!editing) return;

    setSaving(true);
    setFieldErrors({});
    setFormError(null);

    const isNew = editing.id === null;
    const url = isNew ? endpoint : `${endpoint}/${editing.id}`;

    const body: Record<string, unknown> = {};
    for (const field of fields) {
      const [root] = field.name.split('.');
      body[root] = editing.values[root];
    }

    try {
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = (await response.json().catch(() => ({}))) as ApiItemResponse;

      if (!response.ok || !payload.success) {
        if (payload.errors) setFieldErrors(payload.errors);
        const message =
          response.status === 401
            ? 'Your session has expired. Sign in again.'
            : response.status === 403
              ? 'You do not have permission to change this.'
              : payload.message ?? 'The changes could not be saved.';
        setFormError(message);
        toast(message, 'error');
        return;
      }

      toast(isNew ? `${itemNoun} created.` : `${itemNoun} saved.`, 'success');
      setEditing(null);
      await load();
    } catch {
      const message = 'Could not reach the server. Your changes were not saved.';
      setFormError(message);
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: CollectionItem) {
    const label = textOf(getFieldValue(item, columns[0]?.key ?? 'id')) || itemNoun;
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;

    setDeletingId(item.id);

    try {
      const response = await fetch(`${endpoint}/${item.id}`, { method: 'DELETE' });
      const payload = (await response.json().catch(() => ({}))) as ApiItemResponse;

      if (!response.ok || !payload.success) {
        toast(payload.message ?? `Could not delete this ${itemNoun.toLowerCase()}.`, 'error');
        return;
      }

      toast(`${itemNoun} deleted.`, 'success');
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
          <AdminHeading>{title}</AdminHeading>
          {description ? (
            <p className="mt-1 max-w-2xl text-[0.85rem] text-slate-500">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <AdminButton variant="secondary" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Refresh
          </AdminButton>
          {allowCreate ? (
            <AdminButton size="sm" onClick={startCreate}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New {itemNoun.toLowerCase()}
            </AdminButton>
          ) : null}
        </div>
      </div>

      {searchKeys.length > 0 ? (
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}`}
            aria-label={`Search ${title.toLowerCase()}`}
            className={`${inputClasses} pl-9`}
          />
        </div>
      ) : null}

      <AdminCard>
        {loading ? (
          <div className="flex items-center gap-2 px-6 py-14 text-sm text-slate-500">
            <AdminSpinner />
            Loading…
          </div>
        ) : loadError ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-red-600">{loadError}</p>
            <AdminButton variant="secondary" size="sm" className="mt-4" onClick={() => void load()}>
              Try again
            </AdminButton>
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            title={items.length === 0 ? `No ${title.toLowerCase()} yet` : 'Nothing matches that search'}
            description={
              items.length === 0 && allowCreate
                ? `Run the seed command, or add your first ${itemNoun.toLowerCase()}.`
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[0.72rem] uppercase tracking-wide text-slate-500">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col" className="px-4 py-2.5 font-medium">
                      {column.kind === 'thumb' ? <span className="sr-only">{column.label}</span> : column.label}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="align-middle hover:bg-slate-50/70">
                    {columns.map((column) => {
                      const value = getFieldValue(item, column.key);

                      if (column.kind === 'thumb') {
                        const src = textOf(value);
                        const safe = src && !isLegacyUploadUrl(src) ? src : IMAGE_PLACEHOLDER;
                        return (
                          <td key={column.key} className="px-4 py-2.5">
                            <span className="relative block h-10 w-14 overflow-hidden rounded border border-slate-200 bg-slate-50">
                              <Image src={safe} alt="" fill sizes="56px" unoptimized className="object-cover" />
                            </span>
                          </td>
                        );
                      }

                      if (column.kind === 'published') {
                        return (
                          <td key={column.key} className="px-4 py-2.5">
                            <AdminBadge tone={value === false ? 'warning' : 'success'}>
                              {value === false ? 'Hidden' : 'Live'}
                            </AdminBadge>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={column.key}
                          className={`px-4 py-2.5 ${
                            column.kind === 'muted' ? 'text-slate-500' : 'text-slate-800'
                          } ${column.className ?? ''}`.trim()}
                        >
                          <span className="line-clamp-2 block max-w-[22rem]">{textOf(value)}</span>
                        </td>
                      );
                    })}

                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <AdminButton variant="ghost" size="sm" onClick={() => startEdit(item)}>
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          Edit
                        </AdminButton>
                        {allowDelete ? (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {editing ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${editing.id ? 'Edit' : 'New'} ${itemNoun.toLowerCase()}`}
            className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <AdminHeading as="h2">
                {editing.id ? `Edit ${itemNoun.toLowerCase()}` : `New ${itemNoun.toLowerCase()}`}
              </AdminHeading>
              <AdminButton variant="ghost" size="sm" onClick={() => setEditing(null)} disabled={saving}>
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </AdminButton>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {formError ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
                  {formError}
                </p>
              ) : null}

              {fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  values={editing.values}
                  errors={fieldErrors}
                  disabled={saving}
                  onChange={(values) => setEditing({ ...editing, values })}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <AdminButton variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </AdminButton>
              <AdminButton onClick={() => void save()} disabled={saving}>
                {saving ? <AdminSpinner /> : null}
                {saving ? 'Saving…' : 'Save changes'}
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
