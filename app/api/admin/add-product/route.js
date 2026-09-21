import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  await connectDb();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const product = await Product.create(body);

  return NextResponse.json({ success: true, product });
}