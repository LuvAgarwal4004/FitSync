"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import Loading from "@/app/loading";
import toast from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      console.log("Fetched product:", data);
      setForm(data);
    };

    fetchProduct();
  }, [id]);

  if (!form) {
    return (
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
    ">
        <Loading />
      </div>
    );
  }

  const handleUpdate = async (updatedData) => {
    console.log("BEFORE FETCH");
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();
    console.log("BEFORE ALERT");
    if (data.success) {
      toast.success("Updated 🔥");
      router.push("/admin/products");
    }
    console.log("AFTER ALERT");
  };

  return (
    <div className="
    min-h-screen
    bg-gray-50
    px-4
    py-6
    sm:px-6
    lg:px-8
  ">
      <div className="
      max-w-4xl
      mx-auto
    ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="
          text-3xl
          sm:text-4xl
          font-bold
          text-gray-900
        ">
            Edit Product
          </h1>

          <p className="
          text-gray-500
          mt-2
        ">
            Update product details, pricing and images.
          </p>
        </div>

        {/* Form Card */}
        <div className="
        bg-white
        rounded-3xl
        shadow-sm
        border
        p-5
        sm:p-8
      ">
          <ProductForm
            initialData={form}
            onSubmit={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}