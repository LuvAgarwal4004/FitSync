import { getServerSession }
    from "next-auth";

import { authOptions }
    from "@/app/api/auth/[...nextauth]/route";

import connectDb
    from "@/db/connectDb";

import CheckoutSession
    from "@/models/CheckoutSession";

export async function POST() {

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

        // remove old checkout session

        await CheckoutSession.deleteMany({
            userId:
                session.user.id
        });

        // create fresh checkout session

        await CheckoutSession.create({

            userId:
                session.user.id,

            step: 2,

            completed: false

        });

        return Response.json({
            success: true
        });

    } catch (err) {

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