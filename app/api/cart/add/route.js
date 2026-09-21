import connectDb from "@/db/connectDb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const { productId } = await req.json();
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const id = String(productId);
    await connectDb();

    // const user = await User.findOne({ email });
    const user =
      await User.findOne({
        email: session.user.email
      });

    if (!user) {
      return Response.json({ error: "User not found" });
    }

    const existingItem = user.cart.find(
      (item) => String(item.productId) === id
    );

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      user.cart.push({ productId: id, qty: 1 });
    }

    await user.save();

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" });
  }
}