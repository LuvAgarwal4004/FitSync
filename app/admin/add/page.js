"use client";
import ProductForm from "@/components/ProductForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Product Added 🔥");
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sm:p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Add Product
            </h1>
            <p className="text-gray-500 mt-2">
              Fill in the product details below.
            </p>
          </div>

          <ProductForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}