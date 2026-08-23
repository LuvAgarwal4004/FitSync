// import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import Reveal from "./Reveal";

/* =========================================
   Scroll Reveal Animation
   =========================================
   useRef gives every Reveal component a direct,
   stable reference to its DOM element.

   When the element enters the viewport,
   IntersectionObserver changes `visible` to true.
========================================= */

// function Reveal({ children, className = "", delay = 0 }) {
//   const elementRef = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const element = elementRef.current;

//     if (!element) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);

//           // We only need the animation once.
//           observer.unobserve(element);
//         }
//       },
//       {
//         threshold: 0.1,
//       }
//     );

//     observer.observe(element);

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   return (
//     <div
//       ref={elementRef}
//       className={`
//         transition-all
//         duration-1000
//         ease-out
//         ${
//           visible
//             ? "translate-y-0 opacity-100"
//             : "translate-y-10 opacity-0"
//         }
//         ${className}
//       `}
//       style={{
//         transitionDelay: `${delay}ms`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

/* =========================================
   Arrow Icon
========================================= */

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* =========================================
   Check Icon
========================================= */

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

/* =========================================
   HOME PAGE
========================================= */

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7faf8] text-[#17231e]">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#dce8e1]/70 bg-[#f7faf8]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d30] text-lg font-bold text-white shadow-lg shadow-[#173d30]/15 transition-transform duration-300 group-hover:scale-105">
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

          {/* Desktop navigation */}

          <nav className="hidden items-center gap-7 lg:flex">

            <a
              href="#features"
              className="text-sm font-medium text-[#53665e] transition-colors hover:text-[#173d30]"
            >
              Features
            </a>

            <a
              href="#ai"
              className="text-sm font-medium text-[#53665e] transition-colors hover:text-[#173d30]"
            >
              AI Coach
            </a>

            <a
              href="#nutrition"
              className="text-sm font-medium text-[#53665e] transition-colors hover:text-[#173d30]"
            >
              Nutrition
            </a>

            <a
              href="#challenges"
              className="text-sm font-medium text-[#53665e] transition-colors hover:text-[#173d30]"
            >
              Challenges
            </a>

          </nav>

          {/* Authentication */}

          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-[#315047] transition-colors hover:bg-[#eaf2ed] sm:block"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-[#173d30] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#173d30]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245543] hover:shadow-xl sm:px-5"
            >
              Get Started
            </Link>

          </div>
        </div>
      </header>

      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">

        {/* Background decoration */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#cfe8dc]/50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#e5eee8] blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-12">

          {/* Hero text */}

          <div className="max-w-2xl">

            <div className="mb-7 inline-flex animate-[fadeIn_0.8s_ease-out] items-center gap-2 rounded-full border border-[#cfe0d7] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#467060] shadow-sm backdrop-blur">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#63a77e]" />

              Your fitness journey, upgraded

            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-[#173d30] sm:text-6xl lg:text-7xl">

              Your entire

              <span className="block text-[#5d9c7b]">
                fitness journey.
              </span>

              Under one roof.

            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#63766e] sm:text-lg">
              FitSync brings personalized AI fitness guidance, nutrition
              support, fitness shopping, progress tracking and challenges
              together in one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#173d30] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#173d30]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#245543]"
              >
                Build My Plan

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-[#cfddd6] bg-white/70 px-7 py-4 text-sm font-bold text-[#315047] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                Explore FitSync
              </a>

            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#6c7e76]">

              <div className="flex items-center gap-2">
                <CheckIcon />
                Personalized guidance
              </div>

              <div className="flex items-center gap-2">
                <CheckIcon />
                Progress tracking
              </div>

              <div className="flex items-center gap-2">
                <CheckIcon />
                One fitness ecosystem
              </div>

            </div>

          </div>

          {/* Hero dashboard visual */}

          <div className="relative mx-auto w-full max-w-lg">

            <div className="relative z-10 rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-2xl shadow-[#294f40]/10 backdrop-blur-xl sm:p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wider text-[#82948d]">
                    Today's progress
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#173d30]">
                    Keep the streak alive 🔥
                  </h3>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf6f0] text-lg">
                  12
                </div>

              </div>

              {/* Progress */}

              <div className="mt-7">

                <div className="mb-2 flex justify-between text-xs font-semibold">

                  <span className="text-[#53665e]">
                    Weekly progress
                  </span>

                  <span className="text-[#5d9c7b]">
                    80%
                  </span>

                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[#e6eee9]">

                  <div className="h-full w-[80%] rounded-full bg-[#68a981]" />

                </div>

              </div>

              {/* Workout */}

              <div className="mt-7 rounded-2xl bg-[#f4f8f5] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-[#82948d]">
                      Today's workout
                    </p>

                    <h4 className="mt-1 font-bold text-[#24483a]">
                      Chest & Triceps
                    </h4>

                  </div>

                  <span className="rounded-full bg-[#dceee3] px-3 py-1 text-xs font-bold text-[#397054]">
                    45 min
                  </span>

                </div>

                <div className="mt-5 space-y-3">

                  {[
                    "Bench Press",
                    "Incline Dumbbell Press",
                    "Tricep Pushdown",
                  ].map((exercise, index) => (

                    <div
                      key={exercise}
                      className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${
                            index < 2
                              ? "bg-[#dceee3] text-[#397054]"
                              : "bg-[#eef2ef] text-[#81928a]"
                          }`}
                        >
                          {index < 2 ? <CheckIcon /> : null}
                        </div>

                        <span className="text-sm font-medium text-[#52655d]">
                          {exercise}
                        </span>

                      </div>

                      <span className="text-xs text-[#94a39d]">
                        {index === 0
                          ? "4 × 8"
                          : index === 1
                          ? "3 × 10"
                          : "3 × 12"}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

              {/* AI recommendation */}

              <div className="mt-4 rounded-2xl bg-[#173d30] p-5 text-white">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    ✦
                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-[#a8cbb7]">
                      FitSync AI
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#e5f0ea]">
                      You're maintaining a strong streak. Keep today's
                      workout consistent and recover well.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Floating points */}

            <div className="absolute -right-4 top-20 z-20 hidden animate-[float_4s_ease-in-out_infinite] rounded-2xl border border-white bg-white/95 p-4 shadow-xl sm:block">

              <p className="text-xs text-[#83958d]">
                Points earned
              </p>

              <p className="mt-1 text-2xl font-bold text-[#173d30]">
                +180
              </p>

            </div>

            {/* Floating rank */}

            <div className="absolute -bottom-7 -left-5 z-20 hidden animate-[float_5s_ease-in-out_infinite] rounded-2xl border border-white bg-white/95 p-4 shadow-xl sm:block">

              <p className="text-xs text-[#83958d]">
                Current rank
              </p>

              <p className="mt-1 font-bold text-[#173d30]">
                Gold 🏆
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          FEATURES
      ========================================= */}

      <section
        id="features"
        className="bg-white py-24 sm:py-28"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <Reveal className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
              More than a fitness store
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#173d30] sm:text-5xl">

              Everything you need to

              <span className="text-[#5d9c7b]">
                {" "}keep moving forward.
              </span>

            </h2>

            <p className="mt-5 text-base leading-7 text-[#687a72] sm:text-lg">
              FitSync connects the different parts of your fitness journey
              instead of making you jump between different platforms.
            </p>

          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                title: "AI Fitness Coach",
                text: "Get personalized workout routines based on your goals, experience, schedule and available equipment.",
                icon: "✦",
              },
              {
                number: "02",
                title: "Smart Nutrition",
                text: "Receive general nutrition guidance aligned with your fitness goals and dietary preferences.",
                icon: "◒",
              },
              {
                number: "03",
                title: "Fitness Marketplace",
                text: "Discover protein products, healthy snacks, equipment and fitness accessories in one place.",
                icon: "◇",
              },
              {
                number: "04",
                title: "Track & Compete",
                text: "Build streaks, collect points, complete challenges and progress through ranks.",
                icon: "↗",
              },
            ].map((feature, index) => (

              <Reveal
                key={feature.title}
                delay={index * 100}
              >

                <div className="group h-full rounded-3xl border border-[#e1eae5] bg-[#f8fbf9] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#c5ddd0] hover:bg-white hover:shadow-xl hover:shadow-[#254d3d]/8">

                  <div className="flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-xl text-[#397054] transition-transform duration-500 group-hover:scale-110">
                      {feature.icon}
                    </div>

                    <span className="text-xs font-bold text-[#b3c2bb]">
                      {feature.number}
                    </span>

                  </div>

                  <h3 className="mt-7 text-xl font-bold text-[#24483a]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#71817a]">
                    {feature.text}
                  </p>

                </div>

              </Reveal>

            ))}

          </div>

        </div>

      </section>

      {/* =========================================
          AI COACH
      ========================================= */}

      <section
        id="ai"
        className="relative overflow-hidden bg-[#eef6f1] py-24 sm:py-32"
      >

        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#cce5d6]/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">

          <Reveal>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
              Your personal AI Coach
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#173d30] sm:text-5xl">

              Stop guessing.

              <br />

              <span className="text-[#5d9c7b]">
                Start training with a plan.
              </span>

            </h2>

            <p className="mt-6 max-w-xl leading-8 text-[#61746b]">
              Tell FitSync about your goal, experience, schedule, equipment
              and preferences. Your AI Coach can then generate a personalized
              routine designed around the information you provide.
            </p>

            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#173d30] px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#245543]"
            >
              Build My Plan
              <ArrowIcon />
            </Link>

            <p className="mt-5 max-w-lg text-xs leading-6 text-[#7a8982]">
              AI guidance is general information and does not replace advice
              from a qualified fitness professional.
            </p>

          </Reveal>

          <Reveal delay={150}>

            <div className="rounded-[2rem] border border-white bg-white p-5 shadow-xl shadow-[#315746]/10 sm:p-7">

              <div className="rounded-2xl bg-[#f6faf7] p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-[#87968f]">
                  Your goal
                </p>

                <p className="mt-2 text-lg font-bold text-[#24483a]">
                  Build muscle
                </p>

              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-[#f6faf7] p-5">

                  <p className="text-xs text-[#87968f]">
                    Experience
                  </p>

                  <p className="mt-1 font-bold text-[#24483a]">
                    Beginner
                  </p>

                </div>

                <div className="rounded-2xl bg-[#f6faf7] p-5">

                  <p className="text-xs text-[#87968f]">
                    Frequency
                  </p>

                  <p className="mt-1 font-bold text-[#24483a]">
                    5 days/week
                  </p>

                </div>

              </div>

              <div className="mt-5 rounded-2xl bg-[#173d30] p-6 text-white">

                <div className="flex items-center gap-2">

                  <span className="text-[#a8cbb7]">
                    ✦
                  </span>

                  <span className="text-xs font-bold uppercase tracking-wider text-[#a8cbb7]">
                    AI-generated plan
                  </span>

                </div>

                <h3 className="mt-3 text-xl font-bold">
                  Your 5-Day Routine
                </h3>

                <div className="mt-5 space-y-2">

                  {[
                    "Chest & Triceps",
                    "Back & Biceps",
                    "Legs",
                    "Shoulders & Core",
                    "Full Body",
                  ].map((day, index) => (

                    <div
                      key={day}
                      className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3"
                    >

                      <span className="text-sm text-[#edf6f0]">
                        {day}
                      </span>

                      <span className="text-xs text-[#9fc2ad]">
                        Day {index + 1}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </Reveal>

        </div>

      </section>

      {/* =========================================
          NUTRITION
      ========================================= */}

      <section
        id="nutrition"
        className="bg-white py-24 sm:py-32"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <Reveal className="order-2 lg:order-1">

              <div className="rounded-[2rem] border border-[#e1eae5] bg-[#f7faf8] p-6 shadow-sm sm:p-8">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8a9992]">
                      Today's suggestion
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-[#24483a]">
                      Post-workout fuel
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e1eee7]">
                    🥗
                  </div>

                </div>

                <div className="mt-6 rounded-2xl bg-white p-5">

                  <h4 className="font-bold text-[#315047]">
                    Protein-rich recovery meal
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#75847e]">
                    A balanced option based on your stated fitness goal and
                    dietary preferences.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {[
                      "Protein",
                      "Carbs",
                      "Healthy fats",
                    ].map((tag) => (

                      <span
                        key={tag}
                        className="rounded-full bg-[#edf5f0] px-3 py-1.5 text-xs font-semibold text-[#4d765f]"
                      >
                        {tag}
                      </span>

                    ))}

                  </div>

                </div>

                <div className="mt-3 rounded-2xl bg-[#173d30] p-5 text-white">

                  <p className="text-xs uppercase tracking-wider text-[#a8cbb7]">
                    Recommended from FitSync Shop
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <div>

                      <p className="font-bold">
                        Protein essentials
                      </p>

                      <p className="mt-1 text-xs text-[#a8cbb7]">
                        Matched to your journey
                      </p>

                    </div>

                    <span className="text-lg">
                      →
                    </span>

                  </div>

                </div>

              </div>

            </Reveal>

            <Reveal
              delay={150}
              className="order-1 lg:order-2"
            >

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
                Fuel your progress
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#173d30] sm:text-5xl">

                Nutrition guidance

                <span className="text-[#5d9c7b]">
                  {" "}that fits your goal.
                </span>

              </h2>

              <p className="mt-6 leading-8 text-[#687a72]">
                Tell FitSync about your workout, fitness objective and dietary
                preferences. The platform can provide general nutrition
                suggestions and surface relevant products.
              </p>

              <div className="mt-7 space-y-4">

                {[
                  "Goal-oriented food suggestions",
                  "Vegetarian-friendly options",
                  "Dietary preference support",
                  "Relevant fitness product recommendations",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e1eee7] text-[#397054]">
                      <CheckIcon />
                    </span>

                    <span className="text-sm font-medium text-[#53665e]">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

            </Reveal>

          </div>

        </div>

      </section>

      {/* =========================================
          GAMIFICATION
      ========================================= */}

      <section
        id="challenges"
        className="bg-[#173d30] py-24 text-white sm:py-32"
      >

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <Reveal className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9ec5ad]">
              Stay consistent
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Make progress feel rewarding.
            </h2>

            <p className="mt-5 leading-7 text-[#b8cec2] sm:text-lg">
              Build streaks, collect points, complete challenges and climb
              through ranks as you keep showing up.
            </p>

          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-3">

            {[
              {
                icon: "🔥",
                title: "Streaks",
                text: "Keep your daily momentum alive and build consistency over time.",
                value: "12 Days",
              },
              {
                icon: "⭐",
                title: "Points",
                text: "Earn rewards for workouts, nutrition goals and challenges.",
                value: "2,450 XP",
              },
              {
                icon: "🏆",
                title: "Ranks",
                text: "Progress from Bronze through Silver and Gold to Elite.",
                value: "Gold",
              },
            ].map((item, index) => (

              <Reveal
                key={item.title}
                delay={index * 100}
              >

                <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:bg-white/10">

                  <div className="text-3xl">
                    {item.icon}
                  </div>

                  <div className="mt-7">

                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#b8cec2]">
                      {item.text}
                    </p>

                  </div>

                  <div className="mt-7 border-t border-white/10 pt-5">

                    <span className="text-2xl font-bold text-[#b6d9c4]">
                      {item.value}
                    </span>

                  </div>

                </div>

              </Reveal>

            ))}

          </div>

        </div>

      </section>

      {/* =========================================
          CUSTOMER JOURNEY
      ========================================= */}

      <section className="bg-[#f7faf8] py-24 sm:py-32">

        <div className="mx-auto max-w-6xl px-5 sm:px-8">

          <Reveal className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
              Your journey
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#173d30] sm:text-5xl">
              Discover. Train. Fuel. Track.
            </h2>

          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[
              [
                "01",
                "Discover",
                "Find FitSync and start your fitness journey.",
              ],
              [
                "02",
                "Personalize",
                "Tell the platform what you're working toward.",
              ],
              [
                "03",
                "Take action",
                "Train, fuel your body and complete challenges.",
              ],
              [
                "04",
                "Keep going",
                "Build streaks, earn points and return stronger.",
              ],
            ].map(([number, title, text], index) => (

              <Reveal
                key={number}
                delay={index * 100}
              >

                <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#e3ebe6]">

                  <span className="text-xs font-bold text-[#83a393]">
                    {number}
                  </span>

                  <h3 className="mt-6 text-xl font-bold text-[#24483a]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#718079]">
                    {text}
                  </p>

                </div>

              </Reveal>

            ))}

          </div>

        </div>

      </section>

      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">

        <Reveal>

          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#dfeee5] px-7 py-16 text-center sm:px-12">

            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/40 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#b9d9c7]/50 blur-3xl" />

            <div className="relative">

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4d765f]">
                Start your journey
              </p>

              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-[#173d30] sm:text-5xl">

                Train smarter.

                <br />

                Fuel better. Keep going.

              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-[#61756b]">
                Create your FitSync account and start building a fitness
                journey designed around you.
              </p>

              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#173d30] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#173d30]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#245543]"
              >
                Get Started
                <ArrowIcon />
              </Link>

            </div>

          </div>

        </Reveal>

      </section>

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="border-t border-[#dfe8e3] bg-[#f7faf8]">

        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">

          <div>

            <div className="text-lg font-bold text-[#173d30]">
              FitSync
            </div>

            <p className="mt-1 text-sm text-[#82918a]">
              Train · Fuel · Track · Repeat
            </p>

          </div>

          <div className="flex flex-wrap gap-5 text-sm text-[#66776f]">

            <a
              href="#features"
              className="hover:text-[#173d30]"
            >
              Features
            </a>

            <a
              href="#ai"
              className="hover:text-[#173d30]"
            >
              AI Coach
            </a>

            <a
              href="#nutrition"
              className="hover:text-[#173d30]"
            >
              Nutrition
            </a>

            <a
              href="#challenges"
              className="hover:text-[#173d30]"
            >
              Challenges
            </a>

            <Link
              href="/login"
              className="hover:text-[#173d30]"
            >
              Login
            </Link>

          </div>

          <p className="text-xs text-[#8b9993]">
            © {new Date().getFullYear()} FitSync
          </p>

        </div>

      </footer>

    </main>
  );
}