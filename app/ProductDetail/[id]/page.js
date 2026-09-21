import ProductZoom from "@/components/ProductZoom";
import FilterSidebar from "@/components/FilterSidebar";
import MobileFilterDrawer from "@/components/MobileFilterDrawer";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`, {
    cache: "no-store"
  });
  const trend = await res.json();
  if (!trend) {
    return <div>Product not found</div>;
  }
  const displayPrice =
    trend.isDiscount
      ? Number(trend.discountedPrice)
      : Number(trend.price);

  const taxableAmount =
    displayPrice / 1.18;

  const gstAmount =
    displayPrice - taxableAmount;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex">
      {/* <FilterSidebar /> */}

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

          {/* <div className="mb-4">
            <MobileFilterDrawer />
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* LEFT: Image + Zoom */}
            <div
              className="
w-full
bg-white
rounded-3xl
shadow-lg
border
p-4 sm:p-6
flex
justify-center
items-center
"
            >
              <ProductZoom image={trend.image} />
            </div>

            {/* RIGHT: Product Info */}
            <div
              className="
bg-white
rounded-3xl
shadow-lg
border
p-8
space-y-7
lg:sticky
lg:top-8
h-fit
"
            >

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {trend.title}
              </h1>
              {trend.isDiscount ? (
                <div className="space-y-2">

                  <p className="line-through text-gray-400">
                    ₹{trend.price}
                  </p>

                  <p className="
inline-flex
items-center
rounded-full
px-4
py-1.5
text-sm
font-semibold
text-white
bg-gradient-to-r
from-green-500
to-green-600
shadow-md
">
                    ₹{trend.discountedPrice}
                  </p>
                  <div
                    className="
bg-gray-50
rounded-2xl
border
p-4
space-y-1
"
                  >

                    <p className="text-sm text-gray-500">
                      Inclusive of GST
                    </p>

                    <p className="text-sm text-gray-600">
                      Exclusive of GST: ₹{taxableAmount.toFixed(2)}
                    </p>
                  </div>
                  {/* 
                  <p className="text-sm text-gray-600">
                    GST (18%): ₹{gstAmount.toFixed(2)}
                  </p> */}

                  <span
                    className="
      inline-block
      bg-gradient-to-r
from-red-500
to-red-600
shadow-md
font-semibold
      text-white
      px-3
      py-1
      rounded-full
      mt-2
      text-sm
    "
                  >
                    {trend.discountPercent}% OFF
                  </span>

                </div>
              ) : (<>
                <p className="text-xl sm:text-2xl text-green-600 font-semibold">
                  ₹{trend.price}
                </p>
                <div
                  className="
bg-gray-50
rounded-2xl
border
p-4
space-y-1
"
                >
                  <p className="text-sm text-gray-500">
                    Inclusive of GST
                  </p>

                  <p className="text-sm text-gray-600">
                    Exclusive of GST: ₹{taxableAmount.toFixed(2)}
                  </p>
                </div>
              </>
              )}

              <div className="rounded-2xl border bg-white p-6">

                <h2 className="text-xl font-bold mb-3">
                  Description
                </h2>

                <p className="leading-8 text-gray-600">
                  {trend.description}
                </p>

              </div>
              <div
                className="
bg-gradient-to-br
from-white
to-gray-50
rounded-2xl
border
p-6
"
              >

                <h2 className="font-bold text-xl mb-3">
                  Specifications
                </h2>

                <p className="leading-8 text-gray-700 whitespace-pre-wrap">
                  {trend.specifications}
                </p>

              </div>
              <div className="pt-4">

                <AddToCartButton id2={trend._id} image={trend.image} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}