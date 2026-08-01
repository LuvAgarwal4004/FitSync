"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProductForm({
  initialData,
  onSubmit,
}) {
  const [form, setForm] = useState({
    _id: "",
    studentName: "",
    branch: "",
    year: "",
    phone: "",
    whatsapp: "",
    productName: "",
    price: "",
    condition: "",
    description: "",
    image: "",
  });

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      _id: initialData._id || "",
      studentName: initialData.studentName || "",
      branch: initialData.branch || "",
      year: initialData.year || "",
      phone: initialData.phone || "",
      whatsapp: initialData.whatsapp || "",
      productName: initialData.productName || "",
      price: initialData.price || "",
      condition: initialData.condition || "",
      description: initialData.description || "",
      image: initialData.image || "",
    });
  }, [initialData?._id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setUploading(true);

    try {
      const data = new FormData();

      data.append("file", file);

      data.append(
        "upload_preset",
        "ecommerce_upload"
      );

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxytdtu3y/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      const json =
        await res.json();

      setForm((prev) => ({
        ...prev,
        image:
          json.secure_url,
      }));

      toast.success(
        "Image uploaded successfully!"
      );
    } catch (err) {
      toast.error(
        "Image upload failed."
      );
    }

    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.studentName ||
      !form.branch ||
      !form.year ||
      !form.phone ||
      !form.whatsapp ||
      !form.productName ||
      !form.price ||
      !form.condition ||
      !form.description ||
      !form.image
    ) {
      toast.error(
        "Please fill all fields."
      );
      return;
    }

    try {
      setLoading(true);

      const { _id, ...payload } = form;
      await onSubmit(payload);

      toast.success(
        form._id
          ? "Product updated successfully!"
          : "Product posted successfully!"
      );
    } catch (err) {
      toast.error(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <h1 className="text-4xl font-bold">
          Sell Your Stationery
        </h1>

        <p className="mt-2 text-white/90">
          Fill in the details below to post your stationery for sale.
        </p>
      </div>

      <div className="p-8 space-y-10">

        {/* Student Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Student Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Student Name
              </label>

              <input
                type="text"
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="Computer Science"
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Year
              </label>

              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              >
                <option value="">
                  Select Year
                </option>

                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold text-gray-700">
                WhatsApp Number
              </label>

              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="9876543210"
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              />
            </div>

          </div>
        </div>

        {/* Product Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Product Name
              </label>

              <input
                type="text"
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="Scientific Calculator"
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Selling Price (₹)
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="500"
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Condition
              </label>

              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              >
                <option value="">
                  Select Condition
                </option>

                <option>Brand New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Used</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold text-gray-700">
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your stationery item..."
                className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
appearance-none
color-scheme-light
px-4
py-3
outline-none
focus:ring-2
focus:ring-indigo-500
"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold text-gray-700">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e.target.files[0])
                }
                className="w-full rounded-xl border border-gray-300 p-3"
              />

              {uploading && (
                <p className="mt-4 text-indigo-600 font-medium">
                  Uploading image...
                </p>
              )}

              {form.image && (
                <div className="mt-6">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-60 h-60 rounded-2xl object-cover border shadow-lg"
                  />
                </div>
              )}
            </div>

          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="
              w-full
              md:w-auto
              px-12
              py-4
              rounded-2xl
              text-lg
              font-bold
              text-white
              bg-gradient-to-r
              from-green-500
              via-emerald-500
              to-teal-500
              shadow-xl
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-2xl
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Posting..."
              : form._id
                ? "Update Product"
                : "Post Product"}
          </button>
        </div>

      </div>
    </form>
  );
}