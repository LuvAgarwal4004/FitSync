import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CheckoutSession from "@/models/CheckoutSession";
import connectDb from "@/db/connectDb";

export async function GET() {

    await connectDb();

    const session =
        await getServerSession(authOptions);

    if (!session) {
        return Response.json(
            { step: 0 }
        );
    }

    const checkout =
        await CheckoutSession.findOne({
            userId: session.user.id
        });

    if (!checkout) {

        return Response.json({
            step: 0,
            completed: false
        });

    }

    return Response.json({

        step: checkout.step,

        completed:
            checkout.completed

    });

}