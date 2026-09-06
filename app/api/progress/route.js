import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";

import WorkoutLog from "@/models/WorkoutLog";
import NutritionLog from "@/models/NutritionLog";
import FitnessProfile from "@/models/FitnessProfile";


// ============================================================
// DATE HELPERS
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


function getDateObject(dateString) {

  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  );

}


// ============================================================
// CURRENT STREAK
// ============================================================

function calculateWorkoutStreak(workoutLogs) {

  const completedDates = new Set(
    workoutLogs
      .filter(
        (log) =>
          log.status === "completed"
      )
      .map(
        (log) =>
          log.date
      )
  );


  if (!completedDates.size) {
    return 0;
  }


  let streak = 0;

  const today =
    new Date();


  for (
    let i = 0;
    i < 365;
    i++
  ) {

    const date =
      new Date(today);


    date.setDate(
      today.getDate() - i
    );


    const dateString =
      getDateString(date);


    if (
      completedDates.has(dateString)
    ) {

      streak++;

    } else {

      // Today may still be incomplete.
      if (i === 0) {
        continue;
      }

      break;

    }

  }


  return streak;

}


// ============================================================
// BEST STREAK
// ============================================================

function calculateBestStreak(workoutLogs) {

  const completedDates =
    new Set(
      workoutLogs
        .filter(
          (log) =>
            log.status === "completed"
        )
        .map(
          (log) =>
            log.date
        )
    );


  if (!completedDates.size) {
    return 0;
  }


  const sortedDates =
    Array.from(
      completedDates
    ).sort();


  let best = 1;

  let current = 1;


  for (
    let i = 1;
    i < sortedDates.length;
    i++
  ) {

    const previous =
      getDateObject(
        sortedDates[i - 1]
      );


    const currentDate =
      getDateObject(
        sortedDates[i]
      );


    const difference =
      (
        currentDate -
        previous
      ) /
      (
        1000 *
        60 *
        60 *
        24
      );


    if (
      difference === 1
    ) {

      current++;

      best =
        Math.max(
          best,
          current
        );

    } else {

      current = 1;

    }

  }


  return best;

}


// ============================================================
// XP
// ============================================================

function calculateXP({
  completedWorkouts,
  completedExercises,
  completedMeals,
}) {

  const workoutXP =
    completedWorkouts * 100;


  const exerciseXP =
    completedExercises * 10;


  const mealXP =
    completedMeals * 20;


  return (
    workoutXP +
    exerciseXP +
    mealXP
  );

}


// ============================================================
// RANK
// ============================================================

function calculateRank(xp) {

  if (xp >= 5000) {
    return "Diamond";
  }


  if (xp >= 2500) {
    return "Platinum";
  }


  if (xp >= 1000) {
    return "Gold";
  }


  if (xp >= 500) {
    return "Silver";
  }


  return "Bronze";

}


// ============================================================
// NEXT RANK
// ============================================================

function getNextRank(xp) {

  if (xp < 500) {

    return {
      rank: "Silver",
      requiredXP: 500,
    };

  }


  if (xp < 1000) {

    return {
      rank: "Gold",
      requiredXP: 1000,
    };

  }


  if (xp < 2500) {

    return {
      rank: "Platinum",
      requiredXP: 2500,
    };

  }


  if (xp < 5000) {

    return {
      rank: "Diamond",
      requiredXP: 5000,
    };

  }


  return {
    rank: "Diamond",
    requiredXP: 5000,
  };

}


// ============================================================
// DAILY ANALYTICS
// ============================================================

function buildDailyActivity({
  workoutLogs,
  nutritionLogs,
}) {

  const today =
    getDateString(
      new Date()
    );


  const days = [];


  for (
    let i = 29;
    i >= 0;
    i--
  ) {

    const date =
      getDateDaysAgo(i);


    const workout =
      workoutLogs.find(
        (log) =>
          log.date === date
      );


    const nutrition =
      nutritionLogs.find(
        (log) =>
          log.date === date
      );


    const exercises =
      workout?.exercises || [];


    const meals =
      nutrition?.meals || [];


    const completedExercises =
      exercises.filter(
        (exercise) =>
          exercise.completed
      ).length;


    const completedMeals =
      meals.filter(
        (meal) =>
          meal.completed
      ).length;


    const workoutCompleted =
      workout?.status ===
      "completed";


    const workoutExerciseCompletion =
      exercises.length > 0
        ? Math.round(
            (
              completedExercises /
              exercises.length
            ) * 100
          )
        : 0;


    const nutritionCompletion =
      meals.length > 0
        ? Math.round(
            (
              completedMeals /
              meals.length
            ) * 100
          )
        : 0;


    days.push({

      date,

      isToday:
        date === today,

      workout: {

        exists:
          !!workout,

        completed:
          workoutCompleted,

        exercises:
          exercises.length,

        completedExercises,

        completion:
          workoutExerciseCompletion,

      },

      nutrition: {

        exists:
          !!nutrition,

        meals:
          meals.length,

        completedMeals,

        completion:
          nutritionCompletion,

      },

      activity:
        workoutCompleted ||
        completedMeals > 0,

    });

  }


  return days;

}


