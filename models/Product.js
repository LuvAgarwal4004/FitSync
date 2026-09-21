import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  category: String,
  collection: String,
  collectionId: String,
  sequence: Number,
  description: String,
  oldPrice: {
    type: Number,
    default: null
  },

  isDiscount: {
    type: Boolean,
    default: false
  },
  specifications: {
    type: String,
    default: ""
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  discountedPrice: {
    type: Number,
    default: null
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);