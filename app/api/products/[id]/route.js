import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/db/connectDb";
import Product from "@/models/Product";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const { id } = await params;
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (product.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    // console.log("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await Product.findById(id).select("owner");

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (existing.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    // console.log("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const { id } = await params;
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await Product.findById(id).select("owner");

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (existing.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // console.log("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}