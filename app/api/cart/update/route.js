import connectDb from "@/db/connectDb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const { productId, qty } = await req.json();

    await connectDb();

    // const user = await User.findOne({ email });
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user =
      await User.findOne({
        email: session.user.email
      });

    if (!user) {
      return Response.json({ error: "User not found" });
    }

    const item = user.cart.find(
      (i) => i.productId === productId
    );

    if (item) {
      item.qty = qty;
    }

    await user.save();

    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: "Server error" });
  }
}