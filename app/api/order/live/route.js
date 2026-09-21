import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {

    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const liveOrder = await Order.find({
      customerEmail: session.user.email,
      status: {
        $nin: ["delivered", "cancelled", "returned"]
      }
    }).sort({ createdAt: -1 });

    return Response.json({
      order: liveOrder
    });

  } catch (err) {

    return Response.json(
      { error: err.message },
      { status: 500 }
    );

  }
}