"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
// import { useRef } from "react";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    _id: initialData._id || "",
    title: initialData.title || "",
    price: initialData.price || "",
    image: initialData.image || "",
    category: initialData.category || "trends",
    collection: initialData.collection || "",
    description: initialData.description || "",
    specifications:
      initialData.specifications || "",

    isDiscount:
      initialData.isDiscount || false,
  });
  useEffect(() => {
    setForm({
      _id: initialData._id || "",
      title: initialData.title || "",
      price: initialData.price || "",

      image: initialData.image || "",
      category: initialData.category || "trends",
      collection: initialData.collection || "",
      description: initialData.description || "",
      specifications: initialData.specifications || "",
      isDiscount: initialData.isDiscount || false,
    });
    setDiscountedPrice(
      initialData.discountedPrice || ""
    );

    setDiscountPercent(
      initialData.discountPercent || ""
    );
    console.log(initialData);
  }, [initialData]);

  const [uploading, setUploading] = useState(false);
  const [originalPrice] =
    useState(initialData.price || 0);
  const [discountedPrice, setDiscountedPrice] =
    useState(initialData.discountedPrice || "");
  // const popupRef = useRef(null);

  const [discountPercent, setDiscountPercent] =
    useState(initialData.discountPercent || "");

  // const [showDiscountPopup,
  //   setShowDiscountPopup] =
  //   useState(false);
  if (Number(discountPercent) < 0) {
    toast.error("Discount cannot be negative");
    return;
  }
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const submitProduct = (isDiscount) => {
    const finalData = {
      ...form,
      isDiscount,
      collection:
        form.category === "collections"
          ? form.collection
          : null
    };

    onSubmit(finalData);

    // setShowDiscountPopup(false);
  };

  const handleImageUpload = async (file) => {
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ecommerce_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxytdtu3y/image/upload",
      { method: "POST", body: data }
    );
    if (!res.ok) {
      setUploading(false);
      toast.error("Upload failed");
      return;
    }

    const json = await res.json();

    setForm(prev => ({
      ...prev,
      image: json.secure_url
    }));

    setUploading(false);
  };

  const handleSubmit = (e, isDiscount) => {
    e.preventDefault();
    console.log("SUBMIT FIRED");
    if (!form.title || !form.price || !form.category || !form.image) {
      toast.error("All fields are required");
      return;
    }

    // CLEAN LOGIC
    // const finalData = {
    //   ...form, isDiscount,
    //   collection: form.category === "collections" ? form.collection : null
    // };
    const currentPrice =
      Number(form.price);

    const oldPrice =
      Number(originalPrice);

    if (
      oldPrice &&
      currentPrice < oldPrice
    ) {
      // setShowDiscountPopup(true);
      return;
    }
    if (form.isDiscount) {

      const hasPrice =
        Number(discountedPrice) > 0;

      const hasPercent =
        Number(discountPercent) > 0;

      if (!hasPrice && !hasPercent) {

        toast.error(
          "Please fill either Discounted Price or Discount %"
        );

        return;
      }

    }
    if (
      Number(discountedPrice) >=
      Number(form.price)
    ) {
      toast.error(
        "Discounted price must be lower than original price"
      );
      return;
    }
    if (
      Number(discountPercent) >= 100
    ) {
      toast.error(
        "Discount percentage must be less than 100"
      );
      return;
    }
    console.log("Before onSubmit");
    onSubmit({
      ...form,
      discountedPrice:
        form.isDiscount
          ? discountedPrice
          : null,

      discountPercent:
        form.isDiscount
          ? discountPercent
          : 0
    });
    // submitProduct(false);

    // onSubmit(finalData);

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
      max-w-3xl
      mx-auto
      bg-white
      rounded-3xl
      shadow-lg
      border
      p-6
      md:p-8
      space-y-6
      text-black
    "
    >
      <div>
        <h2 className="text-3xl font-bold">
          Product Details
        </h2>

        <p className="text-gray-500 mt-1">
          Add or update your product information.
        </p>
      </div>

      {/* Title */}

      <div>
        <label className="block mb-2 font-medium">
          Product Title
        </label>

        <input
          name="title"
          required
          value={form.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="
          w-full
          rounded-xl
          border
          border-gray-300
          px-4
          py-3
          focus:ring-2
          focus:ring-blue-500
          outline-none
        "
        />
      </div>

      {/* Price */}

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-2 font-medium">
            Price
          </label>

          <input
            name="price"
            type="number"
            required
            value={form.price}
            onChange={handleChange}
            placeholder="₹0"
            className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
          />
        </div>

        <div className="flex items-end">

          <label className="flex items-center gap-3 font-medium">

            <input
              type="checkbox"
              checked={form.isDiscount}
              onChange={(e) =>
                setForm({
                  ...form,
                  isDiscount: e.target.checked,
                })
              }
              className="w-5 h-5"
            />

            Apply Discount

          </label>

        </div>

      </div>

      {/* Discount */}

      {form.isDiscount && (
        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 font-medium">
              Discounted Price
            </label>

            <input
              type="number"
              placeholder="₹0"
              value={discountedPrice}
              onChange={(e) => {
                const value = Number(e.target.value);

                setDiscountedPrice(value);

                const percent = Math.round(
                  ((Number(form.price) - value) /
                    Number(form.price)) *
                  100
                );

                setDiscountPercent(percent);
              }}
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Discount %
            </label>

            <input
              type="number"
              placeholder="0%"
              value={discountPercent}
              onChange={(e) => {
                const percent = Number(e.target.value);

                setDiscountPercent(percent);

                const discounted = Math.round(
                  Number(form.price) *
                  (1 - percent / 100)
                );

                setDiscountedPrice(discounted);
              }}
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "
            />
          </div>

        </div>
      )}

      {/* Category */}

      <div className="grid md:grid-cols-2 gap-5">

        <div>

          <label className="block mb-2 font-medium">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="
            w-full
            rounded-xl
            border
            border-gray-300
            px-4
            py-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
          >
            <option value="trends">
              Trends
            </option>

            <option value="collections">
              Collections
            </option>
          </select>

        </div>

        {form.category === "collections" && (
          <div>

            <label className="block mb-2 font-medium">
              Collection Name
            </label>

            <input
              name="collection"
              value={form.collection}
              onChange={handleChange}
              placeholder="Collection"
              className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "
            />

          </div>
        )}

      </div>

      {/* Description */}

      <div>

        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          rows={4}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description..."
          className="
          w-full
          rounded-xl
          border
          border-gray-300
          px-4
          py-3
          focus:ring-2
          focus:ring-blue-500
          outline-none
        "
        />

      </div>

      {/* Specifications */}

      <div>

        <label className="block mb-2 font-medium">
          Specifications
        </label>

        <textarea
          rows={5}
          name="specifications"
          value={form.specifications}
          onChange={handleChange}
          placeholder="Specifications..."
          className="
          w-full
          rounded-xl
          border
          border-gray-300
          px-4
          py-3
          focus:ring-2
          focus:ring-blue-500
          outline-none
        "
        />

      </div>

      {/* Image */}

      <div>

        <label className="block mb-2 font-medium">
          Product Image
        </label>

        <input
          type="file"
          onChange={(e) =>
            handleImageUpload(e.target.files[0])
          }
          className="w-full"
        />

        {uploading && (
          <p className="text-blue-600 mt-3">
            Uploading image...
          </p>
        )}

        {form.image && (
          <div className="mt-5">

            <img
              src={form.image}
              alt="Preview"
              className="
              w-40
              h-40
              rounded-2xl
              object-cover
              border
              shadow-md
            "
            />

          </div>
        )}

      </div>

      <button
        className="
        w-full
        md:w-auto

        bg-gradient-to-r
        from-blue-600
        to-indigo-700

        text-white

        px-10
        py-3

        rounded-xl

        font-semibold

        shadow-lg

        hover:scale-105

        transition-all
      "
      >
        Save Product
      </button>
    </form>
  );
}
