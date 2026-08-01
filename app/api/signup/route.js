import connectDb from "@/db/connectDb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {

    try {

        await connectDb();

        const body = await req.json();

        const {
            name,
            email,
            password
        } = body; 

        // VALIDATION
        if (
            !name?.trim() ||
            !email?.trim() ||
            !password?.trim()
        ) {

            return Response.json(
                {
                    error: "Missing fields"
                },
                {
                    status: 400
                }
            );

        }
        if (password.length < 6) {

            return Response.json(
                {
                    error:
                        "Password must be at least 6 characters"
                },
                {
                    status: 400
                }
            );

        }

        // CHECK EXISTING USER
        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return Response.json(
                {
                    error:
                        "User already exists"
                },
                {
                    status: 400
                }
            );

        }

        // HASH PASSWORD
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // CREATE USER
        await User.create({
            name,
            email,
            password: hashedPassword,
            cart: []
        });

        return Response.json({
            success: true
        });

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