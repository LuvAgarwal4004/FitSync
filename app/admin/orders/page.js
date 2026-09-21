"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] =
    useState("");
  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");
  const [totalSales, setTotalSales] =
    useState(0);

  const fetchOrders = async () => {

    const res = await fetch(
      `/api/admin/orders?search=${search}&from=${fromDate}&to=${toDate}`
    );

    const data = await res.json();

    setOrders(data.orders);
    setTotalSales(
      data.totalSales
    );

  };

  const updateStatus = async (id, status) => {
    const res = await fetch(
      `/api/admin/orders/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      }
    );

    const data = await res.json();

    if (data.success) {
      setOrders(prev =>
        prev.map(order =>
          order._id === id
            ? { ...order, status }
            : order
        )
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";
      case "returned":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {

    fetchOrders();

  }, [search, fromDate, toDate]);

  return (
    <div className="
      min-h-screen
      bg-gray-50
      p-4
      md:p-8
    ">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="
    text-3xl
    md:text-4xl
    font-bold
    text-gray-900
  ">
            Orders Dashboard
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Manage customer orders
          </p>
        </div>
        <div className="
  grid
  grid-cols-1
  md:grid-cols-[2fr_1fr_1fr_auto]
  gap-4
  mb-6
">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
w-full
border
rounded-2xl
px-5
py-3
outline-none
focus:ring-2
focus:ring-black
"
          />

          {/* FROM */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              From
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="
      border
      rounded-2xl
      px-4
      py-3
    "
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              To
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="
      border
      rounded-2xl
      px-4
      py-3
    "
            />
          </div>
          {/* <button
            className="
     h-[50px]
      px-6
      bg-black
      text-white
      rounded-2xl
      hover:bg-gray-800
      transition
      whitespace-nowrap
  "
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
            }}
          >
            Clear
          </button> */}
          <div className="flex flex-col">
            <label className="text-xs uppercase tracking-wide text-transparent mb-1">
              Clear
            </label>

            <button
              onClick={() => {
                setSearch("");
                setFromDate("");
                setToDate("");
              }}
              className="
      border
      border-gray-300
      rounded-2xl
      px-6
      py-3
      bg-black
      text-white
      hover:bg-gray-100
      transition
    "
            >
              Clear
            </button>
          </div>
        </div>
        <div
          className="
mb-8
bg-green-600
text-white
rounded-3xl
p-6
shadow-lg
"
        >
          <h2 className="text-lg">
            Revenue
          </h2>

          <p className="
text-3xl
md:text-4xl
font-bold
">
            ₹{totalSales.toFixed(2)}
          </p>

          <p className="opacity-80">
            Excluding Cancelled &
            Returned Orders
          </p>
        </div>

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="
                bg-white
                rounded-3xl
                shadow-sm
                border
                p-6
                hover:shadow-xl
                transition-all
              "
            >

              {/* TOP */}
              <div className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-6
                mb-6
              ">

                <div>

                  <h2 className="
                    text-xl
                    font-bold
                    text-gray-900
                  ">
                    {order.customerName}
                  </h2>

                  <p className="text-gray-500">
                    {order.customerEmail}
                  </p>

                  <p className="
                    text-sm
                    text-gray-400
                    mt-2
                  ">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="
flex
flex-col
sm:flex-row
sm:flex-wrap
items-start
sm:items-center
gap-3
">

                  <div className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${getStatusColor(order.status)}
                  `}>
                    {order.status}
                  </div>
                  <div className="
  px-4
  py-2
  rounded-full
  text-sm
  font-semibold
  bg-gray-100
  text-gray-700
">
                    Payment:
                    {" "}
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </div>

                  <select
                    value={order.status}
                    disabled={[
                      "delivered",
                      "cancelled",
                      "returned"
                    ].includes(order.status)}
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                    className={`
  w-full
sm:w-auto
border
rounded-xl
px-4
py-2
bg-white
  ${[
                        "delivered",
                        "cancelled",
                        "returned"
                      ].includes(order.status)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }
`}
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="processing">
                      Processing
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="out_for_delivery">
                      Out for delivery
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                    <option value="returned">
                      Returned
                    </option>

                  </select>

                </div>

              </div>

              {/* ADDRESS */}
              <div className="
                bg-gray-50
                rounded-2xl
                p-5
                mb-6
                text-sm
sm:text-base
              ">

                <h3 className="
                  font-semibold
                  mb-3
                  text-gray-800
                ">
                  Delivery Address
                </h3>

                <p>
                  {
                    order.addressSnapshot?.firstName
                  }{" "}
                  {
                    order.addressSnapshot?.lastName
                  }
                </p>

                <p>
                  {
                    order.addressSnapshot?.streetAddress
                  }
                </p>

                <p>
                  {
                    order.addressSnapshot?.city
                  },{" "}
                  {
                    order.addressSnapshot?.state
                  }
                </p>

                <p>
                  {
                    order.addressSnapshot?.mobile
                  }
                </p>

              </div>

              {/* ITEMS */}
              <div className="space-y-4">

                {order.items.map((item, index) => (

                  <div
                    className="
    flex
    flex-col
    sm:flex-row
    sm:items-center
    gap-4
    border
    rounded-2xl
    p-4
  "
                  >

                    <img
                      src={item.image}
                      className="
w-full
sm:w-24
h-52
sm:h-24
object-cover
rounded-xl
"
                    />

                    <div className="flex-1">

                      <h3 className="
                        font-semibold
                        text-lg
                      ">
                        {item.name}
                      </h3>

                      <p className="
                        text-gray-500
                        mt-1
                      ">
                        Qty: {item.qty}
                      </p>

                    </div>

                    <div className="
w-full
sm:w-auto
text-left
sm:text-right
font-bold
text-lg
">
                      {
                        item.discountPercent > 0 && (
                          <p className="
        text-sm
        text-gray-400
        line-through
      ">
                            ₹{item.originalPrice * item.qty}
                          </p>
                        )
                      }

                      <p className="
    font-bold
    text-lg
  ">
                        ₹{item.finalPrice * item.qty}
                      </p>

                      {
                        item.discountPercent > 0 && (
                          <p className="
        text-xs
        text-red-500
      ">
                            {item.discountPercent}% OFF
                          </p>
                        )
                      }

                      {/* ₹{item.finalprice * item.qty} */}
                    </div>

                  </div>

                ))}

              </div>

              {/* TOTAL */}
              <div
                className="
   flex
    flex-col
    sm:flex-row
    items-center
    justify-between
    gap-4
    mt-8
  "
              >

                {/* <a
                  href={`/api/admin/order/${order._id}/invoice`}
                  target="_blank"
                  className="
      bg-blue-600
      text-white
      px-5
      py-3
      rounded-xl
      font-semibold
      hover:bg-blue-700
      transition
    "
                >
                  Download Invoice
                </a> */}

                <div
                  className="
  w-full
  sm:w-auto
  bg-black
  text-white
  p-5
  rounded-2xl
  text-base
  sm:text-lg
  font-bold
"
                >
                  <div>
                    <p>
                      Original:
                      ₹{order.originalAmount}
                    </p>

                    <p className="text-red-600">
                      Discount:
                      -₹{order.discountAmount}
                    </p>

                    <p>
                      CGST:
                      ₹{order.cgst}
                    </p>

                    <p>
                      SGST:
                      ₹{order.sgst}
                    </p>
                    <p>
                      Shipping:
                      ₹{order.shippingCost}
                    </p>
                    {/* <p>
                      Taxable:
                      ₹{order.taxableAmount}
                    </p> */}

                    {order.igst > 0 && (
                      <p>
                        IGST:
                        ₹{order.igst}
                      </p>
                    )}

                    <p className="font-bold">
                      Total:
                      ₹{order.total}
                    </p>
                  </div>
                </div>

              </div>

            </div>

          ))}
          {orders.length === 0 && (
            <div className="
    bg-white
    rounded-3xl
    p-10
    text-center
    shadow
  ">
              <h2 className="text-2xl font-bold">
                No orders found
              </h2>

              <p className="text-gray-500 mt-2">
                Try changing your filters.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}