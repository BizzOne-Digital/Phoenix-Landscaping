import type { UploadFolder } from '@/lib/uploads';

/** Declarative form fields shared by every collection screen. */
export type FieldConfig =
  | {
      type: 'text';
      name: string;
      label: string;
      required?: boolean;
      placeholder?: string;
      hint?: string;
    }
  | {
      type: 'textarea';
      name: string;
      label: string;
      required?: boolean;
      rows?: number;
      hint?: string;
    }
  | { type: 'number'; name: string; label: string; hint?: string }
  | { type: 'switch'; name: string; label: string; hint?: string }
  | {
      type: 'select';
      name: string;
      label: string;
      options: readonly { value: string; label: string }[];
      hint?: string;
    }
  | { type: 'icon'; name: string; label: string; hint?: string }
  /** Free-text list stored as `string[]` — one entry per line. */
  | { type: 'list'; name: string; label: string; hint?: string }
  /** `{ src, alt }` sub-document, matching the public `SiteImage` shape. */
  | { type: 'image'; name: string; label: string; folder: UploadFolder; hint?: string }
  /** A bare image path stored as a string. */
  | { type: 'imagePath'; name: string; label: string; folder: UploadFolder; hint?: string };

export type ColumnConfig = {
  /** Supports dot paths, e.g. `image.src`. */
  key: string;
  label: string;
  kind?: 'text' | 'thumb' | 'published' | 'muted';
  className?: string;
};

export type CollectionItem = Record<string, unknown> & { id: string };

export function getFieldValue(item: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value === null || typeof value !== 'object') return undefined;
    return (value as Record<string, unknown>)[key];
  }, item);
}

export function setFieldValue<T extends Record<string, unknown>>(
  source: T,
  path: string,
  value: unknown,
): T {
  const [head, ...rest] = path.split('.');

  if (rest.length === 0) {
    return { ...source, [head]: value };
  }

  const child = (source[head] ?? {}) as Record<string, unknown>;
  return { ...source, [head]: setFieldValue(child, rest.join('.'), value) };
}

/** Blank starting values for a new record, derived from the field list. */
export function emptyValues(fields: readonly FieldConfig[]): Record<string, unknown> {
  let values: Record<string, unknown> = {};

  for (const field of fields) {
    switch (field.type) {
      case 'number':
        values = setFieldValue(values, field.name, 0);
        break;
      case 'switch':
        values = setFieldValue(values, field.name, true);
        break;
      case 'list':
        values = setFieldValue(values, field.name, []);
        break;
      case 'image':
        values = setFieldValue(values, field.name, { src: '', alt: '' });
        break;
      case 'select':
        values = setFieldValue(values, field.name, field.options[0]?.value ?? '');
        break;
      default:
        values = setFieldValue(values, field.name, '');
    }
  }

  return values;
}
