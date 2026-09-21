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

        await CheckoutSession.findOneAndUpdate(

            {
                userId:
                    session.user.id
            },

            {
                completed: true,
                step: 5
            }

        );

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