import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import Product from "@/models/Product";
import RentRequest from "@/models/RentRequest";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const products = await Product.find({
      owner: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const requests = await RentRequest.find({
      owner: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        products,
        requests,
      },
      { status: 200 }
    );
  } catch (error) {
    // console.log("GET /api/my-activity", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}