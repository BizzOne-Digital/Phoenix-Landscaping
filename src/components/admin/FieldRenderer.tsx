'use client';

import { useId } from 'react';
import Icon, { iconMap, type IconName } from '@/components/Icon';
import LocalImageField from '@/components/admin/LocalImageField';
import {
  getFieldValue,
  setFieldValue,
  type FieldConfig,
} from '@/components/admin/fields';
import {
  AdminFieldError,
  AdminLabel,
  inputClasses,
} from '@/components/admin/ui';

const ICON_NAMES = Object.keys(iconMap) as IconName[];

type FieldRendererProps = {
  field: FieldConfig;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  disabled?: boolean;
  onChange: (next: Record<string, unknown>) => void;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value : value === undefined || value === null ? '' : String(value);
}

/** Renders one declarative field. Kept separate so forms stay small. */
export default function FieldRenderer({
  field,
  values,
  errors,
  disabled = false,
  onChange,
}: FieldRendererProps) {
  const id = useId();
  const raw = getFieldValue(values, field.name);
  const error = errors[field.name] ?? errors[field.name.split('.')[0]];

  const update = (value: unknown) => onChange(setFieldValue(values, field.name, value));

  if (field.type === 'image') {
    const image = (raw ?? {}) as { src?: unknown; alt?: unknown };

    return (
      <div className="space-y-3">
        <LocalImageField
          label={field.label}
          hint={field.hint}
          folder={field.folder}
          value={asString(image.src)}
          disabled={disabled}
          onChange={(url) => update({ ...image, src: url })}
        />
        <div>
          <AdminLabel htmlFor={`${id}-alt`} hint="describes the photo for screen readers">
            Alt text
          </AdminLabel>
          <input
            id={`${id}-alt`}
            className={`mt-1.5 ${inputClasses}`}
            value={asString(image.alt)}
            disabled={disabled}
            onChange={(event) => update({ ...image, alt: event.target.value })}
          />
        </div>
        <AdminFieldError message={error} />
      </div>
    );
  }

  if (field.type === 'imagePath') {
    return (
      <div>
        <LocalImageField
          label={field.label}
          hint={field.hint}
          folder={field.folder}
          value={asString(raw)}
          disabled={disabled}
          onChange={update}
        />
        <AdminFieldError message={error} />
      </div>
    );
  }

  if (field.type === 'switch') {
    return (
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={raw === true}
          disabled={disabled}
          onChange={(event) => update(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
        />
        <div>
          <AdminLabel htmlFor={id} hint={field.hint}>
            {field.label}
          </AdminLabel>
          <AdminFieldError message={error} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminLabel htmlFor={id} hint={field.hint}>
        {field.label}
        {'required' in field && field.required ? (
          <span className="ml-0.5 text-red-500">*</span>
        ) : null}
      </AdminLabel>

      {field.type === 'textarea' ? (
        <textarea
          id={id}
          rows={field.rows ?? 4}
          className={`mt-1.5 ${inputClasses}`}
          value={asString(raw)}
          disabled={disabled}
          onChange={(event) => update(event.target.value)}
        />
      ) : null}

      {field.type === 'text' ? (
        <input
          id={id}
          className={`mt-1.5 ${inputClasses}`}
          placeholder={field.placeholder}
          value={asString(raw)}
          disabled={disabled}
          onChange={(event) => update(event.target.value)}
        />
      ) : null}

      {field.type === 'number' ? (
        <input
          id={id}
          type="number"
          min={0}
          className={`mt-1.5 ${inputClasses}`}
          value={typeof raw === 'number' ? raw : 0}
          disabled={disabled}
          onChange={(event) => update(Number(event.target.value) || 0)}
        />
      ) : null}

      {field.type === 'select' ? (
        <select
          id={id}
          className={`mt-1.5 ${inputClasses}`}
          value={asString(raw)}
          disabled={disabled}
          onChange={(event) => update(event.target.value)}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {field.type === 'icon' ? (
        <div className="mt-1.5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
            {ICON_NAMES.includes(asString(raw) as IconName) ? (
              <Icon name={asString(raw) as IconName} className="h-4 w-4" />
            ) : null}
          </span>
          <select
            id={id}
            className={inputClasses}
            value={asString(raw)}
            disabled={disabled}
            onChange={(event) => update(event.target.value)}
          >
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {field.type === 'list' ? (
        <textarea
          id={id}
          rows={5}
          className={`mt-1.5 ${inputClasses} font-mono text-[0.8rem]`}
          value={Array.isArray(raw) ? (raw as string[]).join('\n') : ''}
          disabled={disabled}
          // Blank lines are kept while typing; the API drops them on save.
          onChange={(event) => update(event.target.value.split('\n'))}
        />
      ) : null}

      <AdminFieldError message={error} />
    </div>
  );
}
