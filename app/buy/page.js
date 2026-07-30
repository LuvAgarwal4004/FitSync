"use client";

import { useEffect, useMemo, useState } from "react";

export default function BuyPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Could not load products right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = [...products];

    if (q) {
      result = result.filter((item) => {
        const values = [
          item.productName,
          item.studentName,
          item.branch,
          item.year,
          item.condition,
          item.description,
          item.price,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return values.includes(q);
      });
    }

    if (condition) {
      result = result.filter(
        (item) =>
          String(item.condition || "").toLowerCase() ===
          condition.toLowerCase()
      );
    }

    if (minPrice !== "") {
      result = result.filter(
        (item) => Number(item.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (item) => Number(item.price) <= Number(maxPrice)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [products, search, minPrice, maxPrice, condition, sortBy]);

  // const getWhatsAppLink = (phone, productName, studentName) => {
  //   const digits = String(phone || "").replace(/\D/g, "");
  //   const message = `Hi ${studentName || "there"}, I saw your stationery listing for "${
  //     productName || "an item"
  //   }" on the website. Is it still available?`;
  //   return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  // };
  const getWhatsAppLink = (phone, productName, studentName) => {
    const digits = String(phone || "").replace(/\D/g, "");
    const message = `Hi ${studentName || "there"}, I saw your stationery listing for "${productName || "an item"}" on the website. Is it still available?`;
    return `https://wa.me/91${digits}?text=${encodeURIComponent(message)}`;
  };
  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCondition("");
    setSortBy("newest");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Buy Stationery
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
            Browse stationery items posted by students and contact the seller
            directly on WhatsApp.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, owner name..."
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-white/30 focus:bg-white/15 md:col-span-2"
            />

            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-white/30 focus:bg-white/15"
            />

            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-white/30 focus:bg-white/15"
            />

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:bg-white/15"
            >
              <option value="">All conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-white/30 focus:bg-white/15"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl bg-white/15 px-4 py-3 font-semibold text-white transition hover:bg-white/25 md:col-span-2 xl:col-span-1"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur-md">
            <p className="text-lg font-medium">Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-400/30 bg-red-500/15 p-8 text-center text-red-100 backdrop-blur-md">
            <p className="text-lg font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/10 p-10 text-center backdrop-blur-md">
            <p className="text-2xl font-semibold">No stationery listings found.</p>
            <p className="mt-2 text-white/75">
              Try changing the filters or search query.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {product.productName}
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Posted by{" "}
                      <span className="font-medium text-white">
                        {product.studentName}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-white/60">Branch</p>
                      <p className="font-medium text-white">
                        {product.branch || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-white/60">Year</p>
                      <p className="font-medium text-white">
                        {product.year || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-white/60">Condition</p>
                      <p className="font-medium text-white">
                        {product.condition || "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-3">
                      <p className="text-white/60">Price</p>
                      <p className="font-semibold text-emerald-300">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm leading-6 text-white/85">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={getWhatsAppLink(
                        product.whatsapp,
                        product.productName,
                        product.studentName
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-600"
                    >
                      WhatsApp Seller
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}