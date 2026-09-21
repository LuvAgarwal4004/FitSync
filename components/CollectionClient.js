"use client";

import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import SmartLink from "./SmartLink";
import Image from "next/image";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";

export default function CollectionClient({
  products,
  collectionId,
}) {
  const [maxPrice, setMaxPrice] = useState(5000);

  // FILTER PRODUCTS
  const filteredProducts = products.filter(
    product => Number(product.price) <= maxPrice
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </div>
          </aside>

          {/* Products */}
          <section className="flex-1">
            <div className="lg:hidden">
              <MobileFilterDrawer
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </div>
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Collection
                </h1>

                <p className="text-gray-500 mt-2">
                  {filteredProducts.length} Product
                  {filteredProducts.length !== 1 && "s"}
                </p>
              </div>

            </div>

            {filteredProducts.length === 0 ? (

              <div className="bg-white rounded-3xl border shadow-sm py-20 text-center">

                <div className="text-6xl mb-5">
                  😕
                </div>

                <h2 className="text-2xl font-bold">
                  No Products Found
                </h2>

                <p className="text-gray-500 mt-2">
                  Try increasing the price range.
                </p>

              </div>

            ) : (

              <div
                className="
              grid
              grid-cols-2
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-5
              md:gap-7
            "
              >

                {filteredProducts.map((product) => (

                  <SmartLink
                    key={product._id}
                    href={`/ProductDetailColl/${collectionId}-${product.sequence}`}
                  >

                    <div
                      className="
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    border
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-2
                    transition-all
                    duration-300
                    group
                    h-full
                  "
                    >

                      {/* Image */}

                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">

                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="
                        object-cover
                        group-hover:scale-110
                        transition-transform
                        duration-500
                      "
                        />

                        {product.isDiscount && (

                          <span
                            className="
                          absolute
                          top-3
                          left-3
                          bg-red-500
                          text-white
                          text-xs
                          font-semibold
                          px-3
                          py-1
                          rounded-full
                          shadow
                        "
                          >
                            {product.discountPercent}% OFF
                          </span>

                        )}

                      </div>

                      {/* Content */}

                      <div className="p-4 md:p-5">

                        <h3
                          className="
                        font-semibold
                        text-gray-900
                        text-sm
                        md:text-lg
                        line-clamp-2
                        min-h-[48px]
                      "
                        >
                          {product.title}
                        </h3>

                        <div className="mt-4">

                          {product.isDiscount ? (

                            <>

                              <p className="text-gray-400 line-through text-sm">
                                ₹{product.price}
                              </p>

                              <p className="text-green-600 font-bold text-xl">
                                ₹{product.discountedPrice}
                              </p>

                            </>

                          ) : (

                            <p className="text-green-600 font-bold text-xl">
                              ₹{product.price}
                            </p>

                          )}

                        </div>

                      </div>

                    </div>

                  </SmartLink>

                ))}

              </div>

            )}

          </section>

        </div>

      </div>

    </div>
  );
}