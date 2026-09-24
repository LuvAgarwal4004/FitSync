import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const collectionId = searchParams.get("collectionId");
  const search = searchParams.get("search");
  const maxPrice = searchParams.get("maxPrice");

  let query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" }; // case-insensitive
  }

  if (category) query.category = category;
  if (collectionId) query.collectionId = collectionId;
  if (maxPrice) {
    query.price = {
      $lte: Number(maxPrice),
    };
  }

  const products = await Product.find(query).sort({
    isDiscount: -1,
    discountPercent: -1,
    createdAt: -1,
  });

  return NextResponse.json(products);
}

export async function POST(req) {
  // Only admins can create products
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDb();

  const body = await req.json();

  const {
    title,
    price,
    image,
    category,
    description,
    collection,
    specifications,
    isDiscount,
    discountedPrice,
    discountPercent,
  } = body;

  if (!title || !price || !image || !category || !description) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const numericPrice = Number(price);
  if (!(numericPrice > 0)) {
    return NextResponse.json(
      { error: "Price must be greater than 0" },
      { status: 400 }
    );
  }

  // Discount handling
  let discountData = {
    isDiscount: false,
    discountedPrice: null,
    discountPercent: 0,
  };

  if (isDiscount) {
    const dPrice = Number(discountedPrice);
    const dPercent = Number(discountPercent);

    if (
      !(dPrice > 0 && dPrice < numericPrice) ||
      !(dPercent > 0 && dPercent < 100)
    ) {
      return NextResponse.json(
        { error: "Invalid discount values" },
        { status: 400 }
      );
    }

    discountData = {
      isDiscount: true,
      discountedPrice: dPrice,
      discountPercent: dPercent,
    };
  }

  let collectionId = null;
  let sequence = null;

  // Only add collection if category is collections
  if (category === "collections") {
    if (!collection) {
      return NextResponse.json(
        { error: "Collection is required for collection products" },
        { status: 400 }
      );
    }

    collectionId = collection.toLowerCase().trim();

    const lastProduct = await Product.findOne({ collectionId }).sort({
      sequence: -1,
    });

    sequence = lastProduct ? lastProduct.sequence + 1 : 1;
  }

  const newProduct = {
    title,
    price: numericPrice,
    image,
    category,
    description,
    collection: category === "collections" ? collection : null, // "Cap"
    collectionId, // "cap"
    sequence,
    specifications,
    oldPrice: null,
    ...discountData,
  };

  const product = await Product.create(newProduct);

  return NextResponse.json({ success: true, product });
}