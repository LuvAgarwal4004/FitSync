import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    calories: {
      type: Number,
      default: 0,
    },

    protein: {
      type: Number,
      default: 0,
    },

    carbs: {
      type: Number,
      default: 0,
    },

    fats: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);


const DaySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },

    meals: {
      type: [MealSchema],
      default: [],
    },

    dailyCalories: {
      type: Number,
      default: 0,
    },

    dailyProtein: {
      type: Number,
      default: 0,
    },

    dailyCarbs: {
      type: Number,
      default: 0,
    },

    dailyFats: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);


const NutritionPlanSchema = new mongoose.Schema(
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

    version: {
      type: Number,
      default: 1,
    },
    // ============================================================
    // AI GENERATED SUMMARY
    // ============================================================

    title: {
      type: String,
      default: "Personalized Nutrition Plan",
    },

    summary: {
      type: String,
      default: "",
    },

    caloriesTarget: {
      type: Number,
      default: 0,
    },

    proteinTarget: {
      type: Number,
      default: 0,
    },

    carbsTarget: {
      type: Number,
      default: 0,
    },

    fatsTarget: {
      type: Number,
      default: 0,
    },


    // ============================================================
    // 7 DAY PLAN
    // ============================================================

    days: {
      type: [DaySchema],
      default: [],
    },


    // ============================================================
    // GENERAL GUIDANCE
    // ============================================================

    hydration: {
      type: String,
      default: "",
    },

    tips: {
      type: [String],
      default: [],
    },


    // ============================================================
    // AI METADATA
    // ============================================================

    generatedBy: {
      type: String,
      default: "gemini",
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.models.NutritionPlan ||
  mongoose.model("NutritionPlan", NutritionPlanSchema);