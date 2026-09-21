import connectDb from "@/db/connectDb";
import Order from "@/models/Order";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDb();

    const session = await getServerSession(
      authOptions
    );

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await Order.find({
      customerEmail: session.user.email
    }).sort({ createdAt: -1 });
    const safeOrders =
      orders.map(order => ({
        _id: order._id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,

        customerName: order.customerName,
        customerEmail: order.customerEmail,

        items: order.items,

        addressSnapshot: order.addressSnapshot,

        cgst: order.cgst,
        sgst: order.sgst,
        igst: order.igst,

        taxableAmount: order.taxableAmount,

        shippingCost: order.shippingCost,

        originalAmount: order.originalAmount,
        discountAmount: order.discountAmount
      }));
    return Response.json(safeOrders);
    // return Response.json(orders);

  } catch (err) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}