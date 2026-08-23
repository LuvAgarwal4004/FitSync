import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import NutritionPlan from "@/models/NutritionPlan";
import NutritionLog from "@/models/NutritionLog";


// ============================================================
// GET DAILY NUTRITION LOG
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
      await NutritionLog.findOne({
        userId: session.user.id,
        date,
      }).lean();


    return NextResponse.json({
      success: true,
      log: log || null,
    });


  } catch (error) {

    console.error(
      "GET NUTRITION LOG ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load nutrition tracking.",
      },
      {
        status: 500,
      }
    );
  }
}


// ============================================================
// CREATE DAILY NUTRITION LOG
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


    // ========================================================
    // FIND NUTRITION PLAN
    // ========================================================

    const plan =
      await NutritionPlan.findOne({
        userId: session.user.id,
      }).lean();


    if (!plan) {

      return NextResponse.json(
        {
          success: false,
          error:
            "No nutrition plan found.",
        },
        {
          status: 404,
        }
      );

    }


    // ========================================================
    // EXISTING LOG
    // ========================================================

    const existing =
      await NutritionLog.findOne({
        userId: session.user.id,
        date,
      });


    if (existing) {

      return NextResponse.json({
        success: true,
        log: existing,
      });

    }


    // ========================================================
    // GET PLAN DAY
    //
    // Temporary Phase 5 rotation.
    //
    // Phase 6 can make this smarter.
    // ========================================================

    const dayIndex =
      getDayIndex(date, plan.days.length);


    const day =
      plan.days[dayIndex];


    if (!day) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Nutrition day not found.",
        },
        {
          status: 404,
        }
      );

    }


    const meals =
      day.meals.map(
        (meal, index) => ({
          mealIndex: index,
          mealName: meal.name,
          completed: false,
          completedAt: null,
        })
      );


    const log =
      await NutritionLog.create({

        userId:
          session.user.id,

        nutritionPlanId:
          plan._id,

        date,

        meals,

      });


    return NextResponse.json({
      success: true,
      log,
    });


  } catch (error) {

    console.error(
      "CREATE NUTRITION LOG ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create nutrition log.",
      },
      {
        status: 500,
      }
    );
  }
}


// ============================================================
// DATE → PLAN DAY
// ============================================================

function getDayIndex(
  date,
  numberOfDays
) {

  if (!numberOfDays) return 0;


  const start =
    new Date("2026-01-01T00:00:00Z");


  const current =
    new Date(`${date}T00:00:00Z`);


  const diff =
    Math.floor(
      (
        current.getTime() -
        start.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    );


  return (
    ((diff % numberOfDays) +
      numberOfDays) %
    numberOfDays
  );
}