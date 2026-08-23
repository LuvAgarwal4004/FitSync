import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import WorkoutLog from "@/models/WorkoutLog";


// ============================================================
// COMPLETE / UNCOMPLETE EXERCISE
// ============================================================

export async function PATCH(request) {

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


    const body =
      await request.json();


    const {
      date,
      exerciseIndex,
      completed,
    } = body;


    if (
      !date ||
      !Number.isInteger(exerciseIndex) ||
      typeof completed !== "boolean"
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      );

    }


    await connectDB();


    // ========================================================
    // FIND USER'S OWN LOG
    // ========================================================

    const log =
      await WorkoutLog.findOne({
        userId: session.user.id,
        date,
      });


    if (!log) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Workout has not been started.",
        },
        {
          status: 404,
        }
      );

    }


    // ========================================================
    // PREVENT CHANGING COMPLETED WORKOUT
    // ========================================================

    if (log.status === "completed") {

      return NextResponse.json(
        {
          success: false,
          error:
            "This workout is already completed.",
        },
        {
          status: 400,
        }
      );

    }


    // ========================================================
    // FIND EXERCISE
    // ========================================================

    const exercise =
      log.exercises[exerciseIndex];


    if (!exercise) {

      return NextResponse.json(
        {
          success: false,
          error: "Exercise not found.",
        },
        {
          status: 404,
        }
      );

    }


    exercise.completed =
      completed;

    exercise.completedAt =
      completed
        ? new Date()
        : null;


    await log.save();


    return NextResponse.json({
      success: true,
      log,
    });


  } catch (error) {

    console.error(
      "UPDATE EXERCISE ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update exercise.",
      },
      {
        status: 500,
      }
    );
  }
}