import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(req, { params }) {
  await connectDb();
  const { id } = await params;
  const product = await Product.findById(id);
  return NextResponse.json(product);
}

export async function PUT(req, { params }) {
  await connectDb();

  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const existingProduct =
    await Product.findById(id);

  if (!existingProduct) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  const updatedData = {
    ...body
  };

  // if (
  //   body.isDiscount &&
  //   Number(body.price) <
  //   Number(existingProduct.price)
  // ) {
  //   const oldPrice =
  //     existingProduct.price;

  //   const newPrice =
  //     Number(body.price);

  //   const discountPercent =
  //     Math.round(
  //       ((oldPrice - newPrice) /
  //         oldPrice) *
  //       100
  //     );

  //   updatedData.oldPrice =
  //     oldPrice;

  //   updatedData.discountPercent =
  //     discountPercent;

  //   updatedData.isDiscount =
  //     true;
  // } else {
  //   updatedData.oldPrice =
  //     null;

  //   updatedData.discountPercent =
  //     0;

  //   updatedData.isDiscount =
  //     false;
  // }
  if (!body.isDiscount) {
    updatedData.discountedPrice = null;
    updatedData.discountPercent = 0;
  }

  const updated =
    await Product.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

  return NextResponse.json({
    success: true,
    product: updated
  });
}

export async function DELETE(req, { params }) {
  await connectDb();
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}