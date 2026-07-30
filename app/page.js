"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full text-center">

        {/* Heading */}
        <h1 className="text-4xl
sm:text-5xl
lg:text-6xl md:text-6xl font-extrabold text-white drop-shadow-lg">
          Campus Stationery Hub
        </h1>

        <p className="mt-5 text-lg md:text-xl text-white/90">
          Buy • Sell • Rent stationery with fellow students.
        </p>

        {/* Buttons */}
        <div className="mt-10 md:mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Sell */}
          <Link href="/sell">
            <div className="group cursor-pointer rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:bg-green-500">
              <div className="text-6xl mb-5 transition group-hover:scale-125">
                📚
              </div>

              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-white">
                Want to Sell Stationery?
              </h2>

              <p className="mt-3 text-gray-600 group-hover:text-white">
                Upload your stationery and connect with buyers instantly.
              </p>
            </div>
          </Link>

          {/* Buy */}
          <Link href="/buy">
            <div className="group cursor-pointer rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:bg-blue-500">
              <div className="text-6xl mb-5 transition group-hover:scale-125">
                🛒
              </div>

              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-white">
                Want to Buy Stationery?
              </h2>

              <p className="mt-3 text-gray-600 group-hover:text-white">
                Browse products uploaded by other students.
              </p>
            </div>
          </Link>

          {/* Rent */}
          <Link href="/rent">
            <div className="group cursor-pointer rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:bg-purple-500">
              <div className="text-6xl mb-5 transition group-hover:scale-125">
                🤝
              </div>

              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-white">
                Want to Rent Stationery?
              </h2>

              <p className="mt-3 text-gray-600 group-hover:text-white">
                Request items for a specific time and budget.
              </p>
            </div>
          </Link>
          {/* Rent Your Stationery */}
          <Link href="/rent-requests">
            <div className="group cursor-pointer rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:bg-orange-500">
              <div className="text-6xl mb-5 transition group-hover:scale-125">
                📦
              </div>

              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-white">
                Rent Your Stationery
              </h2>

              <p className="mt-3 text-gray-600 group-hover:text-white">
                View students requesting stationery and rent yours to earn money.
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <p className="mt-16 text-white/80 text-sm">
          Helping students share stationery quickly, affordably, and responsibly.
        </p>

      </div>
    </main>
  );
}