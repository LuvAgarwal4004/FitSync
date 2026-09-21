import connectDb from "@/db/connectDb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CheckoutSession
  from "@/models/CheckoutSession";

export async function POST() {
  await connectDb();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });

  user.cart = [];
  await user.save();
  await CheckoutSession.deleteOne({
    userId: user._id.toString()
  });

  return Response.json({ success: true });
}