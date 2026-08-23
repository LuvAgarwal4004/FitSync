import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";

import FitnessProfile from "@/models/FitnessProfile";
import NutritionPlan from "@/models/NutritionPlan";
import AIUserContext from "@/models/AIUserContext";

import {
  generateNutritionPlan,
} from "@/lib/aiPlanGenerators";


// ============================================================
// GET
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


    const nutritionPlan =
      await NutritionPlan.findOne({
        userId: session.user.id,
      }).lean();


    return NextResponse.json({
      success: true,
      plan: nutritionPlan,
    });


  } catch (error) {

    console.error(
      "GET NUTRITION PLAN ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to fetch nutrition plan",
      },
      {
        status: 500,
      }
    );
  }
}


// ============================================================
// POST
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


    await connectDB();


    const profile =
      await FitnessProfile.findOne({
        userId: session.user.id,
      }).lean();


    if (!profile || !profile.completed) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Please complete your fitness onboarding first.",
        },
        {
          status: 400,
        }
      );
    }


    let body = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }


    const existingPlan =
      await NutritionPlan.findOne({
        userId: session.user.id,
      }).lean();


    if (
      existingPlan &&
      !body.forceRegenerate
    ) {

      return NextResponse.json({
        success: true,
        exists: true,
        plan: existingPlan,
      });
    }


    const aiContext =
      await AIUserContext.findOne({
        userId: session.user.id,
      }).lean();


    const generatedPlan =
      await generateNutritionPlan({
        profile,
        aiContext,
      });


    const nutritionPlan =
      await NutritionPlan.findOneAndUpdate(

        {
          userId: session.user.id,
        },

        {
          $set: {

            ...generatedPlan,

            userId: session.user.id,

            generatedBy: "gemini",

            generatedAt: new Date(),

          },
        },

        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );


    return NextResponse.json({

      success: true,

      plan: nutritionPlan,

    });


  } catch (error) {

    console.error(
      "GENERATE NUTRITION PLAN ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Failed to generate nutrition plan.",
      },
      {
        status: 500,
      }
    );
  }
}