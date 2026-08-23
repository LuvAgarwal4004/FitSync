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
// HELPERS
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
// GET
// RETURN RECENT INSIGHTS
// ============================================================

export async function GET() {

  try {

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


    const insights =
      await AIInsight.find({
        userId: session.user.id,
        status: "active",
      })
        .sort({
          createdAt: -1,
        })
        .limit(20)
        .lean();


    return NextResponse.json({
      success: true,
      insights,
    });


  } catch (error) {

    console.error(
      "GET AI INSIGHTS ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error: "Failed to load AI insights.",
      },
      {
        status: 500,
      }
    );

  }

}


// ============================================================
// POST
// ANALYZE LAST 30 DAYS
// ============================================================

export async function POST() {

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
    // DATE RANGE
    // ==========================================================

    const periodEnd =
      getDateString(new Date());

    const periodStart =
      getDateDaysAgo(30);


    // ==========================================================
    // LOAD USER DATA
    // ==========================================================

    const [
      profile,
      workoutPlan,
      nutritionPlan,
      workoutLogs,
      nutritionLogs,
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
      })
        .sort({
          date: 1,
        })
        .lean(),

      NutritionLog.find({
        userId,
        date: {
          $gte: periodStart,
          $lte: periodEnd,
        },
      })
        .sort({
          date: 1,
        })
        .lean(),

    ]);


    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

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
    // CALCULATE WORKOUT STATS
    // ==========================================================

    const workoutStats = {

      totalLoggedDays:
        workoutLogs.length,

      completedDays:
        workoutLogs.filter(
          log =>
            log.status === "completed"
        ).length,

      startedDays:
        workoutLogs.filter(
          log =>
            log.status === "in_progress" ||
            log.status === "completed"
        ).length,

      totalExercises:
        workoutLogs.reduce(
          (total, log) =>
            total +
            (log.exercises?.length || 0),
          0
        ),

      completedExercises:
        workoutLogs.reduce(
          (total, log) =>
            total +
            (log.exercises || []).filter(
              exercise =>
                exercise.completed
            ).length,
          0
        ),

    };


    workoutStats.exerciseCompletionRate =
      workoutStats.totalExercises > 0
        ? Math.round(
            (
              workoutStats.completedExercises /
              workoutStats.totalExercises
            ) * 100
          )
        : 0;


    // ==========================================================
    // FIND EXERCISES THAT ARE OFTEN SKIPPED
    // ==========================================================

    const exerciseStats = {};


    for (const log of workoutLogs) {

      for (const exercise of log.exercises || []) {

        const key =
          exercise.exerciseName;


        if (!exerciseStats[key]) {

          exerciseStats[key] = {
            name: key,
            planned: 0,
            completed: 0,
          };

        }


        exerciseStats[key].planned += 1;


        if (exercise.completed) {

          exerciseStats[key].completed += 1;

        }

      }

    }


    const exercisePatterns =
      Object.values(exerciseStats)
        .map(exercise => ({

          ...exercise,

          completionRate:
            exercise.planned > 0
              ? Math.round(
                  (
                    exercise.completed /
                    exercise.planned
                  ) * 100
                )
              : 0,

        }))
        .sort(
          (a, b) =>
            a.completionRate -
            b.completionRate
        );


    // ==========================================================
    // NUTRITION STATS
    // ==========================================================

    const nutritionStats = {

      totalLoggedDays:
        nutritionLogs.length,

      totalMeals:
        nutritionLogs.reduce(
          (total, log) =>
            total +
            (log.meals?.length || 0),
          0
        ),

      completedMeals:
        nutritionLogs.reduce(
          (total, log) =>
            total +
            (log.meals || []).filter(
              meal =>
                meal.completed
            ).length,
          0
        ),

    };


    nutritionStats.mealCompletionRate =
      nutritionStats.totalMeals > 0
        ? Math.round(
            (
              nutritionStats.completedMeals /
              nutritionStats.totalMeals
            ) * 100
          )
        : 0;


    // ==========================================================
    // AI PROMPT
    // ==========================================================

    const prompt = `
You are FitSync AI's adaptive fitness analysis engine.

Your job is NOT to blindly change the user's fitness plan.

Analyze the user's actual behavior over the last 30 days.

Identify meaningful patterns.

You may recommend:

- keeping the current workout plan
- replacing repeatedly skipped exercises
- reducing unrealistic workout volume
- increasing progression when consistency is very high
- improving workout consistency
- modifying nutrition adherence
- simplifying meals that are repeatedly skipped
- maintaining the current nutrition plan when adherence is good

IMPORTANT:

Never recommend an aggressive change merely because of one missed workout.

Look for repeated patterns.

Do not diagnose medical conditions.

Do not make dangerous recommendations.

Do not recommend extreme calorie restriction.

Do not automatically change the user's plan.

The system will show your recommendation to the user first.

Return ONLY JSON.

USER PROFILE:

Age:
${profile.age}

Gender:
${profile.gender || "Not specified"}

Primary goal:
${profile.primaryGoal}

Experience:
${profile.experienceLevel}

Workout days per week:
${profile.workoutDays}

Workout duration:
${profile.workoutDuration}

Workout location:
${profile.workoutLocation}

Equipment:
${profile.equipment?.join(", ") || "None"}

Activity level:
${profile.activityLevel}

Sleep:
${profile.sleepHours}

Diet:
${profile.dietType}

Meals per day:
${profile.mealsPerDay}


CURRENT WORKOUT PLAN:

${JSON.stringify(workoutPlan || {})}


CURRENT NUTRITION PLAN:

${JSON.stringify(nutritionPlan || {})}


WORKOUT STATISTICS:

${JSON.stringify(workoutStats)}


EXERCISE PATTERNS:

${JSON.stringify(exercisePatterns)}


NUTRITION STATISTICS:

${JSON.stringify(nutritionStats)}


WORKOUT LOG HISTORY:

${JSON.stringify(workoutLogs)}


NUTRITION LOG HISTORY:

${JSON.stringify(nutritionLogs)}


Return this exact structure:

{
  "insights": [
    {
      "type": "workout | nutrition | general",
      "severity": "info | positive | warning",
      "title": "short title",
      "message": "what the AI noticed",
      "recommendation": "what the user should consider",
      "action": "none | adapt_workout | adapt_nutrition"
    }
  ]
}

Rules:

- Return between 1 and 5 insights.
- Only include meaningful insights.
- Do not invent behavior that is not supported by the logs.
- If adherence is good, explicitly recognize it.
- If an exercise has a consistently low completion rate, mention it.
- If nutrition adherence is consistently good, recognize it.
- If the data is insufficient for a meaningful recommendation, say so.
`;


    // ==========================================================
    // GEMINI
    // ==========================================================

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

              insights: {

                type: "array",

                items: {

                  type: "object",

                  properties: {

                    type: {
                      type: "string",
                      enum: [
                        "workout",
                        "nutrition",
                        "general",
                      ],
                    },

                    severity: {
                      type: "string",
                      enum: [
                        "info",
                        "positive",
                        "warning",
                      ],
                    },

                    title: {
                      type: "string",
                    },

                    message: {
                      type: "string",
                    },

                    recommendation: {
                      type: "string",
                    },

                    action: {
                      type: "string",
                      enum: [
                        "none",
                        "adapt_workout",
                        "adapt_nutrition",
                      ],
                    },

                  },

                  required: [
                    "type",
                    "severity",
                    "title",
                    "message",
                    "recommendation",
                    "action",
                  ],

                },

              },

            },

            required: [
              "insights",
            ],

          },

        },

      });


    // ==========================================================
    // PARSE
    // ==========================================================

    const generated =
      JSON.parse(response.text);


    // ==========================================================
    // REMOVE OLD ACTIVE INSIGHTS
    // ==========================================================

    await AIInsight.updateMany(
      {
        userId,
        status: "active",
      },
      {
        $set: {
          status: "dismissed",
        },
      }
    );


    // ==========================================================
    // SAVE NEW INSIGHTS
    // ==========================================================

    const documents =
      (generated.insights || []).map(
        insight => ({

          userId,

          type:
            insight.type,

          severity:
            insight.severity,

          title:
            insight.title,

          message:
            insight.message,

          recommendation:
            insight.recommendation,

          action:
            insight.action,

          data: {
            workoutStats,
            nutritionStats,
            exercisePatterns,
          },

          status:
            "active",

          periodStart,

          periodEnd,

          generatedBy:
            "gemini",

          model:
            "gemini-3.6-flash",

        })
      );


    const savedInsights =
      documents.length
        ? await AIInsight.insertMany(
            documents
          )
        : [];


    return NextResponse.json({

      success: true,

      period: {
        start: periodStart,
        end: periodEnd,
      },

      stats: {
        workout: workoutStats,
        nutrition: nutritionStats,
        exercises: exercisePatterns,
      },

      insights: savedInsights,

    });


  } catch (error) {

    console.error(
      "GENERATE AI INSIGHTS ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to generate AI insights.",
      },
      {
        status: 500,
      }
    );

  }

}