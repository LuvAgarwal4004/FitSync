"use client";

import { Dumbbell } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">

      {/* Ambient background glow */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Loader */}
      <div className="relative flex flex-col items-center">

        {/* Outer rotating ring */}
        <div className="absolute h-28 w-28 animate-spin rounded-full border-2 border-transparent border-t-violet-400 border-r-blue-400" />

        {/* Inner circle */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl shadow-violet-500/20 backdrop-blur-xl">

          <Dumbbell
            size={38}
            strokeWidth={2.2}
            className="text-violet-400 animate-pulse"
          />

        </div>

        {/* Brand */}
        <h2 className="mt-8 text-xl font-bold tracking-wide text-white">
          Fit<span className="text-violet-400">Sync</span>
        </h2>

        {/* Loading text */}
        <p className="mt-2 text-sm font-medium tracking-wider text-slate-400">
          Getting things ready...
        </p>

        {/* Progress dots */}
        <div className="mt-5 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
        </div>

      </div>
    </div>
  );
}