"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setGlobalLoading } from "./RouteLoader";
import { useSession } from "next-auth/react";
import { useCheckout } from "@/context/CheckoutContext";
import toast from "react-hot-toast";

export default function PaymentStep() {
  const { cart, setCart } = useCart();
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  // const {
  //   setOrderCompleted
  // } = useCheckout();

  const handlePayment = async () => {
    setLoading(true);
    if (typeof setGlobalLoading === "function") {
      setGlobalLoading(true);
    }
    if (!session?.user?.email) {
      toast.error("Please login");
      return;
    }
    const raw = localStorage.getItem(`address-${session.user.email}`);

    if (!raw) {
      toast.error("Address missing");
      return;
    }

    const savedAddress = JSON.parse(raw);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cart: cart,
          paymentMethod: method,
          address: savedAddress
        })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Payment failed. Cant order more than once at a time!");
        setLoading(false);
        return;
      }



      toast.success("Order Placed!");
      setCart([]);

      await fetch(
        "/api/checkout/complete",
        {
          method: "POST"
        }
      );
      await fetch("/api/cart/clear", {
        method: "POST"
      });

      setTimeout(() => {
        // setOrderCompleted(true);
        router.push(`/order-success?id=${data.order._id}`);

        setTimeout(() => {
          setGlobalLoading(false); // STOP LOADER AFTER PAGE LOAD FEEL
        }, 800);
      }, 200);



    } catch (err) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  return (
    <div
      className="
      max-w-2xl
      mx-auto
      bg-white
      rounded-3xl
      border
      shadow-lg
      p-6
      sm:p-8
    "
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Payment Method
        </h2>

        <p className="text-gray-500 mt-2">
          Choose your preferred payment option.
        </p>
      </div>

      {/* CASH ON DELIVERY */}

      <div
        onClick={() => setMethod("cod")}
        className={`
        cursor-pointer
        rounded-2xl
        border-2
        p-5
        transition-all
        duration-300

        ${method === "cod"
            ? "border-black bg-gray-100 shadow-md"
            : "border-gray-200 hover:border-gray-400 hover:shadow-md"
          }
      `}
      >
        <div className="flex items-start gap-4">

          <div
            className={`
            mt-1
            h-5
            w-5
            rounded-full
            border-2
            flex
            items-center
            justify-center
            ${method === "cod"
                ? "border-black"
                : "border-gray-400"
              }
          `}
          >
            {method === "cod" && (
              <div className="w-2.5 h-2.5 rounded-full bg-black" />
            )}
          </div>

          <div className="flex-1">

            <h3 className="font-semibold text-lg">
              Cash on Delivery
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Pay in cash when your order is delivered.
            </p>

          </div>

        </div>
      </div>

      {/* ONLINE PAYMENT */}

      <div
        onClick={() => setMethod("online")}
        className={`
        cursor-pointer
        rounded-2xl
        border-2
        p-5
        mt-5
        transition-all
        duration-300

        ${method === "online"
            ? "border-black bg-gray-100 shadow-md"
            : "border-gray-200 hover:border-gray-400 hover:shadow-md"
          }
      `}
      >
        <div className="flex items-start gap-4">

          <div
            className={`
            mt-1
            h-5
            w-5
            rounded-full
            border-2
            flex
            items-center
            justify-center
            ${method === "online"
                ? "border-black"
                : "border-gray-400"
              }
          `}
          >
            {method === "online" && (
              <div className="w-2.5 h-2.5 rounded-full bg-black" />
            )}
          </div>

          <div className="flex-1">

            <h3 className="font-semibold text-lg">
              Online Payment
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Pay securely using UPI, Debit Card, Credit Card or Net Banking.
            </p>

            <span className="inline-block mt-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Secure Payment
            </span>

          </div>

        </div>
      </div>

      {/* PLACE ORDER */}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="
        w-full
        mt-8

        rounded-xl

        bg-black
        text-white

        py-4

        text-lg
        font-semibold

        transition-all
        duration-300

        hover:bg-gray-900
        hover:shadow-xl

        active:scale-[0.98]

        disabled:opacity-60
        disabled:cursor-not-allowed
      "
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}