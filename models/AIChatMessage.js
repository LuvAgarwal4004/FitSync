import mongoose from "mongoose";

const AIChatMessageSchema = new mongoose.Schema(
  {
    // ============================================================
    // USER
    // ============================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ============================================================
    // MESSAGE
    // ============================================================

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },

    // ============================================================
    // OPTIONAL AI ACTION
    // ============================================================

    action: {
      type: String,
      enum: [
        "none",
        "regenerate_workout",
        "regenerate_nutrition",
      ],
      default: "none",
    },

    actionStatus: {
      type: String,
      enum: [
        "none",
        "pending",
        "confirmed",
        "rejected",
      ],
      default: "none",
    },

    // What exactly caused the regeneration request.
    actionReason: {
      type: String,
      maxlength: 2000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

AIChatMessageSchema.index({
  userId: 1,
  createdAt: 1,
});

export default mongoose.models.AIChatMessage ||
  mongoose.model("AIChatMessage", AIChatMessageSchema);