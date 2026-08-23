import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import WorkoutLog from "@/models/WorkoutLog";


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


    const body =
      await request.json();


    const {
      date,
    } = body;


    if (!date) {

      return NextResponse.json(
        {
          success: false,
          error: "Date is required.",
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


    if (log.status === "completed") {

      return NextResponse.json({
        success: true,
        log,
      });

    }


    const completedAt =
      new Date();


    log.status =
      "completed";

    log.completedAt =
      completedAt;


    if (log.startedAt) {

      log.durationSeconds =
        Math.max(
          0,
          Math.floor(
            (
              completedAt.getTime() -
              log.startedAt.getTime()
            ) / 1000
          )
        );

    }


    await log.save();


    return NextResponse.json({
      success: true,
      log,
    });


  } catch (error) {

    console.error(
      "FINISH WORKOUT ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to finish workout.",
      },
      {
        status: 500,
      }
    );
  }
}