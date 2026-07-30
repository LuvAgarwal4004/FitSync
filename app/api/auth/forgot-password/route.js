import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export async function POST(req) {

    try {

        await connectDb();

        const body =
            await req.json();

        let { email } = body;
        email = String(email || "").trim().toLowerCase();

        if (!email) {
            return Response.json(
                { error: "Email required" },
                { status: 400 }
            );
        }

        const user =
            await User.findOne({
                email
            });

        if (!user) {

            return Response.json(
                {
                    error:
                        "No account found"
                },
                {
                    status: 400
                }
            );

        }
        if (!user.password) {
            return Response.json(
                {
                    error: "This account uses Google login"
                },
                {
                    status: 400
                }
            );
        }

        // cooldown
        const existingOtp =
            await Otp.findOne({
                email,
                type:
                    "forgot-password"
            });

        if (
            existingOtp &&
            Date.now() -
            new Date(
                existingOtp.createdAt
            ) <
            30000
        ) {

            return Response.json(
                {
                    error:
                        "Wait 30 seconds before requesting another OTP"
                },
                {
                    status: 400
                }
            );

        }

        const otp =
            Math.floor(
                100000 +
                Math.random() *
                900000
            ).toString();

        const hashedOtp =
            await bcrypt.hash(
                otp,
                10
            );

        await Otp.deleteMany({
            email,
            type:
                "forgot-password"
        });

        await Otp.create({

            email,

            otp:
                hashedOtp,

            password: "",

            name: "",

            type:
                "forgot-password",

            expiresAt:
                new Date(
                    Date.now() +
                    5 * 60 * 1000
                )

        });

        const transporter =
            nodemailer.createTransport({

                service:
                    "gmail",

                auth: {

                    user:
                        process.env.EMAIL_USER,

                    pass:
                        process.env.EMAIL_PASS

                }

            });

        await transporter.sendMail({

            from:
                process.env.EMAIL_USER,

            to: email,

            subject:
                "Password Reset OTP",

            html: `
        <h2>Password Reset Code</h2>

        <h1>${otp}</h1>

        <p>
          Expires in 5 minutes
        </p>
      `

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