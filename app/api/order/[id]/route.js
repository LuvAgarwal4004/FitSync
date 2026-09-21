import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await connectDb();

  const { id } = await params; // ✅ THIS is the real fix

  try {
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {

      return Response.json(
        { error: "Invalid order id" },
        { status: 400 }
      );
    }
    const order = await Order.findById(id);

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    if (
      order.customerEmail !==
      session.user.email
    ) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return Response.json({ order });
  } catch (err) {
    console.log("ORDER ROUTE ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
export async function PATCH(
  req,
  context
) {

  try {

    await connectDb();
    const session =
      await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const { id } =
      await context.params;

    const order =
      await Order.findById(id);

    if (!order) {

      return Response.json(
        {
          error:
            "Order not found"
        },
        {
          status: 404
        }
      );

    }
    if (
      order.customerEmail !==
      session.user.email
    ) {
      return Response.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Prevent cancelling after shipped
    if (
      [
        "shipped",
        "out_for_delivery",
        "delivered"
      ].includes(order.status)
    ) {

      return Response.json(
        {
          error:
            "Order can no longer be cancelled"
        },
        {
          status: 400
        }
      );

    }

    order.status =
      "cancelled";

    order.cancelledBy =
      "user";

    await order.save();

    return Response.json({
      success: true,
      order
    });

  } catch (err) {
    console.log("ORDER ROUTE ERROR:", err);
    return Response.json(
      {
        error:
          err.message
      },
      {
        status: 500
      }
    );

  }

}