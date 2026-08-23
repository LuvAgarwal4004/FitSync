import mongoose from "mongoose";


// ============================================================
// AI INSIGHT
// ============================================================

const AIInsightSchema = new mongoose.Schema(
  {
    // ==========================================================
    // USER
    // ==========================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },


    // ==========================================================
    // TYPE
    // ==========================================================

    type: {
      type: String,
      enum: [
        "workout",
        "nutrition",
        "general",
      ],
      required: true,
    },


    // ==========================================================
    // SEVERITY
    // ==========================================================

    severity: {
      type: String,
      enum: [
        "info",
        "positive",
        "warning",
      ],
      default: "info",
    },


    // ==========================================================
    // TITLE
    // ==========================================================

    title: {
      type: String,
      required: true,
      maxlength: 200,
    },


    // ==========================================================
    // MESSAGE
    // ==========================================================

    message: {
      type: String,
      required: true,
      maxlength: 2000,
    },


    // ==========================================================
    // RECOMMENDATION
    // ==========================================================

    recommendation: {
      type: String,
      default: "",
      maxlength: 2000,
    },


    // ==========================================================
    // ACTION
    // ==========================================================

    action: {
      type: String,
      enum: [
        "none",
        "adapt_workout",
        "adapt_nutrition",
      ],
      default: "none",
    },


    // ==========================================================
    // SUPPORTING DATA
    // ==========================================================

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },


    // ==========================================================
    // STATUS
    // ==========================================================

    status: {
      type: String,
      enum: [
        "active",
        "dismissed",
        "applied",
      ],
      default: "active",
    },


    // ==========================================================
    // ANALYSIS PERIOD
    // ==========================================================

    periodStart: {
      type: String,
      required: true,
    },

    periodEnd: {
      type: String,
      required: true,
    },


    // ==========================================================
    // AI
    // ==========================================================

    generatedBy: {
      type: String,
      default: "gemini",
    },

    model: {
      type: String,
      default: "gemini-3.6-flash",
    },
  },

  {
    timestamps: true,
  }
);


AIInsightSchema.index({
  userId: 1,
  createdAt: -1,
});


export default mongoose.models.AIInsight ||
  mongoose.model("AIInsight", AIInsightSchema);