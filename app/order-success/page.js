"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "../loading";
import SmartLink from "@/components/SmartLink";

export default function OrderSuccess() {
  const params = useSearchParams();
  const id = params.get("id");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/order/${id}`);
      const data = await res.json();
      setOrder(data.order);

    };

    if (id) fetchOrder();
  }, [id]);
  useEffect(() => {

    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handleBack = () => {

      window.history.pushState(
        null,
        "",
        window.location.href
      );

    };

    window.addEventListener(
      "popstate",
      handleBack
    );

    return () => {

      window.removeEventListener(
        "popstate",
        handleBack
      );

    };

  }, []);

  if (!order || !order.items) return <Loading />;
  // const subtotal = order.items.reduce(
  //   (acc, item) => acc + item.price * item.qty,
  //   0
  // );
  // const originalAmount =
  //   order.originalAmount;

  const discountAmount =
    order.discountAmount;

  const subtotal =
    order.subtotal;

  const shipping =
    order.shippingCost;

  const total =
    order.total;

  // const shipping = subtotal > 500 ? 0 : 20;

  // const total = subtotal + shipping;


  return (
    <div
      className="
min-h-screen
bg-gradient-to-br
from-slate-50
via-blue-50
to-indigo-50
px-4
sm:px-6
lg:px-8
py-8
"
    >

      <div
        className="
max-w-4xl
mx-auto
"
      >

        {/* <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Placed Successfully!
        </h1>

        <p className="mb-6">Order ID: {order._id}</p> */}
        <div className="text-center mb-10">

          <div
            className="
mx-auto
mb-5
flex
h-20
w-20
items-center
justify-center
rounded-full
bg-green-100
text-5xl
shadow-lg
"
          >
            ✅
          </div>

          <h1
            className="
text-3xl
sm:text-4xl
font-bold
text-gray-900
"
          >
            Order Placed Successfully!
          </h1>

          <p className="mt-3 text-gray-500">
            Thank you for shopping with us.
          </p>

          <p
            className="
mt-4
inline-block
rounded-full
bg-white
border
px-5
sm:px-7
py-2
text-sm
font-semibold
shadow-sm
"
          >
            Order #{order._id.slice(-8).toUpperCase()}
          </p>

        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="
bg-white
border
border-gray-200
rounded-3xl
shadow-md
hover:shadow-xl
transition-all
duration-300
p-4
flex
flex-col
sm:flex-row
gap-5
"
            >
              <img
                src={item.image}
                alt={item.name}
                className="
w-full
sm:w-28
h-52
sm:h-28
rounded-2xl
object-cover
"
              />

              <div className="flex-1 space-y-1">
                <h2 className="font-semibold text-xl sm:text-2xl">{item.name}</h2>
                {/* <p className="text-gray-500">₹{Number(item.price)}</p> */}
                {
                  item.discountPercent > 0
                    ? (
                      <>
                        <p className="line-through text-gray-400">
                          ₹{item.originalPrice}
                        </p>

                        <p className="text-green-600 font-bold">
                          ₹{item.finalPrice}
                        </p>

                        <p
                          className="
inline-block
rounded-full
bg-red-100
text-red-600
px-3
sm:px-5
py-1
text-xs
font-semibold
"
                        >
                          {item.discountPercent}% OFF
                        </p>
                      </>
                    )
                    : (
                      <p>
                        ₹{item.finalPrice}
                      </p>
                    )
                }
              </div>

              <div
                className="
flex
sm:block
justify-between
items-center
"
              >
                <p className="font-medium">Qty: {item.qty}</p>
                <p className="text-green-600 font-semibold">
                  ₹{Number(item.finalPrice) * item.qty}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          className="
mt-10
bg-white
rounded-3xl
shadow-lg
border
border-gray-200
p-6
sm:p-8
space-y-4
"
        >
          <div className="flex justify-between">
            <span>Original Amount</span>
            <span>
              ₹{order.originalAmount}
            </span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Discount Off</span>
            <span>
              - ₹{order.discountAmount}
            </span>
          </div>

          {/* <div className="flex justify-between">
          <span>Taxable Amount</span>
          <span>₹{order.taxableAmount}</span>
        </div> */}

          {order.cgst > 0 && (
            <div className="flex justify-between">
              <span>CGST</span>
              <span>₹{order.cgst}</span>
            </div>
          )}

          {order.sgst > 0 && (
            <div className="flex justify-between">
              <span>SGST</span>
              <span>₹{order.sgst}</span>
            </div>
          )}

          {order.igst > 0 && (
            <div className="flex justify-between">
              <span>IGST</span>
              <span>₹{order.igst}</span>
            </div>
          )}
          {/* <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{Number(subtotal || 0).toFixed(2)}</span>
        </div> */}

          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
              {shipping === 0 ? "FREE 🚚" : `₹${shipping}`}
            </span>
          </div>

          {shipping === 0 && (
            <p className="text-sm text-green-600">
              🎉 You got free shipping on orders above ₹500!
            </p>
          )}

          <div className="
flex
justify-between
items-center
border-t-2
border-blue-100
pt-4
mt-3
text-xl
font-bold
text-blue-700
">
            <span>Total</span>
            <span>₹{Number(total || 0).toFixed(2)}</span>
          </div>
          <div className="mt-8">

            {
              order?._id && (
                <SmartLink
                  href={`/track-order`}
                >

                  <button className="
w-full
rounded-2xl
bg-gradient-to-r
from-blue-600
to-indigo-700
py-4
text-xl
sm:text-2xl
font-semibold
text-white
shadow-lg
transition-all
duration-300
hover:scale-[1.02]
hover:shadow-blue-300
">
                    Track Order
                  </button>

                </SmartLink>
              )
            }
            {/* <SmartLink href="/">

              <button
                className="
mt-4
w-full
rounded-2xl
border
border-gray-300
bg-white
py-4
font-semibold
hover:bg-gray-100
transition
"
              >
                Continue Shopping
              </button>

            </SmartLink> */}
          </div>

        </div>

      </div>
    </div>

  );
}