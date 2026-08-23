import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import NutritionLog from "@/models/NutritionLog";


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
      mealIndex,
      completed,
    } = body;


    if (
      !date ||
      !Number.isInteger(mealIndex) ||
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


    const log =
      await NutritionLog.findOne({
        userId: session.user.id,
        date,
      });


    if (!log) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Nutrition log not found.",
        },
        {
          status: 404,
        }
      );

    }


    const meal =
      log.meals[mealIndex];


    if (!meal) {

      return NextResponse.json(
        {
          success: false,
          error: "Meal not found.",
        },
        {
          status: 404,
        }
      );

    }


    meal.completed =
      completed;

    meal.completedAt =
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
      "UPDATE MEAL ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update meal.",
      },
      {
        status: 500,
      }
    );
  }
}