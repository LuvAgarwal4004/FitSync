
import connectDb from "@/db/connectDb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  // const { email } = await req.json();
  const session =
    await getServerSession(authOptions);

  if (!session)
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  await connectDb();

  const user = await User.findOne({ email: session.user.email });

  return Response.json({
    cart: (user?.cart || []).map(item => ({
      id: item.productId, // FIX
      qty: item.qty
    }))
  });
}