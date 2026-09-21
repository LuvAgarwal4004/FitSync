import { getServerSession }
  from "next-auth";

import { authOptions }
  from "@/app/api/auth/[...nextauth]/route";

import connectDb
  from "@/db/connectDb";

import CheckoutSession
  from "@/models/CheckoutSession";

export async function GET(req) {

  try {

    await connectDb();

    const session =
      await getServerSession(
        authOptions
      );

    if (!session) {

      return Response.json(
        {
          allowed: false
        },
        {
          status: 401
        }
      );

    }

    const { searchParams } =
      new URL(req.url);

    const requestedStep =
      Number(
        searchParams.get("step")
      );

    const checkout =
      await CheckoutSession.findOne({

        userId:
          session.user.id

      });

    if (!checkout) {

      return Response.json({
        allowed: false
      });

    }

    // block after completion

    if (checkout.completed) {

      return Response.json({
        allowed: false
      });

    }

    // allow only current step
    // OR previous step

    const allowed =
      requestedStep <= checkout.step &&
      !checkout.completed;

    console.log("REQUESTED:", requestedStep);
    console.log("DB STEP:", checkout?.step);
    console.log("ALLOWED:", allowed);

    return Response.json({
      allowed
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