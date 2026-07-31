"use client";

import { PencilRuler } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#06081f]">

      <PencilRuler
        size={64}
        className="text-cyan-400 animate-bounce"
      />

      <p className="mt-6 text-white tracking-[5px]">
        Preparing ...
      </p>

    </div>
  );
}