"use client";

import { useState } from "react";

export default function ProductZoom({ image }) {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState("50% 50%");

  const handleMouseMove = (e) => {
    // Disable zoom on touch devices / small screens
    if (window.innerWidth < 1024) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition(`${x}% ${y}%`);
  };

  return (
    <div className="relative w-full max-w-[520px] mx-auto">

      {/* Main Image */}

      <div
        className="
          w-full
          aspect-[4/5]
          rounded-2xl
          border
          bg-white
          overflow-hidden
          shadow-md
          lg:cursor-crosshair
        "
        onMouseEnter={() => {
          if (window.innerWidth >= 1024) {
            setShowZoom(true);
          }
        }}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={image}
          alt="Product"
          className="
            w-full
            h-full
            object-contain
            select-none
            pointer-events-none
            p-4
          "
          draggable={false}
        />
      </div>

      {/* Zoom Panel (Desktop Only) */}

      {showZoom && (
        <div
          className="
            hidden
            lg:block

            absolute
            top-0
            left-full
            ml-6

            w-[320px]
            h-[400px]

            rounded-2xl
            border
            bg-white
            shadow-2xl
            overflow-hidden
            z-50
          "
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: zoomPosition,
            backgroundSize: "250%",
          }}
        />
      )}
    </div>
  );
}