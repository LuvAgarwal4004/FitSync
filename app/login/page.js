"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Welcome back!");

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7faf8] text-[#17231e]">

      {/* Decorative background */}
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
            href="/signup"
            className="rounded-full bg-[#173d30] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#245543]"
          >
            Create Account
          </Link>

        </div>
      </header>

      {/* Content */}
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-12 sm:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-2xl shadow-[#294f40]/10 backdrop-blur-xl lg:grid-cols-2">

          {/* Left */}
          <div className="hidden bg-[#173d30] p-12 text-white lg:flex lg:flex-col lg:justify-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles size={26} />
            </div>

            <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
              Welcome back
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Your fitness journey is waiting.
            </h1>

            <p className="mt-6 leading-8 text-[#c3d7cc]">
              Continue your workouts, track your progress, follow your
              nutrition goals and keep your streak alive.
            </p>

            <div className="mt-10 space-y-4">

              {[
                "Personalized AI fitness guidance",
                "Nutrition recommendations",
                "Progress tracking & challenges",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#d4e3db]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[#a8cbb7]">
                    ✓
                  </div>

                  {item}
                </div>
              ))}

            </div>
          </div>

          {/* Login */}
          <div className="p-7 sm:p-10 lg:p-12">

            <div className="mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
                🔐
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#173d30]">
                Welcome back
              </h2>

              <p className="mt-2 text-[#71817a]">
                Log in to continue your FitSync journey.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#53665e]">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82948d]"
                  />

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#6ca583] focus:ring-4 focus:ring-[#dceee3]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#53665e]">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#397054] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82948d]"
                  />

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] py-3.5 pl-11 pr-4 outline-none transition focus:border-[#6ca583] focus:ring-4 focus:ring-[#dceee3]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#173d30] py-3.5 font-bold text-white shadow-lg shadow-[#173d30]/15 transition hover:-translate-y-0.5 hover:bg-[#245543] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}

                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#dfe8e3]" />

              <span className="text-xs font-medium text-[#8a9992]">
                OR
              </span>

              <div className="h-px flex-1 bg-[#dfe8e3]" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#dce7e1] bg-white py-3.5 font-semibold text-[#53665e] shadow-sm transition hover:-translate-y-0.5 hover:border-[#bfd6c9] hover:bg-[#f8fbf9] hover:shadow-lg"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-0.5 0 48 48"
              >
                <path
                  fill="#FBBC05"
                  d="M9.827 24c0-1.524.253-2.986.705-4.356L2.623 13.604A23.91 23.91 0 0 0 .214 24c0 3.737.867 7.261 2.406 10.389l7.905-6.051A14.02 14.02 0 0 1 9.827 24z"
                />
                <path
                  fill="#EB4335"
                  d="M23.714 10.133c3.31 0 6.302 1.174 8.652 3.094L39.202 6.4C35.036 2.773 29.695.533 23.714.533c-9.287 0-17.269 5.311-21.091 13.071l7.909 6.04c1.822-5.532 7.017-9.511 13.182-9.511z"
                />
                <path
                  fill="#34A853"
                  d="M23.714 37.867c-6.165 0-11.36-3.979-13.182-9.511l-7.909 6.038c3.822 7.761 11.804 13.072 21.091 13.072 5.732 0 11.204-2.035 15.311-5.848l-7.507-5.804c-2.118 1.334-4.786 2.053-7.804 2.053z"
                />
                <path
                  fill="#4285F4"
                  d="M46.145 24c0-1.387-.213-2.88-.534-4.267H23.714V28.8h12.604c-.63 3.091-2.346 5.468-4.8 7.014l7.507 5.804C43.339 37.614 46.145 31.649 46.145 24z"
                />
              </svg>

              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-[#71817a]">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#397054] hover:underline"
              >
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}