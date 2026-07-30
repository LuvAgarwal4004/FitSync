import { NextResponse } from "next/server";
import connectDB from "@/db/connectDb";
import RentRequest from "@/models/RentRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { messaging } from "@/lib/firebaseAdmin";
import NotificationToken from "@/models/NotificationToken";

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
        const rentRequest = await RentRequest.create({
            ...body,
            owner: session.user.id,
        });
        // const tokens =
        //     await NotificationToken.find({});


        // const notificationTokens =
        //     tokens.map(
        //         item => item.token
        //     );
        const notificationTokens =
            await NotificationToken.distinct("token");
        console.log("Number of tokens:", notificationTokens.length);
        console.log(notificationTokens);

        // if (notificationTokens.length > 0) {

        //     const message = {
        //         notification: {
        //             title: "New Rent Request",
        //             body: `${body.studentName} requested ${body.itemNeeded}`,
        //         },
        //         data: {
        //             url: "/rent-requests",
        //         },
        //     };

        //     await Promise.all(
        //         notificationTokens.map(token =>
        //             messaging.send({
        //                 ...message,
        //                 token,
        //             })
        //         )
        //     );


        // }
        if (notificationTokens.length > 0) {

            const message = {
                notification: {
                    title: "New Rent Request",
                    body: `${body.studentName} requested ${body.itemNeeded}`,
                },
                data: {
                    url: "/rent-requests",
                },
            };

            for (const token of notificationTokens) {
                try {
                    console.log("Sending to:", token);

                    const response = await messaging.send({
                        ...message,
                        token,
                    });

                    console.log("SUCCESS:", response);

                } catch (err) {

                    console.log("FAILED");
                    console.log(err);
                    if (
                        err.code === "messaging/registration-token-not-registered" ||
                        err.code === "messaging/invalid-registration-token"
                    ) {
                        await NotificationToken.deleteOne({ token });
                        console.log("Removed stale token:", token);
                    }
                }
            }
        }
        return NextResponse.json(rentRequest, { status: 201 });
    } catch (error) {
        console.log("POST /api/rent error:", error);

        return NextResponse.json(
            { message: "Failed to save rent request" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const rentRequests = await RentRequest.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(rentRequests, { status: 200 });
    } catch (error) {
        console.log("GET /api/rent error:", error);

        return NextResponse.json(
            { message: "Failed to fetch rent requests" },
            { status: 500 }
        );
    }
}