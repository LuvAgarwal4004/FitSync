import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/db/connectDb";
import RentRequest from "@/models/RentRequest";
import NotificationToken from "@/models/NotificationToken";
import { messaging } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const rentRequest = await RentRequest.findById(id).lean();

    if (!rentRequest) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (rentRequest.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(rentRequest, { status: 200 });
  } catch (error) {
    console.log("GET /api/rent/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch rent request" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const existing = await RentRequest.findById(id).select("owner");

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (existing.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updated = await RentRequest.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    const tokenDocs = await NotificationToken.find({}, "token");

    const registrationTokens = tokenDocs.map(doc => doc.token);

    if (registrationTokens.length > 0) {

      const response = await messaging.sendEachForMulticast({

        tokens: registrationTokens,

        notification: {
          title: "✏️ Rent Request Updated",
          body: `${updated.studentName} updated ${updated.itemNeeded}.
           Reward: ₹${updated.offeredMoney}, Venue: ${updated.meetLocation}`,
        },

        data: {
          url: "/rent-requests",
        },

      });

      for (let i = 0; i < response.responses.length; i++) {

        const result = response.responses[i];

        if (!result.success) {

          const errorCode = result.error?.code;

          if (
            errorCode === "messaging/registration-token-not-registered" ||
            errorCode === "messaging/invalid-registration-token"
          ) {
            await NotificationToken.deleteOne({
              token: registrationTokens[i],
            });
          }
        }
      }
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.log("PUT /api/rent/[id] error:", error);
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const existing = await RentRequest.findById(id).select("owner");

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (existing.owner.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await RentRequest.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("DELETE /api/rent/[id] error:", error);
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}