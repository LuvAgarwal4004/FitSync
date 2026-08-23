import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import FitnessProfile from "@/models/FitnessProfile";
import WorkoutPlan from "@/models/WorkoutPlan";

import ai from "@/lib/gemini";


// ============================================================
// GET
// LOAD THE USER'S EXISTING WORKOUT PLAN
// ============================================================

export async function GET() {

  try {

    // ==========================================================
    // 1. AUTHENTICATION
    // ==========================================================

    const session =
      await getServerSession(authOptions);


    if (!session?.user?.id) {

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    // ==========================================================
    // 2. DATABASE
    // ==========================================================

    await connectDB();


    // ==========================================================
    // 3. FIND USER'S WORKOUT PLAN
    // ==========================================================

    const workoutPlan =
      await WorkoutPlan.findOne({
        userId: session.user.id,
        active: true,
      }).lean();


    // ==========================================================
    // 4. NO PLAN
    // ==========================================================

    if (!workoutPlan) {

      return NextResponse.json(
        {
          success: true,
          exists: false,
          plan: null,
        },
        {
          status: 200,
        }
      );

    }


    // ==========================================================
    // 5. RETURN PLAN
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        exists: true,
        plan: workoutPlan,
      },
      {
        status: 200,
      }
    );


  } catch (error) {

    console.error(
      "GET WORKOUT PLAN ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error: "Failed to load workout plan.",
      },
      {
        status: 500,
      }
    );

  }

}



// ============================================================
// POST
// GENERATE / REGENERATE WORKOUT
// ============================================================

