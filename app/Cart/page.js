"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setGlobalLoading } from "@/components/RouteLoader";
import Loading from "../loading";
import toast from "react-hot-toast";
import { useCheckout } from "@/context/CheckoutContext";

const Page = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // const {
  //   setCheckoutStep,
  //   setOrderCompleted
  // } = useCheckout();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
      } finally {
        setLoading(false); // ALWAYS stop loading
      }
    };

    fetchProducts();
  }, []);
  if (loading) return <Loading />;
  if (!allProducts.length) return <div>No products found</div>;

  const isCartEmpty = cart.length === 0;
  if (isCartEmpty) {
    return (
      <section className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-semibold">Your cart is empty 🛒</h2>
        <p className="text-gray-500 mt-2">Add something to get started</p>

        <button
          onClick={() => {
            if (typeof setGlobalLoading === "function") {
              setGlobalLoading(true);
            }
            router.push("/");
          }
          }
          className="mt-6 bg-black text-white px-6 py-2 rounded-lg"
        >
          Go Shopping
        </button>
      </section >
    );
  }

  const handleCheckout = async () => {

    // setOrderCompleted(false);

    // setCheckoutStep(2);

    if (typeof setGlobalLoading === "function") {
      setGlobalLoading(true);
    }

    // setTimeout(async () => {

    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        step: 2,
      }),
    });
    const data = await res.json();

    if (!res.ok) {

      setGlobalLoading(false);

      toast.error(
        data.error ||
        "Unable to start checkout"
      );

      return;
    }


    router.push("/checkout?step=2");

    setTimeout(() => {
      setGlobalLoading(false);
    }, 800);

    // }, 200);
  };

  //  Trend items (simple ids)

  const trendItems = cart
    .filter(item => !item.id?.includes("-"))
    .map(cartItem => {
      const product = allProducts.find(
        p => p._id === cartItem.id
      );

      return product
        ? { ...product, qty: cartItem.qty }
        : null;
    })
    .filter(Boolean);

  const collectionItems = cart
    .filter(item => item.id?.includes("-"))
    .map(cartItem => {
      const [collectionId, seq] = cartItem.id.split("-");

      const product = allProducts.find(
        p =>
          p.collectionId === collectionId &&
          p.sequence === Number(seq)
      );

      return product
        ? {
          ...product,
          cartId: cartItem.id,
          qty: cartItem.qty,
        }
        : null;
    })
    .filter(Boolean);

  const getPrice = (price) => Number(price);
  const originalAmount =
    trendItems.reduce(
      (acc, item) =>
        acc + item.price * item.qty,
      0
    )
    +
    collectionItems.reduce(
      (acc, item) =>
        acc + item.price * item.qty,
      0
    );
  const finalAmount =
    trendItems.reduce(
      (acc, item) => {
        const price =
          item.isDiscount
            ? Number(item.discountedPrice || item.price)
            : Number(item.price);

        return acc + price * item.qty;
      },
      0
    )
    +
    collectionItems.reduce(
      (acc, item) => {
        const price =
          item.isDiscount
            ? Number(item.discountedPrice || item.price)
            : Number(item.price);

        return acc + price * item.qty;
      },
      0
    );
  const discountOff =
    originalAmount -
    finalAmount;

  // subtotal
  // const subtotal =
  //   trendItems.reduce(
  //     (acc, item) => acc + getPrice(item.price) * item.qty,
  //     0
  //   ) +
  //   collectionItems.reduce(
  //     (acc, item) => acc + getPrice(item.price) * item.qty,
  //     0
  //   );
  const subtotal =
    finalAmount;
  const GST_RATE = 18;

  const taxableAmount =
    subtotal / (1 + GST_RATE / 100);

  // const gstAmount =
  //   subtotal * GST_RATE / 100;
  const gstAmount =
    subtotal - taxableAmount;

  const cgst =
    gstAmount / 2;

  const sgst =
    gstAmount / 2;

  const igst = 0;

  // fake shipping logic
  const shipping = subtotal === 0 ? 0 : (subtotal >= 500 ? 0 : 20);

  // final total
  const total = subtotal + shipping;


  return (
    <section className="bg-white py-8 dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4">

        <h2 className="text-xl font-semibold dark:text-white sm:text-2xl">
          Shopping Cart
        </h2>

        <div className="mt-6 lg:flex gap-8">

          {/* LEFT SIDE */}
          <div className="w-full lg:max-w-4xl space-y-6">

            {/*  TREND ITEMS */}
            {trendItems.map((item, index) => {

              const itemPrice =
                item.isDiscount
                  ? item.discountedPrice
                  : item.price;

              return (
                <div key={item._id} className="rounded-lg border p-4 shadow-sm dark:bg-gray-800">
                  <div
                    className="
    flex
    flex-col
    sm:flex-row
    sm:items-center
    gap-4
  "
                  >

                    <img
                      src={item.image}
                      className="
    w-full
    h-56
    object-contain
    rounded-lg

    sm:w-28
    sm:h-28

    lg:w-24
    lg:h-24
    lg:flex-shrink-0
  "
                    />

                    <div className="flex-1">
                      <p className="font-semibold hover:font-extrabold
                       hover:font-amber dark:text-white">{item.title}</p>
                    </div>

                    <div
                      className="
    flex
    flex-col
    gap-3

    sm:items-start

    lg:items-end
  "
                    >
                      <p className="font-bold dark:text-white">
                        ₹{itemPrice * item.qty}
                      </p>
                      <div className="flex items-center rounded-lg overflow-hidden">

                        <button
                          onClick={() => decreaseQty(String(item._id))}
                          className="px-3 py-1 bg-gray-400"
                        >
                          −
                        </button>

                        <span className="px-4">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => increaseQty(String(item._id))}
                          className="px-3 py-1 bg-gray-400"
                        >
                          +
                        </button>

                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(String(item._id))}
                      className="
    text-red-500
    font-medium

    sm:self-start

    lg:self-center
  "
                    >
                      Remove
                    </button>

                  </div>
                </div>
              )
            })}

            {/* COLLECTION ITEMS */}
            {collectionItems.map((item) => {

              const itemPrice =
                item.isDiscount
                  ? item.discountedPrice
                  : item.price;

              return (
                <div key={item.cartId} className="rounded-lg border p-4 shadow-sm dark:bg-gray-800">
                  <div
                    className="
    flex
    flex-col
    sm:flex-row
    sm:items-center
    gap-4
"
                  >

                    <img
                      src={item.image}
                      className="
      w-full
      h-56
      object-contain
      rounded-lg

      sm:w-28
      sm:h-28

      lg:w-24
      lg:h-24
      lg:flex-shrink-0
    "
                    />

                    {/* THIS IS IMPORTANT */}
                    <div className="flex-1">
                      <p className="font-semibold hover:font-extrabold hover:text-amber-500">
                        {item.title}
                      </p>
                    </div>

                    <div
                      className="
      flex
      flex-col
      gap-3

      sm:items-start

      lg:items-end
    "
                    >
                      <p className="font-bold">
                        ₹{itemPrice * item.qty}
                      </p>

                      <div className="flex items-center rounded-lg overflow-hidden">

                        <button
                          onClick={() => decreaseQty(item.cartId)}
                          className="px-3 py-1 bg-gray-400"
                        >
                          −
                        </button>

                        <span className="px-4">
                          {item.qty}
                        </span>

                        <button
                          onClick={() => increaseQty(item.cartId)}
                          className="px-3 py-1 bg-gray-400"
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="
      text-red-500
      font-medium

      sm:self-start

      lg:self-center
    "
                    >
                      Remove
                    </button>

                  </div>
                </div>
              )
            })}

          </div>

          {/* RIGHT SIDE (UNCHANGED UI) */}
          <div className="mt-6 lg:mt-0 w-full max-w-md space-y-4">

            <div className="rounded-lg border p-6 shadow-sm dark:bg-gray-800 space-y-4">

              <p className="text-xl font-semibold dark:text-white">
                Order Summary
              </p>

              {subtotal > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Original Amount</span>
                    <span>₹{originalAmount}</span>
                  </div>

                  <div className="flex justify-between text-red-600">
                    <span>Discount Off</span>
                    <span>- ₹{discountOff}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {subtotal >= 500
                        ? "🎉 You got FREE Shipping! 🚚"
                        : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Amount</span>
                    <span>₹{taxableAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>

                  {/* <div className="flex justify-between">
                    <span>SGST (9%)</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGST (9%)</span>
                    <span>₹{igst.toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Final Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{subtotal >= 500 ? (
                      <p className="text-green-600 font-medium text-sm">
                        🎉 You got FREE Shipping!
                      </p>
                    ) : (`₹${shipping}`)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div> */}
                </>
              )}

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Page;