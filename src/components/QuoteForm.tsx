'use client';

import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Lock, Send } from 'lucide-react';
import { propertyTypes, serviceOptions } from '@/lib/services';
import { site } from '@/lib/site';
import { SubmitButton } from '@/components/ui/Button';

type FormValues = {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  service: string;
  location: string;
  message: string;
  company: string; // honeypot
};

type Errors = Partial<Record<keyof FormValues, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  propertyType: '',
  service: '',
  location: '',
  message: '',
  company: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: FormValues): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  else if (values.name.trim().length < 2) errors.name = 'Please enter your full name.';

  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!emailPattern.test(values.email.trim()))
    errors.email = 'Please enter a valid email address, for example name@example.com.';

  const digits = values.phone.replace(/\D/g, '');
  if (!values.phone.trim()) errors.phone = 'Please enter a phone number we can reach you on.';
  else if (digits.length < 10) errors.phone = 'Please enter a complete phone number.';

  if (!values.propertyType) errors.propertyType = 'Please choose your property type.';
  if (!values.service) errors.service = 'Please choose the service you need.';
  if (!values.location.trim()) errors.location = 'Please tell us where the property is located.';

  return errors;
}

const fieldBase =
  'w-full min-h-[48px] rounded-md border bg-warmwhite px-4 py-3 text-[0.95rem] text-ink transition-colors placeholder:text-muted/70 focus:border-burgundy focus:outline-none';

export default function QuoteForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  const update = (field: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'We could not submit your request.');
      }

      setStatus('success');
      setValues(initialValues);
    } catch (error) {
      setStatus('error');
      setServerError(
        error instanceof Error
          ? error.message
          : 'We could not submit your request. Please try again.',
      );
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="card flex flex-col items-center p-9 text-center sm:p-12"
      >
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-cream"
        >
          <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
        </span>
        <h3 className="mt-6 text-xl font-semibold">Request Received</h3>
        <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted">
          Thank you! Your request has been received. Phoenix Landscaping will be in touch soon.
        </p>
        <p className="mt-6 text-[0.9rem] text-muted">
          Prefer to talk now? Call{' '}
          <a href={site.phoneHref} className="font-semibold text-burgundy hover:underline">
            {site.phone}
          </a>
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 min-h-[44px] text-[0.9rem] font-semibold text-burgundy underline underline-offset-4 hover:text-burgundy-700"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card relative p-6 sm:p-8" aria-labelledby="quote-form-title">
      <h3 id="quote-form-title" className="text-xl font-semibold">
        Request a Free Quote
      </h3>
      <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
        Tell us about your property and the services you need. Our team will get in touch to discuss
        your requirements.
      </p>

      {status === 'error' ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-md border border-burgundy/25 bg-burgundy-50 p-4 text-[0.88rem] text-burgundy-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          <span>
            {serverError} You can also call{' '}
            <a href={site.phoneHref} className="font-semibold underline">
              {site.phone}
            </a>{' '}
            or email{' '}
            <a href={site.emailHref} className="font-semibold underline">
              {site.email}
            </a>
            .
          </span>
        </div>
      ) : null}

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full Name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            placeholder="Jane Doe"
            className={`${fieldBase} ${errors.name ? 'border-burgundy' : 'border-line'}`}
          />
        </Field>

        <Field id="email" label="Email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="name@example.com"
            className={`${fieldBase} ${errors.email ? 'border-burgundy' : 'border-line'}`}
          />
        </Field>

        <Field id="phone" label="Phone" required error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={update('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            placeholder="780-000-0000"
            className={`${fieldBase} ${errors.phone ? 'border-burgundy' : 'border-line'}`}
          />
        </Field>

        <Field id="location" label="Property Location" required error={errors.location}>
          <input
            id="location"
            name="location"
            type="text"
            autoComplete="address-level2"
            value={values.location}
            onChange={update('location')}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? 'location-error' : undefined}
            placeholder="Neighbourhood or address in Edmonton area"
            className={`${fieldBase} ${errors.location ? 'border-burgundy' : 'border-line'}`}
          />
        </Field>

        <Field id="propertyType" label="Property Type" required error={errors.propertyType}>
          <select
            id="propertyType"
            name="propertyType"
            value={values.propertyType}
            onChange={update('propertyType')}
            aria-invalid={Boolean(errors.propertyType)}
            aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
            className={`${fieldBase} ${errors.propertyType ? 'border-burgundy' : 'border-line'}`}
          >
            <option value="">Select property type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field id="service" label="Services Needed" required error={errors.service}>
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={update('service')}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? 'service-error' : undefined}
            className={`${fieldBase} ${errors.service ? 'border-burgundy' : 'border-line'}`}
          >
            <option value="">Select a service</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field id="message" label="Message / Project Details">
            <textarea
              id="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={update('message')}
              placeholder="Tell us a little about the property and what you need looked after."
              className={`${fieldBase} border-line resize-y`}
            />
          </Field>
        </div>
      </div>

      {/* Honeypot — hidden from people, catches basic spam bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={update('company')}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto">
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
              Sending&hellip;
            </>
          ) : (
            <>
              <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Request a Free Quote
            </>
          )}
        </SubmitButton>

        <p className="flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dark" strokeWidth={2} aria-hidden="true" />
          Your details are used only to prepare your quote. No spam, ever.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.85rem] font-semibold text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-burgundy" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-muted">(optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8rem] font-medium text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}
