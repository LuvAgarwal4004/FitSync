"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from 'react';
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");
  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);
  const [timer, setTimer] =
    useState(30);

  const handleSignup = async (e) => {

    e.preventDefault();

    if (
      password !== confirmPassword
    ) {

      toast.error(
        "Passwords do not match"
      );

      return;

    }

    const res = await fetch(
      "/api/auth/send-otp",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );

    const data = await res.json();

    if (data.success) {

      setOtpSent(true);
      toast.success(
        "OTP sent to email"
      );

    } else {

      toast.error(data.error);

    }

  };
  useEffect(() => {

    let interval;

    if (otpSent && timer > 0) {

      interval = setInterval(() => {

        setTimer((prev) => prev - 1);

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [otpSent, timer]);
  const handleResendOtp =
    async () => {

      const res = await fetch(
        "/api/auth/send-otp",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data =
        await res.json();

      if (data.success) {

        setTimer(30);

        toast.success("OTP resent");

      } else {

        toast.error(data.error);

      }

    };
  const handleVerifyOtp =
    async () => {

      const res = await fetch(
        "/api/auth/verify-otp",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email,
            otp
          })

        }
      );

      const data =
        await res.json();

      if (data.success) {

        await signIn(
          "credentials",
          {
            email,
            password,
            redirect: false
          }
        );

        router.push("/");

      } else {

        toast.error(data.error);

      }

    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-10 px-8 text-center">

          <div className="h-20 w-20 rounded-full bg-white/20 mx-auto flex items-center justify-center text-4xl mb-5">
            ✨
          </div>

          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="text-blue-100 mt-2">
            Join us and start shopping today
          </p>

        </div>

        {/* BODY */}

        <div className="p-6 sm:p-8">

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Username
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email
              </label>

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Confirm Password
              </label>

              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Repeat password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
              />

            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3.5 font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign Up
            </button>

          </form>

          {otpSent && (

            <div className="mt-8 border-t pt-8">

              <div className="flex justify-center">

                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl shadow-lg">
                  📧
                </div>

              </div>

              <h2 className="text-center text-2xl font-bold mt-5">
                Verify Email
              </h2>

              <p className="text-center text-gray-500 mt-2">
                Enter the OTP sent to
              </p>

              <p className="text-center text-blue-600 font-semibold break-all mt-1">
                {email}
              </p>

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full mt-6 rounded-xl border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none transition focus:ring-4 focus:ring-green-100 focus:border-green-500"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full mt-5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3.5 font-semibold text-white shadow-lg hover:scale-[1.02] transition"
              >
                Verify OTP
              </button>

              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResendOtp}
                className="w-full mt-4 text-blue-600 font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </button>

            </div>

          )}

          {/* OR Divider */}

          <div className="my-8 flex items-center">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          {/* Google Sign Up */}

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="
flex
w-full
items-center
justify-center
gap-3
rounded-xl
border
border-gray-300
bg-white
py-3
font-medium
shadow-sm
transition-all
hover:bg-blue-50
hover:border-blue-300
hover:shadow-lg
"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-0.5 0 48 48"
            >
              <g fill="none" fillRule="evenodd">
                <path fill="#FBBC05" d="M9.827 24c0-1.524.253-2.986.705-4.356L2.623 13.604A23.91 23.91 0 0 0 .214 24c0 3.737.867 7.261 2.406 10.389l7.905-6.051A14.02 14.02 0 0 1 9.827 24z" />
                <path fill="#EB4335" d="M23.714 10.133c3.31 0 6.302 1.174 8.652 3.094L39.202 6.4C35.036 2.773 29.695.533 23.714.533c-9.287 0-17.269 5.311-21.091 13.071l7.909 6.04c1.822-5.532 7.017-9.511 13.182-9.511z" />
                <path fill="#34A853" d="M23.714 37.867c-6.165 0-11.36-3.979-13.182-9.511l-7.909 6.038c3.822 7.761 11.804 13.072 21.091 13.072 5.732 0 11.204-2.035 15.311-5.848l-7.507-5.804c-2.118 1.334-4.786 2.053-7.804 2.053z" />
                <path fill="#4285F4" d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714V28.8h12.604c-.63 3.091-2.346 5.468-4.8 7.014l7.507 5.804C43.339 37.614 46.145 31.649 46.145 24z" />
              </g>
            </svg>

            <span>Continue with Google</span>
          </button>

          <div className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}

export default page
