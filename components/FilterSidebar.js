"use client";

export default function FilterSidebar({
  maxPrice,
  setMaxPrice,
}) {
  return (
    <aside
      className="
      hidden
      lg:block

      w-72

      bg-white
      rounded-3xl
      border
      shadow-md

      p-6

      sticky
      top-6
      h-fit
    "
    >
      <h2 className="text-2xl font-bold mb-8">
        Filters
      </h2>

      <div>

        <div className="flex justify-between items-center mb-4">

          <h3 className="font-semibold">
            Price Range
          </h3>

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
          cursor-pointer
        "
        />

        <div className="flex justify-between mt-3 text-sm text-gray-400">
          <span>₹0</span>
          <span>₹5000</span>
        </div>

      </div>

    </aside>
  );
}