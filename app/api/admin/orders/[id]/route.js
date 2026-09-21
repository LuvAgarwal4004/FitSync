import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  sendOrderStatusEmail
} from "@/lib/sendOrderEmails";

export async function PATCH(
  req,
  context
) {

  try {

    const session =
      await getServerSession(
        authOptions
      );

    if (
      !session ||
      session.user.role !== "admin"
    ) {

      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    }

    await connectDb();

    // FIX
    const { id } =
      await context.params;

    const body =
      await req.json();

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned"
    ];

    if (
      !allowedStatuses.includes(
        body.status
      )
    ) {

      return Response.json(
        {
          error:
            "Invalid status"
        },
        {
          status: 400
        }
      );

    }

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
      [
        "delivered",
        "cancelled",
        "returned"
      ].includes(order.status)
    ) {

      return Response.json(
        {
          error:
            "Finalized orders cannot be changed"
        },
        {
          status: 400
        }
      );

    }


    order.status =
      body.status;

    if (
      body.status ===
      "cancelled"
    ) {

      order.cancelledBy =
        "admin";

    }

    await order.save();
    if (
      [
        "shipped",
        "delivered",
        "cancelled",
        "returned"
      ].includes(order.status)
    ) {

      try {


        await sendOrderStatusEmail(
          order
        );


      } catch (err) {


        console.log(
          "STATUS EMAIL ERROR:",
          err
        );


      }

    }


    return Response.json({
      success: true,
      order
    });

  } catch (err) {

    return Response.json(
      {
        error: err.message
      },
      {
        status: 500
      }
    );

  }
}