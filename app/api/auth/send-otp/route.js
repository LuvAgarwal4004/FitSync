import connectDb from "@/db/connectDb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {

    try {

        await connectDb();

        const body = await req.json();

        const {
            name,
            password
        } = body;
        let { email } = body;
        email = String(email || "").trim().toLowerCase();

        if (!email) {
            return Response.json(
                { error: "Email required" },
                { status: 400 }
            );
        }
        if (
            !name?.trim() ||
            !email?.trim().toLowerCase() ||
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

        // cooldown
        const existingOtp =
            await Otp.findOne({ email });

        if (
            existingOtp &&
            Date.now() -
            new Date(existingOtp.createdAt)
            < 30000
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

        const otp = Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();

        const hashedPassword =
            await bcrypt.hash(password, 10);

        await Otp.deleteMany({ email });

        const hashedOtp =
            await bcrypt.hash(
                otp,
                10
            );

        await Otp.create({

            name,

            email,

            otp: hashedOtp,

            password:
                hashedPassword,

            type: "signup",

            expiresAt:
                new Date(
                    Date.now() +
                    5 * 60 * 1000
                )

        });

        const transporter =
            nodemailer.createTransport({

                service: "gmail",

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
                "Your OTP Code",

            html: `
        <h2>Your verification code is:</h2>
        <h1>${otp}</h1>
        <p>
          This code expires in 5 minutes.
        </p>
      `

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