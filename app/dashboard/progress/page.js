"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Flame,
  Target,
  Trophy,
  Utensils,
  Zap,
} from "lucide-react";

import ProgressAnalytics from "./ProgressAnalytics";
export default function ProgressPage() {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    loadProgress();

  }, []);


  async function loadProgress() {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(
          "/api/progress",
          {
            cache: "no-store",
          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.error ||
          "Failed to load progress."
        );

      }


      setData(result);


    } catch (error) {

      console.error(
        "PROGRESS PAGE ERROR:",
        error
      );

      setError(
        error.message ||
        "Failed to load progress."
      );

    } finally {

      setLoading(false);

    }

  }


  if (loading) {

    return (

      <main className="min-h-screen bg-[#f7faf8] px-5 py-10">

        <div className="mx-auto max-w-6xl">

          <p className="text-sm text-[#71817a]">
            Loading your progress...
          </p>

        </div>

      </main>

    );

  }


  if (error) {

    return (

      <main className="min-h-screen bg-[#f7faf8] px-5 py-10">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-3xl border border-red-200 bg-white p-6">

            <p className="font-bold text-red-600">
              {error}
            </p>

            <button
              onClick={loadProgress}
              className="mt-4 rounded-full bg-[#173d30] px-5 py-3 text-sm font-bold text-white"
            >
              Try again
            </button>

          </div>

        </div>

      </main>

    );

  }


  if (!data) {
    return null;
  }


  const {
    workout,
    nutrition,
    streak,
    gamification,
    recentHistory,
  } = data;


  return (

    <main className="min-h-screen bg-[#f7faf8] text-[#17231e]">

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#397054]"
          >

            <ArrowLeft size={16} />

            Back to dashboard

          </Link>


          <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
            Your progress
          </p>


          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#173d30] sm:text-5xl">
            Keep building momentum.
          </h1>


          <p className="mt-4 max-w-2xl leading-7 text-[#71817a]">
            Your recent workouts, exercises, nutrition and
            consistency — all in one place.
          </p>

        </div>


        {/* =====================================================
            TOP STATS
        ===================================================== */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


          <ProgressStat
            icon={<Flame size={21} />}
            label="Current streak"
            value={`${streak.current} days`}
            description={`Best: ${streak.best} days`}
          />


          <ProgressStat
            icon={<Dumbbell size={21} />}
            label="Workouts"
            value={workout.completed}
            description="Completed in last 30 days"
          />


          <ProgressStat
            icon={<Utensils size={21} />}
            label="Nutrition"
            value={`${nutrition.completion}%`}
            description="Meal adherence"
          />


          <ProgressStat
            icon={<Zap size={21} />}
            label="XP"
            value={gamification.xp}
            description={`${gamification.rank} rank`}
          />

        </section>


        {/* =====================================================
            WORKOUT + NUTRITION
        ===================================================== */}

        <section className="mt-6 grid gap-5 lg:grid-cols-2">


          {/* WORKOUT */}

          <ProgressCard
            icon={<Dumbbell size={23} />}
            title="Workout consistency"
          >

            <ProgressBar
              value={workout.completion}
            />


            <div className="mt-5 grid grid-cols-2 gap-3">

              <Metric
                label="Completed"
                value={workout.completed}
              />

              <Metric
                label="Exercises"
                value={workout.exercisesCompleted}
              />

              <Metric
                label="Exercise adherence"
                value={`${workout.exerciseCompletion}%`}
              />

              <Metric
                label="Weekly activity"
                value={`${workout.weeklyActivity}%`}
              />

            </div>

          </ProgressCard>


          {/* NUTRITION */}

          <ProgressCard
            icon={<Utensils size={23} />}
            title="Nutrition consistency"
          >

            <ProgressBar
              value={nutrition.completion}
            />


            <div className="mt-5 grid grid-cols-2 gap-3">

              <Metric
                label="Meals completed"
                value={nutrition.completedMeals}
              />

              <Metric
                label="Meals tracked"
                value={nutrition.totalMeals}
              />

              <Metric
                label="Adherence"
                value={`${nutrition.completion}%`}
              />

              <Metric
                label="Current streak"
                value={`${streak.current} days`}
              />

            </div>

          </ProgressCard>

        </section>


        {/* =====================================================
            XP
        ===================================================== */}

        <section className="mt-6 rounded-[2rem] bg-[#173d30] p-7 text-white sm:p-9">

          <div className="flex items-start justify-between gap-5">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
                Fitness level
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {gamification.rank}
              </h2>

              <p className="mt-2 text-sm text-[#c1d6ca]">
                {gamification.xp} XP earned
              </p>

            </div>


            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">

              <Trophy size={23} />

            </div>

          </div>


          <div className="mt-7">

            <div className="flex justify-between text-xs text-[#c1d6ca]">

              <span>
                Progress
              </span>

              <span>
                {gamification.nextRank}
              </span>

            </div>


            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-white transition-all"
                style={{
                  width:
                    `${gamification.xpProgress}%`,
                }}
              />

            </div>


            <p className="mt-3 text-xs text-[#a8cbb7]">

              {gamification.nextRankXP -
                gamification.xp > 0

                ? `${gamification.nextRankXP - gamification.xp} XP until ${gamification.nextRank}`

                : "Next rank unlocked!"}

            </p>

          </div>

        </section>

        {/* =====================================================
            ADVANCED ANALYTICS
        ===================================================== */}

        <ProgressAnalytics
          analytics={data.analytics}
        />
        {/* =====================================================
            RECENT HISTORY
        ===================================================== */}

        <section className="mt-8">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
                History
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#173d30]">
                Recent activity
              </h2>

            </div>

          </div>


          <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#e1eae5] bg-white shadow-sm">

            {recentHistory.length === 0 ? (

              <div className="p-8 text-center">

                <Activity
                  className="mx-auto text-[#7d9588]"
                  size={30}
                />

                <p className="mt-4 font-bold text-[#24483a]">
                  No activity yet
                </p>

                <p className="mt-2 text-sm text-[#71817a]">
                  Complete your first workout or meal to start
                  building your progress history.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-[#edf2ef]">

                {recentHistory.map(
                  (day) => (

                    <HistoryRow
                      key={day.date}
                      day={day}
                    />

                  )
                )}

              </div>

            )}

          </div>

        </section>


        {/* =====================================================
            TODAY
        ===================================================== */}

        <section className="mt-8 rounded-[2rem] border border-[#dce9e1] bg-[#edf6f0] p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#397054]">

              <Target size={21} />

            </div>


            <div>

              <h2 className="font-bold text-[#24483a]">
                Ready for today's activity?
              </h2>

              <p className="mt-1 text-sm leading-6 text-[#71817a]">
                Keep your streak alive by completing today's
                workout and nutrition plan.
              </p>


              <Link
                href="/dashboard/today"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#173d30] px-5 py-3 text-sm font-bold text-white"
              >

                Go to today's activity

              </Link>

            </div>

          </div>

        </section>


      </div>

    </main>

  );

}


// ============================================================
// PROGRESS STAT
// ============================================================

function ProgressStat({
  icon,
  label,
  value,
  description,
}) {

  return (

    <div className="rounded-3xl border border-[#e1eae5] bg-white p-6 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
        {icon}
      </div>


      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#8a9992]">
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


// ============================================================
// PROGRESS CARD
// ============================================================

function ProgressCard({
  icon,
  title,
  children,
}) {

  return (

    <div className="rounded-[2rem] border border-[#e1eae5] bg-white p-7 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">

          {icon}

        </div>


        <h2 className="text-xl font-bold text-[#24483a]">
          {title}
        </h2>

      </div>


      <div className="mt-7">

        {children}

      </div>

    </div>

  );

}


// ============================================================
// PROGRESS BAR
// ============================================================

function ProgressBar({
  value,
}) {

  return (

    <div>

      <div className="flex justify-between text-xs font-semibold text-[#82918a]">

        <span>
          Completion
        </span>

        <span>
          {value}%
        </span>

      </div>


      <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#edf2ef]">

        <div
          className="h-full rounded-full bg-[#397054] transition-all"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>

  );

}


// ============================================================
// METRIC
// ============================================================

function Metric({
  label,
  value,
}) {

  return (

    <div className="rounded-2xl bg-[#f7faf8] p-4">

      <p className="text-xs text-[#82918a]">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-[#24483a]">
        {value}
      </p>

    </div>

  );

}


// ============================================================
// HISTORY ROW
// ============================================================

function HistoryRow({
  day,
}) {

  const date =
    new Date(
      `${day.date}T00:00:00`
    );


  const formattedDate =
    date.toLocaleDateString(
      undefined,
      {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
    );


  return (

    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

      <div>

        <p className="font-bold text-[#24483a]">
          {formattedDate}
        </p>

        <p className="mt-1 text-xs text-[#82918a]">
          {day.date}
        </p>

      </div>


      <div className="flex flex-wrap gap-3">


        {/* WORKOUT */}

        <div className="flex items-center gap-2 rounded-full bg-[#edf6f0] px-4 py-2">

          {day.workout.completed ? (

            <CheckCircle2
              size={16}
              className="text-[#397054]"
            />

          ) : (

            <Dumbbell
              size={16}
              className="text-[#82918a]"
            />

          )}


          <span className="text-xs font-semibold text-[#397054]">

            {day.workout.exists

              ? `${day.workout.completedExercises}/${day.workout.exercises} exercises`

              : "No workout"}

          </span>

        </div>


        {/* NUTRITION */}

        <div className="flex items-center gap-2 rounded-full bg-[#f3f6f4] px-4 py-2">

          {day.nutrition.completedMeals >
            0 ? (

            <CheckCircle2
              size={16}
              className="text-[#397054]"
            />

          ) : (

            <Utensils
              size={16}
              className="text-[#82918a]"
            />

          )}


          <span className="text-xs font-semibold text-[#397054]">

            {day.nutrition.exists

              ? `${day.nutrition.completedMeals}/${day.nutrition.meals} meals`

              : "No nutrition log"}

          </span>

        </div>


      </div>

    </div>

  );

}