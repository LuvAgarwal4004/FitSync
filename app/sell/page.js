"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function SellPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [initialData, setInitialData] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(Boolean(editId));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!editId || status !== "authenticated") return;

      try {
        setLoadingEdit(true);

        const res = await fetch(`/api/products/${editId}`, {
          cache: "no-store",
        });

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load product");
        }

        const data = await res.json();
        setInitialData(data);
      } catch (error) {
        console.log(error);
        toast.error("Could not load product for editing.");
        router.replace("/my-activity");
      } finally {
        setLoadingEdit(false);
      }
    };

    loadProduct();
  }, [editId, status, router]);

  const saveProduct = async (formData) => {
    const url = editId ? `/api/products/${editId}` : "/api/products";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed");
    }

    router.replace("/");
  };

  if (status === "loading" || (editId && loadingEdit)) {
    return (
      <main className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <ProductForm initialData={initialData || undefined} onSubmit={saveProduct} />
    </div>
  );
}