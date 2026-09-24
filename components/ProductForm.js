"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Stable default -> prevents the "form resets on every keystroke" bug
const EMPTY_PRODUCT = {};

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none";

function buildForm(data) {
  return {
    _id: data._id || "",
    title: data.title || "",
    price: data.price ?? "",
    image: data.image || "",
    category: data.category || "trends",
    collection: data.collection || "",
    description: data.description || "",
    specifications: data.specifications || "",
    isDiscount: Boolean(data.isDiscount),
  };
}

export default function ProductForm({ initialData = EMPTY_PRODUCT, onSubmit }) {
  const [form, setForm] = useState(() => buildForm(initialData));
  const [discountedPrice, setDiscountedPrice] = useState(
    initialData.discountedPrice ?? ""
  );
  const [discountPercent, setDiscountPercent] = useState(
    initialData.discountPercent || ""
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Only re-sync when a different product is loaded (edit mode)
  useEffect(() => {
    setForm(buildForm(initialData));
    setDiscountedPrice(initialData.discountedPrice ?? "");
    setDiscountPercent(initialData.discountPercent || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // keep discounted price in sync if the base price changes
    if (name === "price" && discountPercent !== "") {
      const price = Number(value);
      if (price > 0) {
        setDiscountedPrice(
          Math.round(price * (1 - Number(discountPercent) / 100))
        );
      }
    }
  };

  const handleDiscountedPriceChange = (e) => {
    const value = e.target.value;
    setDiscountedPrice(value);

    const price = Number(form.price);
    if (value === "" || !price) {
      setDiscountPercent("");
      return;
    }
    setDiscountPercent(Math.round(((price - Number(value)) / price) * 100));
  };

  const handleDiscountPercentChange = (e) => {
    const value = e.target.value;
    setDiscountPercent(value);

    const price = Number(form.price);
    if (value === "" || !price) {
      setDiscountedPrice("");
      return;
    }
    setDiscountedPrice(Math.round(price * (1 - Number(value) / 100)));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ecommerce_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxytdtu3y/image/upload",
        { method: "POST", body: data }
      );

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      setForm((prev) => ({ ...prev, image: json.secure_url }));
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      toast.error("Please wait for the image to finish uploading");
      return;
    }

    if (
      !form.title.trim() ||
      !form.price ||
      !form.category ||
      !form.description.trim() ||
      !form.image
    ) {
      toast.error("Title, price, category, description and image are required");
      return;
    }

    if (form.category === "collections" && !form.collection.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    const price = Number(form.price);
    if (!(price > 0)) {
      toast.error("Price must be greater than 0");
      return;
    }

    let finalDiscountedPrice = null;
    let finalDiscountPercent = 0;

    if (form.isDiscount) {
      finalDiscountedPrice = Number(discountedPrice);
      finalDiscountPercent = Number(discountPercent);

      if (!(finalDiscountedPrice > 0) || !(finalDiscountPercent > 0)) {
        toast.error("Please fill either Discounted Price or Discount %");
        return;
      }
      if (finalDiscountedPrice >= price) {
        toast.error("Discounted price must be lower than original price");
        return;
      }
      if (finalDiscountPercent >= 100) {
        toast.error("Discount percentage must be less than 100");
        return;
      }
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...(form._id ? { _id: form._id } : {}),
        title: form.title.trim(),
        price,
        image: form.image,
        category: form.category,
        collection:
          form.category === "collections" ? form.collection.trim() : null,
        description: form.description.trim(),
        specifications: form.specifications,
        isDiscount: form.isDiscount,
        discountedPrice: form.isDiscount ? finalDiscountedPrice : null,
        discountPercent: form.isDiscount ? finalDiscountPercent : 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border p-6 md:p-8 space-y-6 text-black"
    >
      <div>
        <h2 className="text-3xl font-bold">Product Details</h2>
        <p className="text-gray-500 mt-1">
          Add or update your product information.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="block mb-2 font-medium">Product Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className={inputClass}
        />
      </div>

      {/* Price + discount toggle */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2 font-medium">Price</label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="₹0"
            className={inputClass}
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDiscount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isDiscount: e.target.checked }))
              }
              className="w-5 h-5"
            />
            Apply Discount
          </label>
        </div>
      </div>

      {/* Discount fields */}
      {form.isDiscount && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium">Discounted Price</label>
            <input
              type="number"
              min="0"
              placeholder="₹0"
              value={discountedPrice}
              onChange={handleDiscountedPriceChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Discount %</label>
            <input
              type="number"
              min="0"
              max="99"
              placeholder="0%"
              value={discountPercent}
              onChange={handleDiscountPercentChange}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Category */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-2 font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="trends">Trends</option>
            <option value="collections">Collections</option>
          </select>
        </div>

        {form.category === "collections" && (
          <div>
            <label className="block mb-2 font-medium">Collection Name</label>
            <input
              name="collection"
              value={form.collection}
              onChange={handleChange}
              placeholder="Collection"
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description..."
          className={inputClass}
        />
      </div>

      {/* Specifications */}
      <div>
        <label className="block mb-2 font-medium">Specifications</label>
        <textarea
          rows={5}
          name="specifications"
          value={form.specifications}
          onChange={handleChange}
          placeholder="Specifications..."
          className={inputClass}
        />
      </div>

      {/* Image */}
      <div>
        <label className="block mb-2 font-medium">Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files?.[0])}
          className="w-full"
        />

        {uploading && (
          <p className="text-blue-600 mt-3">Uploading image...</p>
        )}

        {form.image && (
          <div className="mt-5">
            <img
              src={form.image}
              alt="Preview"
              className="w-40 h-40 rounded-2xl object-cover border shadow-md"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading || submitting}
        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-60 disabled:hover:scale-100"
      >
        {submitting ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}