/**
 * Small server-side validator.
 *
 * Every admin mutation runs its body through one of these schemas — the
 * dashboard's own client-side checks are treated as a convenience only.
 */

export type FieldResult<T> = { value: T } | { error: string };

export type Field<T> = {
  /** Parses a raw JSON value. `undefined` means "key absent". */
  parse: (raw: unknown) => FieldResult<T>;
  /** Used on full (non-partial) writes when the key is absent. */
  required?: boolean;
};

type StringOptions = {
  required?: boolean;
  max?: number;
  min?: number;
  /** Allow an empty string even when the field is required. */
  allowEmpty?: boolean;
};

export function str(options: StringOptions = {}): Field<string> {
  const { required = false, max = 4000, min = 0, allowEmpty = !required } = options;

  return {
    required,
    parse(raw) {
      if (raw === null || raw === undefined) {
        return required && !allowEmpty ? { error: 'This field is required.' } : { value: '' };
      }
      if (typeof raw !== 'string') return { error: 'Expected text.' };

      const value = raw.trim();
      if (!allowEmpty && value.length === 0) return { error: 'This field is required.' };
      if (value.length < min) return { error: `Must be at least ${min} characters.` };
      if (value.length > max) return { error: `Must be ${max} characters or fewer.` };

      return { value };
    },
  };
}

export function slug(options: { required?: boolean } = {}): Field<string> {
  const inner = str({ required: options.required, allowEmpty: false, max: 120 });

  return {
    required: options.required,
    parse(raw) {
      const result = inner.parse(raw);
      if ('error' in result) return result;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result.value)) {
        return { error: 'Use lowercase letters, numbers and hyphens only.' };
      }
      return result;
    },
  };
}

export function strArray(options: { max?: number; itemMax?: number } = {}): Field<string[]> {
  const { max = 40, itemMax = 500 } = options;

  return {
    parse(raw) {
      if (raw === null || raw === undefined) return { value: [] };
      if (!Array.isArray(raw)) return { error: 'Expected a list.' };
      if (raw.length > max) return { error: `No more than ${max} entries.` };

      const value: string[] = [];
      for (const entry of raw) {
        if (typeof entry !== 'string') return { error: 'Every entry must be text.' };
        const trimmed = entry.trim();
        if (!trimmed) continue;
        if (trimmed.length > itemMax) {
          return { error: `Entries must be ${itemMax} characters or fewer.` };
        }
        value.push(trimmed);
      }

      return { value };
    },
  };
}

export function num(
  options: { min?: number; max?: number; integer?: boolean } = {},
): Field<number> {
  const { min = -1_000_000, max = 1_000_000, integer = true } = options;

  return {
    parse(raw) {
      if (raw === null || raw === undefined || raw === '') return { value: 0 };
      const value = typeof raw === 'string' ? Number(raw) : raw;
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return { error: 'Expected a number.' };
      }
      if (integer && !Number.isInteger(value)) return { error: 'Expected a whole number.' };
      if (value < min || value > max) return { error: `Must be between ${min} and ${max}.` };
      return { value };
    },
  };
}

export function bool(defaultValue = false): Field<boolean> {
  return {
    parse(raw) {
      if (raw === null || raw === undefined) return { value: defaultValue };
      if (typeof raw === 'boolean') return { value: raw };
      if (raw === 'true') return { value: true };
      if (raw === 'false') return { value: false };
      return { error: 'Expected true or false.' };
    },
  };
}

export function oneOf<T extends string>(
  values: readonly T[],
  options: { required?: boolean } = {},
): Field<T> {
  return {
    required: options.required,
    parse(raw) {
      if (raw === null || raw === undefined || raw === '') {
        if (options.required) return { error: 'This field is required.' };
        return { value: values[0] };
      }
      if (typeof raw !== 'string' || !values.includes(raw as T)) {
        return { error: `Must be one of: ${values.join(', ')}.` };
      }
      return { value: raw as T };
    },
  };
}

/**
 * An image path. Accepts site-relative paths (`/images/...`,
 * `/api/uploads/...`) and absolute http(s) URLs; anything else is rejected so
 * a `javascript:` or `data:` value can never reach the markup.
 */
export function imageUrl(): Field<string> {
  return {
    parse(raw) {
      if (raw === null || raw === undefined) return { value: '' };
      if (typeof raw !== 'string') return { error: 'Expected an image path.' };

      const value = raw.trim();
      if (!value) return { value: '' };
      if (value.length > 500) return { error: 'Path is too long.' };
      if (value.startsWith('/') && !value.startsWith('//')) return { value };
      if (/^https?:\/\//i.test(value)) return { value };

      return { error: 'Must be a site path starting with / or an http(s) URL.' };
    },
  };
}

export type ImageRefValue = { src: string; alt: string };

export function imageRef(): Field<ImageRefValue> {
  const srcField = imageUrl();
  const altField = str({ max: 300 });

  return {
    parse(raw) {
      if (raw === null || raw === undefined) return { value: { src: '', alt: '' } };
      if (typeof raw !== 'object' || Array.isArray(raw)) {
        return { error: 'Expected an image object.' };
      }

      const input = raw as Record<string, unknown>;
      const src = srcField.parse(input.src);
      if ('error' in src) return { error: `Image path: ${src.error}` };
      const alt = altField.parse(input.alt);
      if ('error' in alt) return { error: `Alt text: ${alt.error}` };

      return { value: { src: src.value, alt: alt.value } };
    },
  };
}

export type Schema = Record<string, Field<unknown>>;

export type ParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; errors: Record<string, string> };

/**
 * Validates a request body against a schema.
 * With `partial`, absent keys are skipped (PATCH); otherwise required keys
 * must be present and every other key falls back to its parser default.
 */
export function parseBody(
  schema: Schema,
  body: unknown,
  { partial = false }: { partial?: boolean } = {},
): ParseResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, errors: { _: 'Expected a JSON object.' } };
  }

  const input = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const [key, field] of Object.entries(schema)) {
    const present = Object.prototype.hasOwnProperty.call(input, key);

    if (!present) {
      if (partial) continue;
      if (field.required) {
        errors[key] = 'This field is required.';
        continue;
      }
    }

    const result = field.parse(present ? input[key] : undefined);
    if ('error' in result) {
      errors[key] = result.error;
      continue;
    }

    data[key] = result.value;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data };
}
