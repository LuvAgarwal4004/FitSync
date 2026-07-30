"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function MyActivityPage() {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch("/api/my-activity", {
          cache: "no-store",
        });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load activity");
        }

        const data = await res.json();
        setProducts(data.products || []);
        setRequests(data.requests || []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [router]);

  const handleEditProduct = (id) => {
    router.replace(`/sell?id=${id}`);
  };

  const handleEditRequest = (id) => {
    router.replace(`/rent?id=${id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      setDeletingId(`product-${id}`);

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      if (res.status === 403) {
        toast.error("You can only delete your own product.");
        return;
      }

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted.");
    } catch (error) {
      console.log(error);
      toast.error("Could not delete product.");
    } finally {
      setDeletingId("");
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!confirm("Delete this rent request?")) return;

    try {
      setDeletingId(`request-${id}`);

      const res = await fetch(`/api/rent/${id}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      if (res.status === 403) {
        toast.error("You can only delete your own rent request.");
        return;
      }

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setRequests((prev) => prev.filter((r) => r._id !== id));
      toast.success("Rent request deleted.");
    } catch (error) {
      console.log(error);
      toast.error("Could not delete rent request.");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-center text-4xl font-bold sm:text-5xl">
          My Activity
        </h1>

        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
            My Products
          </h2>

          {products.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              You have not posted any products.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="overflow-hidden rounded-3xl bg-white shadow-xl"
                >
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-2xl font-bold">
                      {product.productName}
                    </h3>

                    <p className="mt-2 text-lg font-semibold text-emerald-600">
                      ₹ {product.price}
                    </p>

                    <p className="mt-2 text-gray-600">
                      {product.condition}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {product.branch} • {product.year}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm text-gray-700">
                      {product.description}
                    </p>

                    <div className="mt-6 flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product._id)}
                        className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingId === `product-${product._id}`}
                        className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === `product-${product._id}`
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">
            My Rent Requests
          </h2>

          {requests.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              No rent requests yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => (
                <article
                  key={request._id}
                  className="rounded-3xl bg-white p-6 shadow-xl"
                >
                  <h3 className="text-2xl font-bold">
                    {request.itemNeeded}
                  </h3>

                  <p className="mt-3 text-lg font-semibold text-emerald-600">
                    ₹ {request.offeredMoney}
                  </p>

                  <p className="mt-2 text-gray-700">
                    <strong>Location:</strong> {request.meetLocation}
                  </p>

                  {(request.fromDate || request.toDate) && (
                    <p className="mt-2 text-gray-700">
                      <strong>Date:</strong> {request.fromDate || "--"} to{" "}
                      {request.toDate || "--"}
                    </p>
                  )}

                  {(request.fromTime || request.toTime) && (
                    <p className="mt-2 text-gray-700">
                      <strong>Time:</strong> {request.fromTime || "--"} to{" "}
                      {request.toTime || "--"}
                    </p>
                  )}

                  {request.description && (
                    <p className="mt-3 line-clamp-4 text-sm text-gray-600">
                      {request.description}
                    </p>
                  )}

                  <div className="mt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleEditRequest(request._id)}
                      className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(request._id)}
                      disabled={deletingId === `request-${request._id}`}
                      className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === `request-${request._id}`
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}