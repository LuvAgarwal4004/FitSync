import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import WorkoutPlan from "@/models/WorkoutPlan";
import WorkoutLog from "@/models/WorkoutLog";


// ============================================================
// VALIDATE DATE
// ============================================================

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}


// ============================================================
// GET TODAY'S WORKOUT LOG
// ============================================================

export async function GET(request) {
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


    const { searchParams } =
      new URL(request.url);

    const date =
      searchParams.get("date");


    if (!date || !isValidDate(date)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid date is required.",
        },
        {
          status: 400,
        }
      );
    }


    await connectDB();


    const log =
      await WorkoutLog.findOne({
        userId: session.user.id,
        date,
      }).lean();


    return NextResponse.json({
      success: true,
      log: log || null,
    });


  } catch (error) {

    console.error(
      "GET WORKOUT LOG ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load workout tracking.",
      },
      {
        status: 500,
      }
    );
  }
}


// ============================================================
// START WORKOUT
// ============================================================

export async function POST(request) {

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


    const body = await request.json();


    const {
      date,
      dayNumber,
    } = body;


    if (
      !date ||
      !isValidDate(date) ||
      !Number.isInteger(dayNumber)
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "date and dayNumber are required.",
        },
        {
          status: 400,
        }
      );

    }


    await connectDB();


    // ========================================================
    // LOAD USER'S PLAN
    // ========================================================

    const plan =
      await WorkoutPlan.findOne({
        userId: session.user.id,
        active: true,
      }).lean();


    if (!plan) {

      return NextResponse.json(
        {
          success: false,
          error: "No active workout plan found.",
        },
        {
          status: 404,
        }
      );

    }


    // ========================================================
    // FIND REQUESTED DAY
    // ========================================================

    const workoutDay =
      plan.days.find(
        (day) =>
          day.dayNumber === dayNumber
      );


    if (!workoutDay) {

      return NextResponse.json(
        {
          success: false,
          error: "Workout day not found.",
        },
        {
          status: 404,
        }
      );

    }


    // ========================================================
    // CREATE EXERCISE LOGS
    // ========================================================

    const exercises =
      workoutDay.exercises.map(
        (exercise, index) => ({
          exerciseIndex: index,
          exerciseName: exercise.name,
          completed: false,
          completedAt: null,
        })
      );


    // ========================================================
    // CREATE OR RETURN EXISTING LOG
    // ========================================================

    const existing =
      await WorkoutLog.findOne({
        userId: session.user.id,
        date,
      });


    if (existing) {

      return NextResponse.json({
        success: true,
        log: existing,
      });

    }


    const log =
      await WorkoutLog.create({

        userId:
          session.user.id,

        workoutPlanId:
          plan._id,

        dayNumber,

        date,

        status:
          "in_progress",

        startedAt:
          new Date(),

        exercises,

      });


    return NextResponse.json({
      success: true,
      log,
    });


  } catch (error) {

    console.error(
      "START WORKOUT ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to start workout.",
      },
      {
        status: 500,
      }
    );
  }
}