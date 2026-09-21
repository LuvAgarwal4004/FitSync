import connectDb from "@/db/connectDb";
import Order from "@/models/Order";

import { getServerSession }
    from "next-auth";

import { authOptions }
    from "@/app/api/auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";

export async function GET(
    req,
    { params }
) {
    const { id } = await params;

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

        const order =
            await Order.findById(
                id
            );

        if (!order) {

            return Response.json(
                {
                    error: "Order not found"
                },
                {
                    status: 404
                }
            );

        }

        // SECURITY CHECK

        if (
            order.customerEmail.toLowerCase() !==
            session.user.email.toLowerCase()
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

        if (!order.invoiceUrl) {

            return Response.json(
                {
                    error:
                        "Invoice not available"
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
                error: err.message
            },
            {
                status: 500
            }
        );

    }

}