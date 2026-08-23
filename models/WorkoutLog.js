import mongoose from "mongoose";


// ============================================================
// EXERCISE LOG
// ============================================================

const ExerciseLogSchema = new mongoose.Schema(
  {
    exerciseIndex: {
      type: Number,
      required: true,
      min: 0,
    },

    exerciseName: {
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
// WORKOUT LOG
// ============================================================

const WorkoutLogSchema = new mongoose.Schema(
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

    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      required: true,
    },

    dayNumber: {
      type: Number,
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
    // SESSION
    // ==========================================================

    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "completed",
      ],
      default: "not_started",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    durationSeconds: {
      type: Number,
      default: 0,
    },


    // ==========================================================
    // EXERCISES
    // ==========================================================

    exercises: {
      type: [ExerciseLogSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);


// ============================================================
// ONE WORKOUT LOG PER USER / DATE
// ============================================================

WorkoutLogSchema.index(
  {
    userId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.models.WorkoutLog ||
  mongoose.model("WorkoutLog", WorkoutLogSchema);