export async function POST() {

  try {

    // ==========================================================
    // 1. AUTHENTICATION
    // ==========================================================

    const session =
      await getServerSession(authOptions);


    if (!session?.user?.id) {

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }


    // ==========================================================
    // 2. DATABASE
    // ==========================================================

    await connectDB();


    // ==========================================================
    // 3. GET FITNESS PROFILE
    // ==========================================================

    const profile =
      await FitnessProfile.findOne({
        userId: session.user.id,
      }).lean();


    if (!profile || !profile.completed) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Please complete your fitness profile first.",
        },
        {
          status: 400,
        }
      );

    }


    // ==========================================================
    // 4. CHECK EXISTING PLAN
    // ==========================================================

    const existingPlan =
      await WorkoutPlan.findOne({
        userId: session.user.id,
        active: true,
      }).lean();


    /*
      IMPORTANT

      POST is being used for generation.

      If a plan already exists, we return it.

      This prevents accidental Gemini API calls
      when the frontend simply wants to load the plan.
    */

    if (existingPlan) {

      return NextResponse.json(
        {
          success: true,
          exists: true,
          plan: existingPlan,
        },
        {
          status: 200,
        }
      );

    }


    // ==========================================================
    // 5. GEMINI PROMPT
    // ==========================================================

    const prompt = `
You are FitSync AI, a personalized fitness planning engine.

Create a realistic weekly workout plan for this user.

You MUST use the user's provided fitness profile.

Do not ask the user questions.

Do not require an additional prompt.

Do not invent missing information.

Respect:

- user's goal
- experience level
- workout days
- workout duration
- workout location
- available equipment
- activity level
- recovery/sleep information

The workout must be practical and progressive.

Do not diagnose or treat medical conditions.

If information suggests a medical concern, keep the recommendation conservative
and recommend consulting an appropriate healthcare professional.

USER PROFILE:

Age:
${profile.age}

Gender:
${profile.gender || "Not specified"}

Height:
${profile.height?.value} ${profile.height?.unit}

Weight:
${profile.weight?.value} ${profile.weight?.unit}

Primary goal:
${profile.primaryGoal}

Experience level:
${profile.experienceLevel}

Workout days per week:
${profile.workoutDays}

Workout duration:
${profile.workoutDuration} minutes

Workout location:
${profile.workoutLocation}

Available equipment:
${profile.equipment?.join(", ") || "No equipment"}

Activity level:
${profile.activityLevel}

Average sleep:
${profile.sleepHours} hours

Diet type:
${profile.dietType}

Dietary preferences:
${profile.dietaryPreferences?.join(", ") || "None"}

Meals per day:
${profile.mealsPerDay}

Motivation:
${profile.motivation || "Not specified"}


CREATE:

1. A title for the workout plan.
2. A short description.
3. Overall training strategy.
4. A workout for each training day.
5. Warm-up exercises.
6. Main exercises.
7. Sets and repetitions.
8. Rest periods.
9. Exercise instructions.
10. Target muscles.
11. Cooldown.
12. Progression advice.
13. Recovery advice.

The number of workout days MUST match the user's requested
workout frequency.

The approximate duration of each workout MUST fit within the
user's requested workout duration.

Only use equipment the user has available.

Return ONLY structured JSON.
`;


    // ==========================================================
    // 6. GEMINI
    // ==========================================================

    const response =
      await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: prompt,

        config: {

          responseMimeType: "application/json",

          responseSchema: {

            type: "object",

            properties: {

              title: {
                type: "string",
              },

              description: {
                type: "string",
              },

              primaryGoal: {
                type: "string",
              },

              experienceLevel: {
                type: "string",
              },

              workoutDaysPerWeek: {
                type: "integer",
              },

              workoutDuration: {
                type: "integer",
              },

              strategy: {
                type: "string",
              },

              progressionAdvice: {

                type: "array",

                items: {
                  type: "string",
                },

              },

              recoveryAdvice: {

                type: "array",

                items: {
                  type: "string",
                },

              },

              days: {

                type: "array",

                items: {

                  type: "object",

                  properties: {

                    dayNumber: {
                      type: "integer",
                    },

                    title: {
                      type: "string",
                    },

                    focus: {
                      type: "string",
                    },

                    estimatedDuration: {
                      type: "integer",
                    },

                    warmup: {

                      type: "array",

                      items: {
                        type: "string",
                      },

                    },

                    exercises: {

                      type: "array",

                      items: {

                        type: "object",

                        properties: {

                          name: {
                            type: "string",
                          },

                          sets: {
                            type: "integer",
                          },

                          reps: {
                            type: "string",
                          },

                          restSeconds: {
                            type: "integer",
                          },

                          instructions: {
                            type: "string",
                          },

                          targetMuscles: {

                            type: "array",

                            items: {
                              type: "string",
                            },

                          },

                        },

                        required: [
                          "name",
                          "sets",
                          "reps",
                          "restSeconds",
                          "instructions",
                          "targetMuscles",
                        ],

                      },

                    },

                    cooldown: {

                      type: "array",

                      items: {
                        type: "string",
                      },

                    },

                  },

                  required: [
                    "dayNumber",
                    "title",
                    "focus",
                    "estimatedDuration",
                    "warmup",
                    "exercises",
                    "cooldown",
                  ],

                },

              },

            },

            required: [
              "title",
              "description",
              "primaryGoal",
              "experienceLevel",
              "workoutDaysPerWeek",
              "workoutDuration",
              "strategy",
              "progressionAdvice",
              "recoveryAdvice",
              "days",
            ],

          },

        },

      });


    // ==========================================================
    // 7. PARSE RESPONSE
    // ==========================================================

    const generatedPlan =
      JSON.parse(response.text);


    // ==========================================================
    // 8. SAVE
    // ==========================================================

    const workoutPlan =
      await WorkoutPlan.findOneAndUpdate(

        {
          userId: session.user.id,
        },

        {
          $set: {

            ...generatedPlan,

            userId: session.user.id,

            generatedBy: "gemini",

            model: "gemini-3.6-flash",

            active: true,

          },

          $setOnInsert: {

            version: 1,

          },

        },

        {
          new: true,

          upsert: true,

          runValidators: true,

        }

      );


    // ==========================================================
    // 9. RETURN
    // ==========================================================

    return NextResponse.json(
      {
        success: true,
        exists: false,
        plan: workoutPlan,
      },
      {
        status: 200,
      }
    );


  } catch (error) {

    console.error(
      "GENERATE WORKOUT ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to generate workout.",
      },
      {
        status: 500,
      }
    );

  }

}