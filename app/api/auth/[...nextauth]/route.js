// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDb from "@/db/connectDb";
import User from "@/models/User";

const ADMIN_EMAIL = "luvag0707@gmail.com";

const isAdminEmail = (email) =>
  typeof email === "string" && email.toLowerCase() === ADMIN_EMAIL;

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,

      authorization: {
        params: {
          prompt: "select_account consent",
        },
      },
    }),

    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDb();

        const user = await User.findOne({
          email: credentials.email,
          verified: true,
        });

        if (!user) {
          throw new Error("No user found");
        }

        // Google account only
        if (!user.password) {
          throw new Error("Use Google Login");
        }

        const matched = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!matched) {
          throw new Error("Wrong password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, profile }) {
      try {
        await connectDb();

        const existingUser = await User.findOne({
          email: user.email,
        });

        const admin = isAdminEmail(user.email);

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name || user.email.split("@")[0],
            image: profile?.picture || user.image || "",
            role: admin ? "admin" : "user",
            verified: true,
            cart: [],
          });
        } else if (admin && existingUser.role !== "admin") {
          // Account was created before the admin rule existed -> promote it
          existingUser.role = "admin";
          await existingUser.save();
        }

        return true;
      } catch (err) {
        console.error("🔥 SIGNIN ERROR:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      // `user` is only present right after login
      if (user) {
        await connectDb();

        const dbUser = await User.findOne({
          email: user.email,
        });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.image = dbUser.image;
          token.email = dbUser.email;
          token.role = isAdminEmail(dbUser.email)
            ? "admin"
            : dbUser.role || "user";
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      session.user.role = token.role || "user"; // <-- this was missing

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };