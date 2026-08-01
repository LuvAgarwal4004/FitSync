import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const product = await Product.create({
      ...body,
      owner: session.user.id,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    // console.log("POST /api/products error:", error);

    return NextResponse.json(
      { message: "Failed to save product" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    // console.log("GET /api/products error:", error);

    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}