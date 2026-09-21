"use client";

import { useState } from "react";

export default function MobileFilterDrawer({
  maxPrice,
  setMaxPrice,
}) {

  const [open, setOpen] = useState(false);

  return (
    <>

      {/* Open Button */}

      <button
        onClick={() => setOpen(true)}
        className="
          lg:hidden

          w-full

          bg-white

          border

          rounded-2xl

          shadow-sm

          py-3

          font-semibold

          mb-6
        "
      >
        🔍 Filters
      </button>

      {/* Overlay */}

      <div
        onClick={() => setOpen(false)}
        className={`
          fixed
          inset-0
          bg-black/40
          z-40

          transition-opacity

          ${open
            ? "opacity-100 visible"
            : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}

      <div
        className={`
          fixed

          bottom-0
          left-0
          right-0

          bg-white

          rounded-t-3xl

          z-50

          p-6

          transition-transform
          duration-300

          ${open
            ? "translate-y-0"
            : "translate-y-full"}
        `}
      >

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-2xl font-bold">
            Filters
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-2xl"
          >
            ✕
          </button>

        </div>

        <div>

          <div className="flex justify-between mb-4">

            <span className="font-semibold">
              Price
            </span>

            <span
              className="
              bg-black
              text-white
              px-3
              py-1
              rounded-full
              text-sm
            "
            >
              ₹{maxPrice}
            </span>

          </div>

          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(Number(e.target.value))
            }
            className="
            w-full
            accent-blue-600
          "
          />

          <div className="flex justify-between mt-3 text-sm text-gray-400">

            <span>₹0</span>

            <span>₹5000</span>

          </div>

        </div>

        <button
          onClick={() => setOpen(false)}
          className="
            mt-8

            w-full

            bg-blue-600

            text-white

            rounded-xl

            py-3

            font-semibold
          "
        >
          Apply Filters
        </button>

      </div>

    </>
  );
}