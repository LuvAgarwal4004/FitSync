import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardNavbar from "./DashboardNavbar";
import {
  Dumbbell,
  Utensils,
  TrendingUp,
  Trophy,
  Sparkles,
  Flame,
  ChevronRight,
  Activity,
} from "lucide-react";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";
import FitnessProfile from "@/models/FitnessProfile";

export default async function DashboardPage() {

  // ============================================================
  // 1. CHECK AUTHENTICATION
  // ============================================================

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }


  // ============================================================
  // 2. CHECK FITNESS ONBOARDING
  // ============================================================

  await connectDB();

  const profile = await FitnessProfile.findOne({
    userId: session.user.id,
  }).lean();


  // ============================================================
  // 3. USER HAS NOT COMPLETED ONBOARDING
  // ============================================================

  if (!profile || !profile.completed) {
    redirect("/onboarding");
  }


  // ============================================================
  // 4. ONBOARDING COMPLETE
  //    Continue rendering dashboard
  // ============================================================

  const user = session.user;

  const firstName =
    user?.name?.split(" ")[0] || "there";

  return (
    <main className="min-h-screen bg-[#f7faf8] text-[#17231e]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <DashboardNavbar user={user} />

      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">

        {/* Greeting */}

        <section>

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
            Your dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#173d30] sm:text-5xl">
            Good to see you, {firstName}.
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#71817a]">
            Your fitness journey starts here. Train, fuel your body,
            track your progress and keep building momentum.
          </p>

        </section>

        {/* =====================================================
            QUICK STATS
        ===================================================== */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<Flame size={21} />}
            label="Current streak"
            value="0 days"
            description="Start your streak today"
          />

          <StatCard
            icon={<Activity size={21} />}
            label="Weekly activity"
            value="0%"
            description="No workouts logged yet"
          />

          <StatCard
            icon={<Trophy size={21} />}
            label="Rank"
            value="Bronze"
            description="Your journey begins here"
          />

          <StatCard
            icon={<TrendingUp size={21} />}
            label="Points"
            value="0 XP"
            description="Complete activities to earn XP"
          />

        </section>

        {/* =====================================================
            MAIN ACTIONS
        ===================================================== */}

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {/* AI Workout */}

          <DashboardCard
            href="/dashboard/workout"
            icon={<Dumbbell size={24} />}
            title="AI Fitness Coach"
            description="Build a workout plan around your goals, experience, schedule and equipment."
            action="Build my workout"
          />

          {/* Nutrition */}

          <DashboardCard
            href="/dashboard/nutrition"
            icon={<Utensils size={24} />}
            title="AI Nutritionist"
            description="Get personalized general nutrition guidance based on your fitness journey."
            action="Explore nutrition"
          />
          {/* AI CHAT */}

          <DashboardCard
            href="/dashboard/coach"
            icon={<Sparkles size={24} />}
            title="AI Coach Chat"
            description="Talk to your FitSync AI coach about workouts, nutrition, recovery and your fitness journey."
            action="Chat with FitSync AI"
          />
          {/* AI INSIGHT */}

          <DashboardCard
            href="/dashboard/insights"
            icon={<Sparkles size={24} />}
            title="AI Insights"
            description="Your AI can see whether u are skipping meals or excercises and whether u are doing
             excellent and keeping consistent, it upgrades your wokout and nutrition plans accordingly!"
          />

          {/* Today */}

          <DashboardCard
            href="/dashboard/today"
            icon={<Activity size={24} />}
            title="Today's Activity"
            description="Start your workout, complete exercises and track the meals you eat today."
            action="Start today's activity"
          />

          {/* Progress */}

          {/* <DashboardCard
            href="/dashboard/progress"
            icon={<TrendingUp size={24} />}
            title="My Progress"
            description="Track your workouts, activity, consistency and overall fitness journey."
            action="View progress"
          /> */}

        </section>

        {/* =====================================================
            AI COACH FEATURE
        ===================================================== */}

        <section className="mt-8 overflow-hidden rounded-[2rem] bg-[#173d30] text-white">

          <div className="grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-12">

            <div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles size={23} />
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
                FitSync AI
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                Your fitness journey,
                <br />
                powered by AI.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-[#c1d6ca]">
                Tell FitSync what you're trying to achieve and we'll use
                the information you provide to help create a more
                personalized fitness experience.
              </p>

              <Link
                href="/dashboard/coach"
                className="mt-7 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#173d30] transition hover:-translate-y-0.5 hover:bg-[#edf6f0]"
              >
                Talk to my AI coach
                <ChevronRight size={17} />
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">

              <p className="text-xs font-bold uppercase tracking-wider text-[#9fc2ad]">
                Your AI workspace
              </p>

              <div className="mt-5 space-y-3">

                {[
                  [
                    "Goal",
                    formatProfileValue(profile.primaryGoal),
                  ],

                  [
                    "Experience",
                    formatProfileValue(profile.experienceLevel),
                  ],

                  [
                    "Workout frequency",
                    `${profile.workoutDays || 0} days/week`,
                  ],

                  [
                    "Equipment",
                    profile.equipment?.length
                      ? profile.equipment.join(", ")
                      : "No equipment",
                  ],
                ].map(([label, value]) => (

                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4"
                  >
                    <span className="text-sm text-[#c7d9cf]">
                      {label}
                    </span>

                    <span className="text-sm font-semibold text-[#a8cbb7]">
                      {value}
                    </span>
                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            TODAY
        ===================================================== */}

        <section className="mt-8">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
                Today
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#173d30]">
                Keep moving forward.
              </h2>
            </div>

          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <div className="rounded-3xl border border-[#e1eae5] bg-white p-6 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
                  <Dumbbell size={22} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8a9992]">
                    Workout
                  </p>

                  <h3 className="mt-1 font-bold text-[#24483a]">
                    No workout planned yet
                  </h3>
                </div>

              </div>

              <p className="mt-5 text-sm leading-6 text-[#71817a]">
                Start today's workout, complete each exercise and
                track the meals you eat throughout the day.
              </p>

              <Link
                href="/dashboard/today"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#397054]"
              >
                Start today's activity
                <ChevronRight size={16} />
              </Link>

            </div>

            {/* <div className="rounded-3xl border border-[#e1eae5] bg-white p-6 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
                  <Trophy size={22} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8a9992]">
                    Challenge
                  </p>

                  <h3 className="mt-1 font-bold text-[#24483a]">
                    Ready for your first challenge?
                  </h3>
                </div>

              </div>

              <p className="mt-5 text-sm leading-6 text-[#71817a]">
                Complete activities, earn XP and build your consistency
                over time.
              </p>

              <Link
                href="/dashboard/challenges"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#397054]"
              >
                Explore challenges
                <ChevronRight size={16} />
              </Link>

            </div> */}

          </div>

        </section>

      </div>

    </main>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-[#e1eae5] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
          {icon}
        </div>

      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#8a9992]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#173d30]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#82918a]">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  href,
  icon,
  title,
  description,
  action,
}) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-[#e1eae5] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c5ddd0] hover:shadow-xl"
    >

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#24483a]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#71817a]">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#397054]">
        {action}
        <ChevronRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>

    </Link>
  );
}
function formatProfileValue(value) {

  if (!value) {
    return "Not specified";
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}