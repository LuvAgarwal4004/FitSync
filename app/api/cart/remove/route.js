import connectDb from "@/db/connectDb";
import User from "@/models/User";
import CheckoutSession
  from "@/models/CheckoutSession";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const { productId } = await req.json();

    await connectDb();
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

    // const user = await User.findOne({ email });

    user.cart = user.cart.filter(
      (item) => item.productId !== productId
    );

    await user.save();
    if (user.cart.length === 0) {

      await CheckoutSession.deleteOne({
        userId: user._id.toString()
      });

    } else {

      await CheckoutSession.findOneAndUpdate(
        {
          userId: user._id.toString()
        },
        {
          step: 2,
          completed: false
        }
      );

    }
    return Response.json({ success: true });

  } catch (err) {
    return Response.json({ error: "Server error" });
  }
}