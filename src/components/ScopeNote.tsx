import { Info } from 'lucide-react';
import { site } from '@/lib/site';

/**
 * Job-scope notice. Keeps small one-off yard-job enquiries from coming through
 * the quote form. Copy lives in site.scopeNote.
 */
export default function ScopeNote({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-card border border-line border-l-4 border-l-gold bg-cream p-6 sm:p-7 ${className}`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-burgundy text-cream"
        >
          <Info className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-[1.05rem] font-semibold leading-snug text-ink sm:text-[1.15rem]">
            {site.scopeNote.title}
          </h2>
          <p className="mt-2.5 text-[0.93rem] leading-relaxed text-muted">
            {site.scopeNote.description}
          </p>
        </div>
      </div>
    </div>
  );
}
