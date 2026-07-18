"use client";

/* Shared scroll-scrub film mechanics (used by the homepage Opener and the
   per-property PropertyScrub hero):
     - XHR blob fetch with real download progress
     - <video> element creation appended into a container once decodable
     - rAF loop lerping video.currentTime toward a scroll-driven target
     - single-fire failure path (bad status / error / ~9s timeout)
     - full teardown (abort, rAF cancel, video detach, blob revoke)

   `startFilmScrub` is the imperative core, callable from inside any effect;
   `useFilmScrub` is a thin React hook wrapper around it. */

import { useEffect, useRef, type RefObject } from "react";

export interface FilmScrubOptions {
  /** Absolute or site-relative URL of the film. */
  src: string;
  /** Where to append the <video> once it can render frames. */
  container: () => HTMLElement | null;
  /** Download progress, 0..1 (only when length is computable). */
  onProgress?: (p: number) => void;
  /** Film decoded and appended; scrub loop is running. */
  onReady?: (video: HTMLVideoElement, duration: number) => void;
  /** Fetch failed / non-200 / decode error / timeout. Fires at most once,
      never after ready, never after destroy. */
  onFail?: () => void;
  /** Safety timeout before onFail. Default 9000ms. */
  timeoutMs?: number;
  /** Per-frame lerp factor toward the target time. Default 0.22. */
  lerp?: number;
}

export interface FilmScrub {
  /** Desired playback position (seconds); the rAF loop eases toward it. */
  setTargetTime(t: number): void;
  /** Video duration once ready, else 0. Truthiness doubles as "ready". */
  duration(): number;
  ready(): boolean;
  video(): HTMLVideoElement | null;
  destroy(): void;
}

export function startFilmScrub(opts: FilmScrubOptions): FilmScrub {
  const lerp = opts.lerp ?? 0.22;
  let video: HTMLVideoElement | null = null;
  let videoDuration = 0;
  let targetTime = 0;
  let raf: number | null = null;
  let blobUrl: string | null = null;
  let aborted = false;
  let failed = false;
  let xhr: XMLHttpRequest | null = null;
  let safetyTimer: ReturnType<typeof setTimeout> | null = null;

  const fail = () => {
    if (aborted || failed || videoDuration) return;
    failed = true;
    opts.onFail?.();
  };

  const startScrubLoop = () => {
    const step = () => {
      if (!video) return;
      const delta = targetTime - video.currentTime;
      if (Math.abs(delta) > 0.02 && !video.seeking) {
        try {
          video.currentTime = video.currentTime + delta * lerp;
        } catch {
          /* scrub can race a seek; skip this frame */
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  xhr = new XMLHttpRequest();
  xhr.open("GET", opts.src, true);
  xhr.responseType = "blob";
  xhr.onprogress = (e) => {
    if (!e.lengthComputable) return;
    opts.onProgress?.(e.loaded / e.total);
  };
  xhr.onload = () => {
    if (aborted || !xhr || xhr.status !== 200) {
      fail();
      return;
    }
    blobUrl = URL.createObjectURL(xhr.response as Blob);
    video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "auto";
    video.src = blobUrl;
    video.addEventListener(
      "loadeddata",
      () => {
        if (aborted || !video) return;
        videoDuration = video.duration || 12;
        opts.container()?.appendChild(video);
        video.currentTime = 0.001;
        startScrubLoop();
        opts.onReady?.(video, videoDuration);
      },
      { once: true }
    );
    video.addEventListener("error", fail, { once: true });
    video.load();
  };
  xhr.onerror = fail;
  xhr.send();
  /* safety: never hold the page hostage */
  safetyTimer = setTimeout(fail, opts.timeoutMs ?? 9000);

  return {
    setTargetTime(t: number) {
      targetTime = t;
    },
    duration() {
      return videoDuration;
    },
    ready() {
      return videoDuration > 0;
    },
    video() {
      return video;
    },
    destroy() {
      aborted = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      if (xhr) {
        try {
          xhr.abort();
        } catch {
          /* already settled */
        }
      }
      if (raf) cancelAnimationFrame(raf);
      if (video) {
        try {
          video.pause();
          video.removeAttribute("src");
          video.load();
          video.remove();
        } catch {
          /* detached */
        }
        video = null;
      }
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    }
  };
}

/** React wrapper: runs startFilmScrub while `enabled` (restarting on src
    change) and returns a ref to the live handle. Callbacks are kept in refs
    so their identity never restarts the film. */
export function useFilmScrub(
  enabled: boolean,
  options: FilmScrubOptions
): RefObject<FilmScrub | null> {
  const handleRef = useRef<FilmScrub | null>(null);
  const optsRef = useRef(options);
  optsRef.current = options;
  const src = options.src;

  useEffect(() => {
    if (!enabled || !src) return;
    const scrub = startFilmScrub({
      src,
      container: () => optsRef.current.container(),
      onProgress: (p) => optsRef.current.onProgress?.(p),
      onReady: (v, dur) => optsRef.current.onReady?.(v, dur),
      onFail: () => optsRef.current.onFail?.(),
      timeoutMs: optsRef.current.timeoutMs,
      lerp: optsRef.current.lerp
    });
    handleRef.current = scrub;
    return () => {
      scrub.destroy();
      handleRef.current = null;
    };
  }, [enabled, src]);

  return handleRef;
}
