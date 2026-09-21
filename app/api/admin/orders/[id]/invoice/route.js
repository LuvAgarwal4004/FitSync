import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import cloudinary
    from "@/lib/cloudinary";

import { getServerSession }
    from "next-auth";

import { authOptions }
    from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    req,
    { params }
) {

    try {

        await connectDb();

        const session =
            await getServerSession(
                authOptions
            );

        if (!session) {

            return Response.json(
                {
                    error: "Unauthorized"
                },
                {
                    status: 401
                }
            );

        }

        // ADMIN CHECK

        if (
            session.user.role !==
            "admin"
        ) {

            return Response.json(
                {
                    error: "Forbidden"
                },
                {
                    status: 403
                }
            );

        }

        const order =
            await Order.findById(
                params.id
            ); 

        if (!order) {

            return Response.json(
                {
                    error:
                        "Order not found"
                },
                {
                    status: 404
                }
            );

        }

        const signedUrl =
            cloudinary.utils.private_download_url(
                order.invoicePublicId,
                "pdf",
                {
                    resource_type: "raw"
                }
            );

        return Response.redirect(
            signedUrl
        );

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