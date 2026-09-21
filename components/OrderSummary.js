"use client";
import React, { useEffect, useState } from 'react'
import AdressCard from './AdressCard'
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { setGlobalLoading } from './RouteLoader';
import { useSession } from "next-auth/react";
// import { useCheckout } from "@/context/CheckoutContext";

const OrderSummary = () => {
  const { cart } = useCart();
  const [count, setCount] = useState(1);
  const [address, setAddress] = useState(null);
  const router = useRouter();
  const [allProducts, setAllProducts] = useState([]);
  const { data: session } = useSession();
  // const {
  //   setCheckoutStep
  // } = useCheckout();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setAllProducts(data);
    };

    fetchProducts();
  }, []);


  useEffect(() => {

    if (!session?.user?.email) return;

    const savedAddress =
      localStorage.getItem(
        `address-${session.user.email}`
      );

    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    }

  }, [session]);
  if (!allProducts.length) return null;
  const trendItems = cart
    .filter(item => !item.id.includes("-"))
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
    .filter(item => item.id.includes("-"))
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


  // const subtotal =
  //   trendItems.reduce((acc, item) => acc + getPrice(item.finalPrice) * item.qty, 0) +
  //   collectionItems.reduce((acc, item) => acc + getPrice(item.finalPrice) * item.qty, 0);
  const subtotal =
    trendItems.reduce((acc, item) => {

      const price =
        item.isDiscount
          ? Number(item.discountedPrice)
          : Number(item.price);

      return acc + price * item.qty;

    }, 0)

    +

    collectionItems.reduce((acc, item) => {

      const price =
        item.isDiscount
          ? Number(item.discountedPrice)
          : Number(item.price);

      return acc + price * item.qty;

    }, 0);
  const GST_RATE = 18;

  const taxableAmount =
    subtotal / (1 + GST_RATE / 100);

  // const gstAmount =
  //   subtotal * GST_RATE / 100;

  const gstAmount =
    subtotal - taxableAmount;
  const isWestBengal =
    address?.state?.toLowerCase() ===
    "west bengal";
  const cgst =
    isWestBengal
      ? gstAmount / 2
      : 0;

  const sgst =
    isWestBengal
      ? gstAmount / 2
      : 0;

  const igst =
    isWestBengal
      ? 0
      : gstAmount;
  const originalAmount =
    trendItems.reduce(
      (acc, item) =>
        acc + Number(item.price) * item.qty,
      0
    )
    +
    collectionItems.reduce(
      (acc, item) =>
        acc + Number(item.price) * item.qty,
      0
    );

  const discountAmount =
    originalAmount - subtotal;

  const shipping = subtotal >= 500 ? 0 : 20;
  const total = subtotal + shipping;

  return (
    <div>
      <div
        className="
bg-white
rounded-3xl
border
shadow-md
p-6
mb-8
"
      >
        <h2 className="text-xl font-bold mb-5">
          Delivery Address
        </h2>
        <AdressCard address={address} />

      </div>

      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-14">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white
           sm:text-2xl">Shopping Cart</h2>

          <div
            className="
mt-6
sm:mt-8
flex
flex-col
lg:flex-row
gap-8
items-start
"
          >
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="space-y-6">

                {/* Trend Items */}
                {trendItems.map(item => (
                  <div key={item._id} className="border p-4 rounded-lg">
                    <div className="
flex
flex-col
sm:flex-row
gap-5
items-center
justify-between
">

                      <img
                        src={item.image}
                        className="
w-24
h-24
sm:w-28
sm:h-28
object-cover
rounded-xl
border
flex-shrink-0
"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold line-clamp-2">
                          {item.title}
                        </p>

                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* <div
className="
text-center
sm:text-right
min-w-[110px]
"
>
                        <p>Qty: {item.qty}</p>
                        <p className="font-bold">
                          ₹{item.price * item.qty}
                        </p>
                      </div> */}
                      <div className="
text-center
sm:text-right
min-w-[100px]
">

                        <p>Qty: {item.qty}</p>

                        {
                          item.isDiscount ? (
                            <>
                              <p className="line-through text-gray-400">
                                ₹{item.price}
                              </p>

                              <p className="text-green-600 text-lg font-bold">
                                ₹{item.discountedPrice}
                              </p>
                            </>
                          ) : (
                            <p className="font-bold">
                              ₹{item.price}
                            </p>
                          )
                        }

                      </div>
                    </div>
                  </div>
                ))}

                {/* Collection Items */}
                {collectionItems.map(item => (
                  <div key={item.cartId} className="border p-4 rounded-lg">
                    <div className="
flex
flex-col
sm:flex-row
gap-5
items-center
justify-between
">

                      <img
                        src={item.image}
                        className="
w-24
h-24
sm:w-28
sm:h-28
object-cover
rounded-xl
border
flex-shrink-0
"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold line-clamp-2">
                          {item.title}
                        </p>

                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* <div
className="
text-center
sm:text-right
min-w-[110px]
"
>
                        <p>Qty: {item.qty}</p>
                        <p className="font-bold">
                          ₹{item.price * item.qty}
                        </p>
                      </div> */}
                      <div
                        className="
text-center
sm:text-right
min-w-[110px]
"
                      >

                        <p>Qty: {item.qty}</p>

                        {
                          item.isDiscount ? (
                            <>
                              <p className="line-through text-gray-400">
                                ₹{item.price}
                              </p>

                              <p className="text-green-600 text-lg font-bold">
                                ₹{item.discountedPrice}
                              </p>

                              <p className="text-red-500 text-sm">
                                {item.discountPercent}% OFF
                              </p>
                            </>
                          ) : (
                            <p className="font-bold">
                              ₹{item.price}
                            </p>
                          )
                        }

                      </div>

                    </div>
                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT SIDE (UNCHANGED UI) */}
            <div className="mt-6 lg:mt-0 w-full lg:sticky
lg:top-8 lg:max-w-md space-y-4">

              <div className="rounded-lg border p-6 shadow-sm dark:bg-gray-800 space-y-4">

                <p className="text-xl font-semibold dark:text-white">
                  Order Summary
                </p>
                <div className="flex justify-between">
                  <span>Original Amount</span>
                  <span>₹{originalAmount}</span>
                </div>

                <div className="flex justify-between text-red-600">
                  <span>Discount Off</span>
                  <span>- ₹{discountAmount}</span>
                </div>
                {/* <span>Taxable Amount</span>
                  <span>₹{taxableAmount.toFixed(2)}</span> */}


                {subtotal > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {cgst > 0 && (
                      <div className="flex justify-between">
                        <span>CGST (9%)</span>
                        <span>₹{cgst.toFixed(2)}</span>
                      </div>
                    )}

                    {sgst > 0 && (
                      <div className="flex justify-between">
                        <span>SGST (9%)</span>
                        <span>₹{sgst.toFixed(2)}</span>
                      </div>
                    )}

                    {igst > 0 && (
                      <div className="flex justify-between">
                        <span>IGST (18%)</span>
                        <span>₹{igst.toFixed(2)}</span>
                      </div>
                    )}

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
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {/* Pay button */}
                <button
                  onClick={() => {
                    if (typeof setGlobalLoading === "function") {
                      setGlobalLoading(true);
                    }
                    setTimeout(async () => {
                      await fetch(
                        "/api/checkout/update-step",
                        {

                          method: "POST",

                          headers: {
                            "Content-Type":
                              "application/json"
                          },

                          body: JSON.stringify({
                            step: 4
                          })

                        }
                      );

                      router.push("/checkout?step=4");

                      setTimeout(() => {
                        setGlobalLoading(false); // ✅ STOP LOADER AFTER PAGE LOAD FEEL
                      }, 800);
                    }, 200);
                  }}
                  className="w-full mt-4 bg-black text-white py-4
rounded-xl
font-semibold
text-lg hover:bg-gray-800 
                transition"
                >
                  Proceed to Payment
                </button>

              </div>

            </div>


          </div>
        </div>
      </section>
    </div>
  )
}

export default OrderSummary
