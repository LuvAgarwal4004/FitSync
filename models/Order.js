import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    customerName: String,
    customerEmail: String,

    items: [
      {
        id: String,
        name: String,
        image: String,
        price: Number,
        originalPrice: Number,

        finalPrice: Number,

        discountPercent: {
          type: Number,
          default: 0
        },
        qty: Number
      }
    ],

    addressSnapshot: {
      firstName: String,
      lastName: String,
      streetAddress: String,
      city: String,
      state: String,
      mobile: String,
    },

    paymentMethod: String,

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned"
      ],
      default: "pending"
    },

    cancelledBy: {
      type: String,
      enum: ["user", "admin", null],
      default: null
    },

    total: Number,
    subtotal: {
      type: Number,
      default: 0
    },
    originalAmount: Number,
    discountAmount: {
      type: Number,
      default: 0
    },

    cgst: {
      type: Number,
      default: 0
    },

    sgst: {
      type: Number,
      default: 0
    },

    igst: {
      type: Number,
      default: 0
    },

    taxableAmount: {
      type: Number,
      default: 0
    },

    invoiceNumber: {
      type: String,
      unique: true
    },

    invoiceUrl: String,
    invoicePublicId: String,
    shippingCost: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);