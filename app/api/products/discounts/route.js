import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();

  const products =
    await Product.find({
      isDiscount: true
    })
      .sort({
        discountPercent: -1
      })
      .limit(20);

  return NextResponse.json(products);
}