'use client';

import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';

/**
 * Brief brand intro shown on a full page load. It is purely decorative:
 * it never waits on images or network requests, it removes itself from the
 * DOM when finished, and it disappears entirely when JavaScript is off or
 * reduced motion is requested.
 */

const HOLD_MS = 1400;
const EXIT_MS = 600;
const REDUCED_HOLD_MS = 800;
const REDUCED_EXIT_MS = 400;

export default function IntroSplash() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hold = reduced ? REDUCED_HOLD_MS : HOLD_MS;
    const exit = reduced ? REDUCED_EXIT_MS : EXIT_MS;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const release = () => {
      document.body.style.overflow = previousOverflow;
    };

    const exitTimer = window.setTimeout(() => setExiting(true), hold);
    const removeTimer = window.setTimeout(() => {
      setDone(true);
      release();
    }, hold + exit);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      release();
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden="true"
      className={`phx-splash fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-burgundy-800 px-6 ${
        exiting ? 'phx-splash--exit pointer-events-none' : ''
      }`}
    >
      <noscript>
        <style>{`.phx-splash{display:none !important}`}</style>
      </noscript>

      <style>{`
        @keyframes phxSplashRise {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes phxSplashFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes phxSplashLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .phx-splash__logo,
        .phx-splash__name,
        .phx-splash__tagline,
        .phx-splash__line {
          opacity: 0;
          animation-duration: 620ms;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: both;
        }
        .phx-splash__logo    { animation-name: phxSplashRise; animation-delay: 60ms; }
        .phx-splash__name    { animation-name: phxSplashRise; animation-delay: 460ms; }
        .phx-splash__tagline { animation-name: phxSplashRise; animation-delay: 700ms; }
        .phx-splash__line {
          animation-name: phxSplashFade;
          animation-delay: 700ms;
          animation-duration: 300ms;
        }
        .phx-splash__line-fill {
          transform-origin: left center;
          animation: phxSplashLine 1200ms cubic-bezier(0.33, 0.85, 0.4, 1) 260ms both;
        }
        .phx-splash {
          transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .phx-splash--exit { opacity: 0; }
        .phx-splash--exit .phx-splash__stage {
          transition:
            opacity 480ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: scale(0.97);
        }

        @media (prefers-reduced-motion: reduce) {
          .phx-splash__logo,
          .phx-splash__name,
          .phx-splash__tagline,
          .phx-splash__line {
            animation-name: phxSplashFade;
            animation-duration: 260ms;
            animation-delay: 0ms;
          }
          .phx-splash__line-fill {
            animation: phxSplashLine 700ms linear both;
          }
          .phx-splash {
            transition-duration: 400ms;
          }
          .phx-splash--exit .phx-splash__stage {
            transition-duration: 400ms;
            transform: none;
          }
        }
      `}</style>

      <div className="phx-splash__stage flex w-full max-w-sm flex-col items-center text-center">
        <div className="phx-splash__logo">
          <Logo plate sizeClassName="h-24 w-auto sm:h-28 lg:h-32" priority />
        </div>

        <p className="phx-splash__name mt-8 font-serif text-lg font-semibold uppercase tracking-[0.22em] text-cream sm:text-xl">
          Phoenix Landscaping
        </p>

        <p className="phx-splash__tagline mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-gold-light sm:text-[0.7rem]">
          Four-Season Property Care
        </p>

        <span className="phx-splash__line mt-8 block h-px w-32 overflow-hidden bg-gold/20 sm:w-40">
          <span className="phx-splash__line-fill block h-full w-full bg-gold" />
        </span>
      </div>
    </div>
  );
}
