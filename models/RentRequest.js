import mongoose from "mongoose";

const RentRequestSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        studentName: {
            type: String,
            required: true,
            trim: true,
        },
        branch: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        whatsapp: {
            type: String,
            required: true,
            trim: true,
        },
        itemNeeded: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            // required: true,
            trim: true,
        },
        fromDate: {
            type: String,
            // required: true,
        },
        toDate: {
            type: String,
            // required: true,
        },
        fromTime: {
            type: String,
            // required: true,
        },
        toTime: {
            type: String,
            // required: true,
        },
        meetLocation: {
            type: String,
            required: true,
            trim: true,
        },
        offeredMoney: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.models.RentRequest ||
    mongoose.model("RentRequest", RentRequestSchema);