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

  date.setDate(date.getDate() - days);

  return getDateString(date);

}


// ============================================================
// CALCULATE CURRENT STREAK
// ============================================================

function calculateWorkoutStreak(workoutLogs) {

  if (!workoutLogs.length) {
    return 0;
  }


  const completedDates = new Set(
    workoutLogs
      .filter(
        (log) =>
          log.status === "completed"
      )
      .map(
        (log) => log.date
      )
  );


  let streak = 0;

  const today =
    new Date();


  for (let i = 0; i < 365; i++) {

    const date = new Date(today);

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

      // Allow today to be incomplete
      // without immediately breaking
      // yesterday's streak.

      if (i === 0) {
        continue;
      }

      break;

    }

  }


  return streak;

}


// ============================================================
// CALCULATE BEST STREAK
// ============================================================

function calculateBestStreak(workoutLogs) {

  const completedDates = new Set(
    workoutLogs
      .filter(
        (log) =>
          log.status === "completed"
      )
      .map(
        (log) => log.date
      )
  );


  if (!completedDates.size) {
    return 0;
  }


  const sortedDates =
    Array.from(completedDates)
      .sort();


  let best = 1;
  let current = 1;


  for (
    let i = 1;
    i < sortedDates.length;
    i++
  ) {

    const previous =
      new Date(
        `${sortedDates[i - 1]}T00:00:00`
      );

    const currentDate =
      new Date(
        `${sortedDates[i]}T00:00:00`
      );


    const difference =
      (
        currentDate - previous
      ) /
      (
        1000 * 60 * 60 * 24
      );


    if (difference === 1) {

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
// GET PROGRESS
// ============================================================

export async function GET() {

  try {

    // ========================================================
    // AUTH
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
      getDateDaysAgo(7);


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
          log.date >= sevenDaysAgo
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
    // NUTRITION STATISTICS
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
    // RECENT HISTORY
    // ========================================================

    const recentHistory = [];


    const historyDates =
      new Set([
        ...workoutLogs.map(
          (log) => log.date
        ),
        ...nutritionLogs.map(
          (log) => log.date
        ),
      ]);


    Array.from(historyDates)
      .sort()
      .reverse()
      .slice(0, 14)
      .forEach((date) => {

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

            exists: !!workout,

            completed:
              workout?.status ===
              "completed",

            exercises:
              exercises.length,

            completedExercises:
              completedExerciseCount,

          },

          nutrition: {

            exists: !!nutrition,

            meals:
              meals.length,

            completedMeals:
              completedMealCount,

          },

        });

      });


    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json({

      success: true,

      period: {
        from: thirtyDaysAgo,
        to: today,
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