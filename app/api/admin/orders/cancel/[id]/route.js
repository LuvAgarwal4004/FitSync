import connectDb from "@/db/connectDb";
import Order from "@/models/Order";

export async function PATCH(
  req,
  { params }
) {

  try {

    await connectDb();

    const { id } = params;

    const order =
      await Order.findById(id);

    if (!order) {

      return Response.json(
        { error: "Order not found" },
        { status: 404 }
      );

    }

    // DON'T CANCEL AFTER SHIPPING
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

    order.status = "cancelled";

    order.cancelledBy = "user";

    await order.save();

    return Response.json({
      success: true
    });

  } catch (err) {

    return Response.json(
      { error: err.message },
      { status: 500 }
    );

  }
}