// ============================================================
// WEEKLY ANALYTICS
// ============================================================

function buildWeeklyAnalytics({
  workoutLogs,
  nutritionLogs,
  targetWorkoutDays,
}) {

  const weeks = [];


  for (
    let week = 3;
    week >= 0;
    week--
  ) {

    const endOffset =
      week * 7;


    const startOffset =
      endOffset + 6;


    const startDate =
      getDateDaysAgo(
        startOffset
      );


    const endDate =
      getDateDaysAgo(
        endOffset
      );


    const weeklyWorkoutLogs =
      workoutLogs.filter(
        (log) =>
          log.date >= startDate &&
          log.date <= endDate
      );


    const weeklyNutritionLogs =
      nutritionLogs.filter(
        (log) =>
          log.date >= startDate &&
          log.date <= endDate
      );


    const completedWorkouts =
      weeklyWorkoutLogs.filter(
        (log) =>
          log.status === "completed"
      ).length;


    const totalMeals =
      weeklyNutritionLogs.reduce(
        (total, log) =>
          total +
          (log.meals || []).length,
        0
      );


    const completedMeals =
      weeklyNutritionLogs.reduce(
        (total, log) =>
          total +
          (log.meals || []).filter(
            (meal) =>
              meal.completed
          ).length,
        0
      );


    const workoutCompletion =
      targetWorkoutDays > 0
        ? Math.min(
            100,
            Math.round(
              (
                completedWorkouts /
                targetWorkoutDays
              ) * 100
            )
          )
        : 0;


    const nutritionCompletion =
      totalMeals > 0
        ? Math.round(
            (
              completedMeals /
              totalMeals
            ) * 100
          )
        : 0;


    const overallConsistency =
      Math.round(
        (
          workoutCompletion +
          nutritionCompletion
        ) / 2
      );


    weeks.push({

      week:
        4 - week,

      from:
        startDate,

      to:
        endDate,

      completedWorkouts,

      targetWorkouts:
        targetWorkoutDays,

      workoutCompletion,

      completedMeals,

      totalMeals,

      nutritionCompletion,

      overallConsistency,

    });

  }


  return weeks;

}


// ============================================================
// GET PROGRESS
// ============================================================

