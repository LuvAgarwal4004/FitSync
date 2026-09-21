import { getServerSession }
    from "next-auth";

import { authOptions }
    from "@/app/api/auth/[...nextauth]/route";

import connectDb
    from "@/db/connectDb";

import CheckoutSession
    from "@/models/CheckoutSession";

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

        const body =
            await req.json();

        const {
            step
        } = body;

        if (!step) {

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

        const checkout =
            await CheckoutSession.findOne({

                userId:
                    session.user.id

            });

        if (!checkout) {

            return Response.json(
                {
                    error:
                        "Checkout not started"
                },
                {
                    status: 400
                }
            );

        }

        // SECURITY:
        // only allow next step

        // if (
        //     step !==
        //     checkout.step + 1
        // ) 
        if (
            step > checkout.step + 1
        ) {

            return Response.json(
                {
                    error:
                        "Invalid step progression"
                },
                {
                    status: 403
                }
            );

        }

        checkout.step = step;

        await checkout.save();

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