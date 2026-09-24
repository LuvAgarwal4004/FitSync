import ProductZoom from "@/components/ProductZoom";
import FilterSidebar from "@/components/FilterSidebar";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import AddToCartButton from "@/components/AddToCartButton";


export default async function ProductPage({ params }) {
  const { id } = await params;

  // "cap-1"
  const [collectionId, seq] = id.split("-");

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?collectionId=${collectionId}`
  );
  const products = await res.json();

  const trend = products.find(
    p => p.sequence === Number(seq)
  );
  const displayPrice =
    trend.isDiscount
      ? Number(trend.discountedPrice)
      : Number(trend.price);

  const taxableAmount =
    displayPrice / 1.18;

  const gstAmount =
    displayPrice - taxableAmount;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* <FilterSidebar /> */}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* IMAGE */}

            <div className="bg-white rounded-3xl border shadow-lg p-4 lg:p-6">
              <ProductZoom image={trend.image} />
            </div>

            {/* PRODUCT DETAILS */}

            <div className="space-y-6 lg:sticky lg:top-8">

              <div className="bg-white rounded-3xl shadow-lg border p-8">

                <h1 className="text-3xl font-bold text-gray-900">
                  {trend.title}
                </h1>

                {trend.isDiscount ? (

                  <div className="mt-6">

                    <div className="flex items-center gap-4 flex-wrap">

                      <p className="text-gray-400 line-through text-xl">
                        ₹{trend.price}
                      </p>

                      <p className="text-4xl font-bold text-green-600">
                        ₹{trend.discountedPrice}
                      </p>

                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {trend.discountPercent}% OFF
                      </span>

                    </div>

                    <div className="mt-4 text-sm text-gray-600 space-y-1">

                      <p>Inclusive of GST</p>

                      <p>
                        Exclusive of GST :
                        <span className="font-semibold ml-1">
                          ₹{taxableAmount.toFixed(2)}
                        </span>
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="mt-6">

                    <p className="text-4xl font-bold text-green-600">
                      ₹{trend.price}
                    </p>

                    <div className="mt-4 text-sm text-gray-600 space-y-1">

                      <p>Inclusive of GST</p>

                      <p>
                        Exclusive of GST :
                        <span className="font-semibold ml-1">
                          ₹{taxableAmount.toFixed(2)}
                        </span>
                      </p>

                    </div>

                  </div>

                )}

                <div className="mt-8">

                  <AddToCartButton
                    id1={collectionId}
                    id2={seq}
                    image={trend.image}
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="bg-white rounded-3xl border shadow-lg p-8">

                <h2 className="text-2xl font-bold mb-4">
                  Description
                </h2>

                <p className="leading-8 text-gray-600">
                  {trend.description}
                </p>

              </div>

              {/* SPECIFICATIONS */}

              <div className="bg-white rounded-3xl border shadow-lg p-8">

                <h2 className="text-2xl font-bold mb-4">
                  Specifications
                </h2>

                <p className="whitespace-pre-wrap leading-8 text-gray-700">
                  {trend.specifications}
                </p>

              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}