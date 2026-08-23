import mongoose from "mongoose";

const FitnessProfileSchema = new mongoose.Schema(
  {
    // IMPORTANT:
    // This connects the fitness profile to the logged-in user.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Basic information
    age: {
      type: Number,
      min: 13,
      max: 100,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },

    height: {
      value: Number,
      unit: {
        type: String,
        enum: ["cm", "ft"],
        default: "cm",
      },
    },

    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ["kg", "lb"],
        default: "kg",
      },
    },

    // Fitness goal
    primaryGoal: {
      type: String,
      enum: [
        "lose_weight",
        "build_muscle",
        "gain_weight",
        "improve_fitness",
        "increase_strength",
        "maintain",
      ],
    },

    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },

    // Training preferences
    workoutDays: {
      type: Number,
      min: 1,
      max: 7,
    },

    workoutDuration: {
      type: Number,
      min: 10,
      max: 180,
    },

    workoutLocation: {
      type: String,
      enum: ["home", "gym", "outdoors", "mixed"],
    },

    equipment: {
      type: [String],
      default: [],
    },

    // Lifestyle
    activityLevel: {
      type: String,
      enum: [
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
      ],
    },

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    // Nutrition
    dietType: {
      type: String,
      enum: [
        "omnivore",
        "vegetarian",
        "vegan",
        "eggetarian",
        "other",
      ],
    },

    dietaryPreferences: {
      type: [String],
      default: [],
    },

    mealsPerDay: {
      type: Number,
      min: 1,
      max: 10,
    },

    // Additional information
    motivation: {
      type: String,
      maxlength: 1000,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FitnessProfile ||
  mongoose.model("FitnessProfile", FitnessProfileSchema);