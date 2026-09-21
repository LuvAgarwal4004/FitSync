import { getServerSession }
    from "next-auth";

import { authOptions }
    from "@/app/api/auth/[...nextauth]/route";

import connectDb
    from "@/db/connectDb";

import CheckoutSession
    from "@/models/CheckoutSession";
import Order from "@/models/Order";

export async function POST(req) {

    try {

        await connectDb();

        const session =
            await getServerSession(
                authOptions
            );


        if (!session) {

            return Response.json(
                {
                    error:
                        "Unauthorized"
                },
                {
                    status: 401
                }
            );

        }
        console.log("SESSION:", session);

        console.log("SESSION USER ID:",
            session?.user?.id);
        const oneMinuteAgo =
            new Date(Date.now() - 60 * 1000);

        const recentOrder =
            await Order.findOne({
                customerEmail: session.user.email,
                createdAt: {
                    $gte: oneMinuteAgo
                },
                status: {
                    $ne: "cancelled"
                }
            });

        if (recentOrder) {

            return Response.json(
                {
                    error:
                        "Please wait 1 minute before placing another order."
                },
                {
                    status: 400
                }
            );

        }
        let body = {};

        try {
            body = await req.json();
        } catch {
            return Response.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        console.log("BODY:", body);

        const { step } = body;

        console.log("STEP:", step);

        if (step === undefined || step === null) {

            return Response.json(
                {
                    error:
                        "Step required"
                },
                {
                    status: 400
                }
            );

        }

        const result =
            await CheckoutSession.findOneAndUpdate(
                {
                    userId: session.user.id
                },
                {
                    step,
                    completed: false
                },
                {
                    upsert: true,
                    // new: true
                    returnDocument: "after"
                }
            );

        console.log("RESULT:", result);

        return Response.json({
            success: true
        });

    } catch (err) {
        console.error("CHECKOUT SESSION ERROR:", err);
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