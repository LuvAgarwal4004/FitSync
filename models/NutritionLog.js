import mongoose from "mongoose";


// ============================================================
// MEAL LOG
// ============================================================

const MealLogSchema = new mongoose.Schema(
  {
    mealIndex: {
      type: Number,
      required: true,
      min: 0,
    },

    mealName: {
      type: String,
      required: true,
      maxlength: 200,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);


// ============================================================
// NUTRITION LOG
// ============================================================

const NutritionLogSchema = new mongoose.Schema(
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
    // PLAN
    // ==========================================================

    nutritionPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NutritionPlan",
      required: true,
    },


    // ==========================================================
    // DATE
    // ==========================================================

    date: {
      type: String,
      required: true,
    },


    // ==========================================================
    // MEALS
    // ==========================================================

    meals: {
      type: [MealLogSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);


// ============================================================
// ONE NUTRITION LOG PER USER / DATE
// ============================================================

NutritionLogSchema.index(
  {
    userId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.models.NutritionLog ||
  mongoose.model("NutritionLog", NutritionLogSchema);