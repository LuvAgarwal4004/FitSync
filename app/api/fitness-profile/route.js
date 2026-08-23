import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import FitnessProfile from "@/models/FitnessProfile";


// ============================================================
// GET
// Fetch the fitness profile of the CURRENT logged-in user
// ============================================================

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // No login = no access
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const profile = await FitnessProfile.findOne({
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET FITNESS PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch fitness profile",
      },
      { status: 500 }
    );
  }
}


// ============================================================
// POST
// Create OR update the fitness profile
// ============================================================

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // SECURITY:
    // The client does NOT tell us which user this belongs to.
    // We take the user ID from the authenticated session.
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    await connectDB();

    const profile = await FitnessProfile.findOneAndUpdate(
      {
        userId: session.user.id,
      },
      {
        ...body,
        userId: session.user.id,
        completed: true,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Fitness profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("SAVE FITNESS PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save fitness profile",
      },
      { status: 500 }
    );
  }
}