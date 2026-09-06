'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { siteVideo } from '@/lib/images';

/** Fraction of the player that must be on screen before it plays. */
const VISIBILITY_THRESHOLD = 0.4;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Muted, inline job-site video that plays while it is on screen and pauses as
 * soon as it scrolls away — resuming from the same position rather than
 * restarting. Playback is never forced: if the viewer pauses it by hand, or has
 * asked for reduced motion, scrolling back into view leaves it paused.
 */
export default function JobSiteVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Set once the viewer pauses deliberately, so scrolling never overrides them. */
  const pausedByViewer = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay only survives if the element really is muted at play() time.
    video.muted = true;

    const attemptPlay = () => {
      if (pausedByViewer.current || prefersReducedMotion()) return;
      // Browsers reject autoplay in plenty of legitimate cases (data saver,
      // battery saver, low power mode). Staying quiet is the correct response.
      void video.play().catch(() => undefined);
    };

    if (typeof IntersectionObserver === 'undefined') {
      attemptPlay();
      return;
    }

    // A single threshold keeps `isIntersecting` and the visibility rule in step:
    // it flips true exactly when the player crosses VISIBILITY_THRESHOLD.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            attemptPlay();
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { threshold: VISIBILITY_THRESHOLD },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausedByViewer.current = false;
      void video.play().catch(() => undefined);
    } else {
      pausedByViewer.current = true;
      video.pause();
    }
  }, []);

  const toggleMuted = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-card border border-white/10 shadow-lift">
      <video
        ref={videoRef}
        className="block aspect-video w-full bg-burgundy-900 object-cover"
        poster={siteVideo.poster.src}
        preload="none"
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-label={siteVideo.description}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={siteVideo.src} type={siteVideo.type} />
        {/* Fallback for browsers that will not play the file at all. */}
        {siteVideo.description}
      </video>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause the job site video' : 'Play the job site video'}
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 bg-burgundy-900/80 text-cream backdrop-blur-sm transition hover:border-gold hover:bg-burgundy-900"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={isMuted ? 'Unmute the job site video' : 'Mute the job site video'}
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 bg-burgundy-900/80 text-cream backdrop-blur-sm transition hover:border-gold hover:bg-burgundy-900"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
