import mongoose from "mongoose";

const checkoutSessionSchema =
    new mongoose.Schema({

        userId: {
            type: String,
            required: true
        },

        step: {
            type: Number,
            default: 1
        },

        completed: {
            type: Boolean,
            default: false
        }

    }, { timestamps: true });

export default
    mongoose.models.CheckoutSession ||
    mongoose.model(
        "CheckoutSession",
        checkoutSessionSchema
    );