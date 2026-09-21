import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {

  try {

    await connectDb();

    const session =
      await getServerSession(authOptions);

    if (
      !session ||
      session.user.role !== "admin"
    ) {

      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    }

    //GET SEARCH PARAM
    const { searchParams } =
      new URL(req.url);

    const query =
      searchParams.get("search") || "";
    const from =
      searchParams.get("from");

    const to =
      searchParams.get("to");

    let mongoQuery = {};

    // SEARCH LOGIC
    if (query) {

      mongoQuery = {
        $or: [

          {
            customerName: {
              $regex: query,
              $options: "i"
            }
          },

          {
            customerEmail: {
              $regex: query,
              $options: "i"
            }
          },

          {
            "addressSnapshot.city": {
              $regex: query,
              $options: "i"
            }
          },

          {
            "addressSnapshot.state": {
              $regex: query,
              $options: "i"
            }
          },

          {
            "addressSnapshot.streetAddress": {
              $regex: query,
              $options: "i"
            }
          },

          {
            status: {
              $regex: query,
              $options: "i"
            }
          }

        ]
      };

    }
    if (from || to) {

      mongoQuery.createdAt = {};

      if (from) {

        mongoQuery.createdAt.$gte =
          new Date(from);

      }

      if (to) {

        const endDate =
          new Date(to);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        mongoQuery.createdAt.$lte =
          endDate;

      }

    }

    const orders =
      await Order.find(mongoQuery)
        .sort({ createdAt: -1 });
    const totalSales =
      orders
        .filter(
          order =>
            order.status !== "cancelled" &&
            order.status !== "returned"
        )
        .reduce(
          (sum, order) =>
            sum + order.total,
          0
        );

    return Response.json({
      success: true,
      orders,
      totalSales
    });

  } catch (err) {

    return Response.json(
      { error: err.message },
      { status: 500 }
    );

  }

}