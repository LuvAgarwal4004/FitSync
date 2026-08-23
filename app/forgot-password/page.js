"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully.");
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      toast.error("Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!otp || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password reset successfully.");
        router.push("/login");
      } else {
        toast.error(data.error || "Unable to reset password.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7faf8] text-[#17231e]">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#cfe8dc]/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#e5eee8] blur-3xl" />

      {/* Navbar */}
      <header className="relative z-10 border-b border-[#dce8e1]/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d30] font-bold text-white shadow-lg">
              F
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight text-[#173d30]">
                FitSync
              </div>

              <div className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#779087] sm:block">
                Train · Fuel · Track · Repeat
              </div>
            </div>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-[#53665e] transition hover:text-[#173d30]"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>

        </div>
      </header>

      {/* Main */}
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-12 sm:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-2xl shadow-[#294f40]/10 backdrop-blur-xl lg:grid-cols-2">

          {/* Left */}
          <div className="hidden bg-[#173d30] p-12 text-white lg:flex lg:flex-col lg:justify-center">

            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={28} />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
              Account security
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Your fitness journey is worth protecting.
            </h1>

            <p className="mt-6 leading-8 text-[#c3d7cc]">
              We use email verification to make sure only you can reset
              your FitSync account password.
            </p>

            <div className="mt-10 space-y-5">

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Mail size={18} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Email verification
                  </h3>

                  <p className="mt-1 text-sm text-[#aac5b5]">
                    Receive a one-time verification code.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Lock size={18} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Secure password reset
                  </h3>

                  <p className="mt-1 text-sm text-[#aac5b5]">
                    Create a new password after verification.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right */}
          <div className="p-7 sm:p-10 lg:p-12">

            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
              <Sparkles size={24} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#173d30]">
              Reset your password
            </h2>

            <p className="mt-2 leading-7 text-[#71817a]">
              {otpSent
                ? "Enter the verification code and choose a new password."
                : "Enter your registered email address and we'll send you a verification code."}
            </p>

            {/* Email */}
            <div className="relative mt-8">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82948d]"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                disabled={otpSent}
                className="w-full rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] py-3.5 pl-11 pr-4 text-[#24483a] outline-none transition focus:border-[#6ca583] focus:ring-4 focus:ring-[#dceee3] disabled:opacity-60"
              />
            </div>

            {!otpSent && (
              <button
                onClick={sendOtp}
                disabled={loading}
                className="mt-5 w-full rounded-2xl bg-[#173d30] py-3.5 font-bold text-white shadow-lg shadow-[#173d30]/15 transition hover:-translate-y-0.5 hover:bg-[#245543] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            {otpSent && (
              <div className="mt-5 space-y-4">

                {/* OTP */}
                <div className="relative">
                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82948d]"
                  />

                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] py-3.5 pl-11 pr-4 text-[#24483a] outline-none transition focus:border-[#6ca583] focus:ring-4 focus:ring-[#dceee3]"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82948d]"
                  />

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="New password"
                    className="w-full rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] py-3.5 pl-11 pr-4 text-[#24483a] outline-none transition focus:border-[#6ca583] focus:ring-4 focus:ring-[#dceee3]"
                  />
                </div>

                <button
                  onClick={resetPassword}
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#173d30] py-3.5 font-bold text-white shadow-lg shadow-[#173d30]/15 transition hover:-translate-y-0.5 hover:bg-[#245543] disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

              </div>
            )}

            <p className="mt-8 text-center text-sm text-[#71817a]">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-bold text-[#397054] hover:underline"
              >
                Log in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}