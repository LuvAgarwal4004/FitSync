import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";

import FitnessProfile from "@/models/FitnessProfile";
import WorkoutPlan from "@/models/WorkoutPlan";
import NutritionPlan from "@/models/NutritionPlan";
import WorkoutLog from "@/models/WorkoutLog";
import NutritionLog from "@/models/NutritionLog";
import AIInsight from "@/models/AIInsight";

import ai from "@/lib/gemini";


// ============================================================
// DATE
// ============================================================

function getDateString(date) {
  return date.toISOString().split("T")[0];
}


function getDateDaysAgo(days) {

  const date = new Date();

  date.setDate(
    date.getDate() - days
  );

  return getDateString(date);
}


// ============================================================
// POST
// ADAPT PLAN AFTER USER APPROVAL
// ============================================================

export async function POST(request) {

  try {

    // ==========================================================
    // AUTH
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


    await connectDB();


    const userId =
      session.user.id;


    // ==========================================================
    // BODY
    // ==========================================================

    let body;

    try {

      body =
        await request.json();

    } catch {

      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
      );

    }


    const type =
      body.type;


    if (
      type !== "workout" &&
      type !== "nutrition"
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "type must be workout or nutrition.",
        },
        {
          status: 400,
        }
      );

    }


    // ==========================================================
    // LOAD DATA
    // ==========================================================

    const periodStart =
      getDateDaysAgo(30);

    const periodEnd =
      getDateString(new Date());


    const [
      profile,
      workoutPlan,
      nutritionPlan,
      workoutLogs,
      nutritionLogs,
      insights,
    ] = await Promise.all([

      FitnessProfile.findOne({
        userId,
      }).lean(),

      WorkoutPlan.findOne({
        userId,
        active: true,
      }).lean(),

      NutritionPlan.findOne({
        userId,
      }).lean(),

      WorkoutLog.find({
        userId,
        date: {
          $gte: periodStart,
          $lte: periodEnd,
        },
      }).lean(),

      NutritionLog.find({
        userId,
        date: {
          $gte: periodStart,
          $lte: periodEnd,
        },
      }).lean(),

      AIInsight.find({
        userId,
        status: "active",
        action:
          type === "workout"
            ? "adapt_workout"
            : "adapt_nutrition",
      }).lean(),

    ]);


    if (!profile) {

      return NextResponse.json(
        {
          success: false,
          error: "Fitness profile not found.",
        },
        {
          status: 400,
        }
      );

    }


    // ==========================================================
    // WORKOUT ADAPTATION
    // ==========================================================

    if (type === "workout") {

      if (!workoutPlan) {

        return NextResponse.json(
          {
            success: false,
            error:
              "No active workout plan found.",
          },
          {
            status: 400,
          }
        );

      }


      const prompt = `
You are FitSync AI.

The user has explicitly approved adapting their workout plan.

Create an IMPROVED version of the current workout plan.

Use the user's actual workout history.

Do NOT completely redesign the plan unless the data strongly supports it.

Preserve:

- user's goal
- experience level
- workout frequency
- workout duration
- workout location
- available equipment

Use the behavior data to make sensible adjustments.

Examples:

- repeatedly skipped exercise -> replace it with a practical alternative
- consistently completed everything -> consider modest progression
- repeatedly incomplete workouts -> reduce unnecessary volume
- inconsistent schedule -> make the plan more realistic

Do not make extreme changes.

Do not diagnose medical conditions.

Return ONLY the complete workout plan JSON.

USER PROFILE:

${JSON.stringify(profile)}

CURRENT PLAN:

${JSON.stringify(workoutPlan)}

LAST 30 DAYS:

${JSON.stringify(workoutLogs)}

AI INSIGHTS:

${JSON.stringify(insights)}
`;


      const response =
        await ai.models.generateContent({

          model: "gemini-3.6-flash",

          contents: prompt,

          config: {

            responseMimeType:
              "application/json",

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


      const generated =
        JSON.parse(response.text);


      const updatedPlan =
        await WorkoutPlan.findOneAndUpdate(

          {
            userId,
            active: true,
          },

          {
            $set: {

              ...generated,

              userId,

              generatedBy:
                "gemini-adaptive",

              model:
                "gemini-3.6-flash",

              generatedAt:
                new Date(),

            },

            $inc: {
              version: 1,
            },

          },

          {
            new: true,
            runValidators: true,
          }

        );


      await AIInsight.updateMany(

        {
          userId,

          status: "active",

          action:
            "adapt_workout",

        },

        {
          $set: {
            status: "applied",
          },

        }

      );


      return NextResponse.json({

        success: true,

        type: "workout",

        plan: updatedPlan,

      });

    }


    // ==========================================================
    // NUTRITION ADAPTATION
    // ==========================================================

    if (type === "nutrition") {

      if (!nutritionPlan) {

        return NextResponse.json(
          {
            success: false,
            error:
              "No nutrition plan found.",
          },
          {
            status: 400,
          }
        );

      }


      const prompt = `
You are FitSync AI.

The user has explicitly approved adapting their nutrition plan.

Create an improved version of the current nutrition plan.

Use the user's actual meal completion history.

Do NOT make extreme dietary changes.

Do NOT prescribe medical diets.

Preserve the user's:

- dietary type
- dietary preferences
- meals per day
- fitness goal
- practical constraints

If meals are repeatedly skipped, make them simpler or more practical.

If adherence is high, only make modest improvements when justified.

Return ONLY the complete nutrition plan JSON.

USER PROFILE:

${JSON.stringify(profile)}

CURRENT NUTRITION PLAN:

${JSON.stringify(nutritionPlan)}

LAST 30 DAYS:

${JSON.stringify(nutritionLogs)}

AI INSIGHTS:

${JSON.stringify(insights)}
`;


      const response =
        await ai.models.generateContent({

          model:
            "gemini-3.6-flash",

          contents:
            prompt,

          config: {

            responseMimeType:
              "application/json",

          },

        });


      const generated =
        JSON.parse(response.text);


      const updatedPlan =
        await NutritionPlan.findOneAndUpdate(

          {
            userId,
          },

          {
            $set: {

              ...generated,

              userId,

              generatedBy:
                "gemini-adaptive",

              generatedAt:
                new Date(),

            },

            $inc: {
              version: 1,
            },

          },

          {
            new: true,

            upsert: true,

            runValidators: true,

          }

        );


      await AIInsight.updateMany(

        {
          userId,

          status: "active",

          action:
            "adapt_nutrition",

        },

        {
          $set: {
            status: "applied",
          },

        }

      );


      return NextResponse.json({

        success: true,

        type: "nutrition",

        plan: updatedPlan,

      });

    }


  } catch (error) {

    console.error(
      "ADAPT PLAN ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to adapt plan.",
      },
      {
        status: 500,
      }
    );

  }

}