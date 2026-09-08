'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import FieldRenderer from '@/components/admin/FieldRenderer';
import { useToast } from '@/components/admin/ToastProvider';
import type { FieldConfig } from '@/components/admin/fields';
import {
  AdminButton,
  AdminCard,
  AdminHeading,
  AdminSpinner,
} from '@/components/admin/ui';

/**
 * Business information that feeds the header, footer, hero, contact page and
 * LocalBusiness structured data.
 */
const groups: { title: string; description?: string; fields: FieldConfig[] }[] = [
  {
    title: 'Business',
    fields: [
      { type: 'text', name: 'name', label: 'Business name', required: true },
      { type: 'text', name: 'legalName', label: 'Legal name' },
      { type: 'text', name: 'contactPerson', label: 'Contact person' },
      { type: 'text', name: 'yearsExperience', label: 'Years of experience', hint: 'e.g. 30+' },
      { type: 'text', name: 'url', label: 'Site URL', hint: 'used for canonicals and the sitemap' },
    ],
  },
  {
    title: 'Contact',
    description: 'The tel: and mailto: links are generated from these values.',
    fields: [
      { type: 'text', name: 'phone', label: 'Phone', required: true },
      { type: 'text', name: 'email', label: 'Email', required: true },
      { type: 'text', name: 'serviceArea', label: 'Service area' },
      { type: 'text', name: 'city', label: 'City' },
      { type: 'text', name: 'region', label: 'Region code', hint: 'e.g. AB' },
      { type: 'text', name: 'regionName', label: 'Region name' },
      { type: 'text', name: 'country', label: 'Country code', hint: 'e.g. CA' },
      { type: 'text', name: 'countryName', label: 'Country name' },
    ],
  },
  {
    title: 'Headline copy',
    fields: [
      { type: 'textarea', name: 'tagline', label: 'Hero tagline', rows: 2 },
      { type: 'textarea', name: 'description', label: 'Full description', rows: 4 },
      { type: 'textarea', name: 'shortDescription', label: 'Short description', rows: 2 },
      {
        type: 'list',
        name: 'heroBadges',
        label: 'Hero trust badges',
        hint: 'one per line',
      },
    ],
  },
  {
    title: 'Job-scope notice',
    description: 'Shown on the services and contact pages so leads self-qualify.',
    fields: [
      { type: 'text', name: 'scopeNoteTitle', label: 'Notice title' },
      { type: 'textarea', name: 'scopeNoteDescription', label: 'Notice text', rows: 4 },
    ],
  },
];

const allFields = groups.flatMap((group) => group.fields);

type SettingsResponse = {
  success?: boolean;
  item?: Record<string, unknown> | null;
  message?: string;
  errors?: Record<string, string>;
};

export default function SettingsForm({
  /** Current values, seeded from the server so the form never starts blank. */
  initialValues,
  canEdit,
}: {
  initialValues: Record<string, unknown>;
  canEdit: boolean;
}) {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as SettingsResponse;
      if (response.ok && payload.success && payload.item) {
        setValues((current) => ({ ...current, ...payload.item }));
      }
    } catch {
      toast('Could not refresh the saved settings.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function save() {
    setSaving(true);
    setErrors({});
    setFormError(null);

    const body: Record<string, unknown> = {};
    for (const field of allFields) body[field.name] = values[field.name];

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const payload = (await response.json().catch(() => ({}))) as SettingsResponse;

      if (!response.ok || !payload.success) {
        if (payload.errors) setErrors(payload.errors);
        const message =
          response.status === 403
            ? 'Only an admin can change site settings.'
            : response.status === 401
              ? 'Your session has expired. Sign in again.'
              : payload.message ?? 'The settings could not be saved.';
        setFormError(message);
        toast(message, 'error');
        return;
      }

      toast('Site settings saved.', 'success');
      if (payload.item) setValues((current) => ({ ...current, ...payload.item }));
    } catch {
      const message = 'Could not reach the server. Your changes were not saved.';
      setFormError(message);
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <AdminHeading>Site settings</AdminHeading>
          <p className="mt-1 max-w-2xl text-[0.85rem] text-slate-500">
            Business details used across the header, footer, hero, contact page and search-engine
            structured data.
          </p>
        </div>
        <AdminButton variant="secondary" size="sm" onClick={() => void reload()} disabled={loading}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          Refresh
        </AdminButton>
      </div>

      {!canEdit ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[0.85rem] text-amber-800">
          Your account can view these settings but not change them. Ask an admin to make edits.
        </p>
      ) : null}

      {formError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
          {formError}
        </p>
      ) : null}

      {groups.map((group) => (
        <AdminCard key={group.title} className="p-5">
          <AdminHeading as="h2">{group.title}</AdminHeading>
          {group.description ? (
            <p className="mt-1 text-[0.82rem] text-slate-500">{group.description}</p>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={field.name}
                className={field.type === 'textarea' || field.type === 'list' ? 'sm:col-span-2' : ''}
              >
                <FieldRenderer
                  field={field}
                  values={values}
                  errors={errors}
                  disabled={saving || !canEdit}
                  onChange={setValues}
                />
              </div>
            ))}
          </div>
        </AdminCard>
      ))}

      <div className="flex justify-end">
        <AdminButton onClick={() => void save()} disabled={saving || !canEdit}>
          {saving ? <AdminSpinner /> : null}
          {saving ? 'Saving…' : 'Save settings'}
        </AdminButton>
      </div>
    </div>
  );
}
