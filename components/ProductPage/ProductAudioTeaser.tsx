"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type WaveSurfer from "wavesurfer.js";
import type { Audio } from "@/types/products";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ProductAudioTeaser({ audio }: { audio: Audio | null }) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!audio || !waveformRef.current) return;

    let cancelled = false;
    setHasError(false);

    // Proxy through our own origin: the backend media host doesn't send
    // CORS headers, which blocks wavesurfer's fetch/decode of the file directly.
    const proxiedUrl = `/api/audio?src=${encodeURIComponent(audio.url)}`;

    import("wavesurfer.js").then(({ default: WaveSurfer }) => {
      if (cancelled || !waveformRef.current) return;

      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "rgba(243, 243, 243, 0.25)",
        progressColor: "#f3f3f3",
        cursorWidth: 0,
        barWidth: 2,
        barGap: 2,
        barRadius: 2,
        height: 40,
        normalize: true,
        url: proxiedUrl,
      });

      wavesurferRef.current = wavesurfer;
      wavesurfer.on("ready", () => {
        setIsReady(true);
        setDuration(wavesurfer.getDuration());
      });
      wavesurfer.on("play", () => setIsPlaying(true));
      wavesurfer.on("pause", () => setIsPlaying(false));
      wavesurfer.on("finish", () => setIsPlaying(false));
      wavesurfer.on("timeupdate", (time) => setCurrentTime(time));
      wavesurfer.on("error", () => {
        if (!cancelled) setHasError(true);
      });
    });

    return () => {
      cancelled = true;
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
      setIsReady(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [audio]);

  const handleToggleMute = () => {
    const wavesurfer = wavesurferRef.current;
    if (!wavesurfer) return;
    const next = !isMuted;
    wavesurfer.setMuted(next);
    setIsMuted(next);
  };

  if (!audio) return null;

  return (
    <div className="mb-7 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#111111]">
        {audio.cover ? (
          <Image
            src={audio.cover}
            alt={audio.title}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => wavesurferRef.current?.playPause()}
        disabled={!isReady}
        aria-label={isPlaying ? "توقف پخش آهنگ" : "پخش آهنگ"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ms-0.5"
          >
            <path d="M6 4l14 8-14 8V4z"></path>
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[11px] tracking-wide text-muted-foreground">
          ترانه الهام‌بخش این محصول
        </p>
        <p className="truncate text-sm font-bold text-foreground">
          {audio.title}
          <span className="mx-1.5 text-muted-foreground">·</span>
          <span className="font-normal text-muted-foreground">
            {audio.artist}
          </span>
        </p>
        <div ref={waveformRef} className="mt-2 [&_wave]:overflow-visible!" />
        {hasError ? (
          <p className="mt-1.5 text-[11px] text-destructive">
            پخش آهنگ در حال حاضر امکان‌پذیر نیست
          </p>
        ) : (
          <div
            style={{ direction: "ltr" }}
            className="mt-1.5 flex items-center justify-between text-[11px] tabular-nums text-muted-foreground"
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggleMute}
        disabled={!isReady}
        aria-label={isMuted ? "فعال کردن صدا" : "قطع صدا"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.42.05-.63z" />
            <path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.94 8.94 0 0 0 21 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
            <path d="M4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.95 8.95 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4-.91 7-4.49 7-8.77s-3-7.86-7-8.77z" />
          </svg>
        )}
      </button>
    </div>
  );
}
