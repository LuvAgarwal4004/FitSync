import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import RentRequest from "@/models/RentRequest";
import NotificationToken from "@/models/NotificationToken";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { messaging } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Save rent request
        const rentRequest = await RentRequest.create({
            ...body,
            owner: session.user.id,
        });

        // Get every registered FCM token
        const tokenDocs = await NotificationToken.find({}, "token");

        const registrationTokens = tokenDocs.map(doc => doc.token);

        console.log("Number of tokens:", registrationTokens.length);

        if (registrationTokens.length > 0) {

            const response = await messaging.sendEachForMulticast({

                tokens: registrationTokens,

                notification: {
                    title: "📚 New Rent Request",
                    body: `${body.studentName} wants ${body.itemNeeded}. 
                    Reward: ₹${body.offeredMoney}, Venue: ${updated.meetLocation}`,
                },

                data: {
                    url: "/rent-requests",
                },

            });

            console.log(
                `Success: ${response.successCount}, Failed: ${response.failureCount}`
            );

            // Remove invalid tokens
            for (let i = 0; i < response.responses.length; i++) {

                const result = response.responses[i];

                if (!result.success) {

                    const errorCode = result.error?.code;

                    console.log(
                        `Token failed: ${registrationTokens[i]}`
                    );

                    console.log(errorCode);

                    if (
                        errorCode ===
                        "messaging/registration-token-not-registered" ||
                        errorCode ===
                        "messaging/invalid-registration-token"
                    ) {

                        await NotificationToken.deleteOne({
                            token: registrationTokens[i],
                        });

                        console.log(
                            "Deleted invalid token:",
                            registrationTokens[i]
                        );
                    }
                }
            }
        }

        return NextResponse.json(rentRequest, {
            status: 201,
        });

    } catch (error) {

        console.log("POST /api/rent error:", error);

        return NextResponse.json(
            {
                message: "Failed to save rent request",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET() {

    try {

        await connectDB();

        const rentRequests = await RentRequest.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            rentRequests,
            {
                status: 200,
            }
        );

    } catch (error) {

        console.log("GET /api/rent error:", error);

        return NextResponse.json(
            {
                message: "Failed to fetch rent requests",
            },
            {
                status: 500,
            }
        );
    }
}