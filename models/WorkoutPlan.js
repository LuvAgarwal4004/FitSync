import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sets: {
      type: Number,
      required: true,
    },

    reps: {
      type: String,
      required: true,
    },

    restSeconds: {
      type: Number,
      required: true,
    },

    instructions: {
      type: String,
      default: "",
    },

    targetMuscles: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);


const WorkoutDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    focus: {
      type: String,
      required: true,
    },

    estimatedDuration: {
      type: Number,
      required: true,
    },

    warmup: {
      type: [String],
      default: [],
    },

    exercises: {
      type: [ExerciseSchema],
      default: [],
    },

    cooldown: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);


const WorkoutPlanSchema = new mongoose.Schema(
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
    // PLAN INFORMATION
    // ============================================================

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    primaryGoal: {
      type: String,
      required: true,
    },

    experienceLevel: {
      type: String,
      required: true,
    },

    workoutDaysPerWeek: {
      type: Number,
      required: true,
    },

    workoutDuration: {
      type: Number,
      required: true,
    },


    // ============================================================
    // AI GENERATED PLAN
    // ============================================================

    strategy: {
      type: String,
      default: "",
    },

    progressionAdvice: {
      type: [String],
      default: [],
    },

    recoveryAdvice: {
      type: [String],
      default: [],
    },

    days: {
      type: [WorkoutDaySchema],
      default: [],
    },


    // ============================================================
    // VERSIONING
    // ============================================================

    generatedBy: {
      type: String,
      default: "gemini",
    },

    model: {
      type: String,
      default: "gemini-2.5-flash",
    },

    version: {
      type: Number,
      default: 1,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.models.WorkoutPlan ||
  mongoose.model("WorkoutPlan", WorkoutPlanSchema);