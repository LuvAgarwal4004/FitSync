import mongoose from "mongoose";

const AIUserContextSchema = new mongoose.Schema(
  {
    // ============================================================
    // USER
    // ============================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ============================================================
    // NUTRITION CONSTRAINTS
    // ============================================================

    dietaryAvoidances: {
      type: [String],
      default: [],
    },

    // ============================================================
    // WORKOUT CONSTRAINTS
    // ============================================================

    workoutConstraints: {
      type: [String],
      default: [],
    },

    // ============================================================
    // GENERAL AI CONTEXT
    // ============================================================

    notes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AIUserContext ||
  mongoose.model("AIUserContext", AIUserContextSchema);