import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function GET() {
  await connectDb();
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function POST(req) {
  await connectDb();

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  return NextResponse.json({
    success: true,
    data
  });
}