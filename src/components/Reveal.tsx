'use client';

import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';

type RevealTag = 'div' | 'section' | 'article' | 'ul' | 'ol' | 'li' | 'span';

type RevealProps = {
  children: ReactNode;
  as?: RevealTag;
  delay?: number;
  className?: string;
};

/**
 * Fades content up as it scrolls into view. Falls back to fully visible
 * content when JavaScript is unavailable (see the <noscript> rule in layout)
 * and honours prefers-reduced-motion via globals.css.
 */
export default function Reveal({ children, as = 'div', delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
      className: `reveal ${visible ? 'is-visible' : ''} ${className}`.trim(),
    },
    children,
  );
}