export async function GET() {

  try {

    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const session =
      await getServerSession(
        authOptions
      );


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


    // ========================================================
    // DATABASE
    // ========================================================

    await connectDB();


    const userId =
      session.user.id;


    // ========================================================
    // DATE RANGE
    // ========================================================

    const today =
      getDateString(
        new Date()
      );


    const thirtyDaysAgo =
      getDateDaysAgo(30);


    const sevenDaysAgo =
      getDateDaysAgo(6);


    // ========================================================
    // LOAD DATA
    // ========================================================

    const [
      workoutLogs,
      nutritionLogs,
      profile,
    ] = await Promise.all([

      WorkoutLog.find({
        userId,
        date: {
          $gte: thirtyDaysAgo,
          $lte: today,
        },
      })
        .sort({
          date: 1,
        })
        .lean(),


      NutritionLog.find({
        userId,
        date: {
          $gte: thirtyDaysAgo,
          $lte: today,
        },
      })
        .sort({
          date: 1,
        })
        .lean(),


      FitnessProfile.findOne({
        userId,
      }).lean(),

    ]);


    // ========================================================
    // WORKOUT STATISTICS
    // ========================================================

    const completedWorkoutLogs =
      workoutLogs.filter(
        (log) =>
          log.status === "completed"
      );


    const completedWorkouts =
      completedWorkoutLogs.length;


    const totalWorkoutDays =
      workoutLogs.length;


    const completedExercises =
      workoutLogs.reduce(
        (total, log) =>
          total +
          (log.exercises || []).filter(
            (exercise) =>
              exercise.completed
          ).length,
        0
      );


    const totalExercises =
      workoutLogs.reduce(
        (total, log) =>
          total +
          (log.exercises || []).length,
        0
      );


    const workoutCompletion =
      totalWorkoutDays > 0
        ? Math.round(
            (
              completedWorkouts /
              totalWorkoutDays
            ) * 100
          )
        : 0;


    const exerciseCompletion =
      totalExercises > 0
        ? Math.round(
            (
              completedExercises /
              totalExercises
            ) * 100
          )
        : 0;


    // ========================================================
    // WEEKLY WORKOUTS
    // ========================================================

    const weeklyWorkoutLogs =
      workoutLogs.filter(
        (log) =>
          log.date >=
          sevenDaysAgo
      );


    const weeklyCompletedWorkouts =
      weeklyWorkoutLogs.filter(
        (log) =>
          log.status === "completed"
      ).length;


    const targetWorkoutDays =
      profile?.workoutDays || 0;


    const weeklyActivity =
      targetWorkoutDays > 0
        ? Math.min(
            100,
            Math.round(
              (
                weeklyCompletedWorkouts /
                targetWorkoutDays
              ) * 100
            )
          )
        : 0;


    // ========================================================
    // NUTRITION
    // ========================================================

    const totalMeals =
      nutritionLogs.reduce(
        (total, log) =>
          total +
          (log.meals || []).length,
        0
      );


    const completedMeals =
      nutritionLogs.reduce(
        (total, log) =>
          total +
          (log.meals || []).filter(
            (meal) =>
              meal.completed
          ).length,
        0
      );


    const nutritionCompletion =
      totalMeals > 0
        ? Math.round(
            (
              completedMeals /
              totalMeals
            ) * 100
          )
        : 0;


    // ========================================================
    // STREAKS
    // ========================================================

    const currentStreak =
      calculateWorkoutStreak(
        workoutLogs
      );


    const bestStreak =
      calculateBestStreak(
        workoutLogs
      );


    // ========================================================
    // XP
    // ========================================================

    const xp =
      calculateXP({

        completedWorkouts,

        completedExercises,

        completedMeals,

      });


    // ========================================================
    // RANK
    // ========================================================

    const rank =
      calculateRank(xp);


    const nextRank =
      getNextRank(xp);


    const xpProgress =
      xp >= nextRank.requiredXP
        ? 100
        : Math.round(
            (
              xp /
              nextRank.requiredXP
            ) * 100
          );


    // ========================================================
    // DAILY ANALYTICS
    // ========================================================

    const dailyActivity =
      buildDailyActivity({

        workoutLogs,

        nutritionLogs,

      });


    // ========================================================
    // WEEKLY ANALYTICS
    // ========================================================

    const weeklyAnalytics =
      buildWeeklyAnalytics({

        workoutLogs,

        nutritionLogs,

        targetWorkoutDays,

      });


    // ========================================================
    // RECENT HISTORY
    // ========================================================

    const recentHistory = [];


    const historyDates =
      new Set([

        ...workoutLogs.map(
          (log) =>
            log.date
        ),

        ...nutritionLogs.map(
          (log) =>
            log.date
        ),

      ]);


    Array.from(historyDates)
      .sort()
      .reverse()
      .slice(0, 14)
      .forEach(
        (date) => {

          const workout =
            workoutLogs.find(
              (log) =>
                log.date ===
                date
            );


          const nutrition =
            nutritionLogs.find(
              (log) =>
                log.date ===
                date
            );


          const exercises =
            workout?.exercises ||
            [];


          const meals =
            nutrition?.meals ||
            [];


          const completedExerciseCount =
            exercises.filter(
              (exercise) =>
                exercise.completed
            ).length;


          const completedMealCount =
            meals.filter(
              (meal) =>
                meal.completed
            ).length;


          recentHistory.push({

            date,

            workout: {

              exists:
                !!workout,

              completed:
                workout?.status ===
                "completed",

              exercises:
                exercises.length,

              completedExercises:
                completedExerciseCount,

            },

            nutrition: {

              exists:
                !!nutrition,

              meals:
                meals.length,

              completedMeals:
                completedMealCount,

            },

          });

        }
      );


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({

      success: true,


      period: {

        from:
          thirtyDaysAgo,

        to:
          today,

      },


      workout: {

        completed:
          completedWorkouts,

        total:
          totalWorkoutDays,

        completion:
          workoutCompletion,

        exercisesCompleted:
          completedExercises,

        totalExercises,

        exerciseCompletion,

        weeklyCompleted:
          weeklyCompletedWorkouts,

        weeklyTarget:
          targetWorkoutDays,

        weeklyActivity,

      },


      nutrition: {

        completedMeals,

        totalMeals,

        completion:
          nutritionCompletion,

      },


      streak: {

        current:
          currentStreak,

        best:
          bestStreak,

      },


      gamification: {

        xp,

        rank,

        nextRank:
          nextRank.rank,

        nextRankXP:
          nextRank.requiredXP,

        xpProgress,

      },


      analytics: {

        dailyActivity,

        weeklyAnalytics,

      },


      recentHistory,

    });

  } catch (error) {

    console.error(
      "GET PROGRESS ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load progress.",
      },
      {
        status: 500,
      }
    );

  }

}