import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";

export async function GET(req) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const collectionId = searchParams.get("collectionId");
  const search = searchParams.get("search");
  const maxPrice = searchParams.get("maxPrice");

  let query = {};

  if (search) {
    query.title = { $regex: search, $options: "i" }; // 🔥 case-insensitive
  }

  if (category) query.category = category;
  if (collectionId) query.collectionId = collectionId;
  if (maxPrice) {
    query.price = {
      $lte: Number(maxPrice)
    };
  }
  const products = await Product.find(query).sort({
    isDiscount: -1,
    discountPercent: -1,
    createdAt: -1
  });


  return NextResponse.json(products);
}


export async function POST(req) {
  await connectDb();

  const body = await req.json();

  const { title, price, image, category, description, collection, specifications, isDiscount } = body;

  // validation (fix your "empty save" problem)
  if (!title || !price || !image || !category || !description) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  let collectionId = null;
  let sequence = null;

  //ONLY add collection if category is collections
  if (category === "collections") {
    if (!collection) {
      return NextResponse.json(
        { error: "Collection is required for collection products" },
        { status: 400 }
      );
    }
    collectionId = collection.toLowerCase().trim();

    const lastProduct = await Product
      .findOne({ collectionId })
      .sort({ sequence: -1 });

    sequence = lastProduct ? lastProduct.sequence + 1 : 1;
  }
  const newProduct = {
    title,
    price,
    image,
    category,
    description,
    collection: category === "collections" ? collection : null,      // "Cap"
    collectionId,    // "cap"
    sequence,
    specifications,
    oldPrice: null,

    isDiscount: false,

    discountPercent: 0,
  };



  const product = await Product.create(newProduct);

  return NextResponse.json({ success: true, product });
}