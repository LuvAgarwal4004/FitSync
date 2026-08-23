"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Sparkles,
  Loader2,
  Clock,
  Target,
  RotateCcw,
} from "lucide-react";

import toast from "react-hot-toast";


export default function WorkoutPage() {

  const [plan, setPlan] = useState(null);

  const [loading, setLoading] = useState(true);

  const [regenerating, setRegenerating] = useState(false);


  // ============================================================
  // LOAD WORKOUT
  // ============================================================

  useEffect(() => {

    loadWorkout();

  }, []);


  const loadWorkout = async () => {

    try {

      setLoading(true);


      const response = await fetch(
        "/api/ai/workout",
        {
          method: "POST",
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Failed to load workout."
        );

      }


      setPlan(data.plan);


    } catch (error) {

      console.error(error);

      toast.error(
        error.message ||
        "Could not load your workout."
      );


    } finally {

      setLoading(false);

    }

  };


  // ============================================================
  // REGENERATE
  // ============================================================

  const regenerateWorkout = async () => {

    try {

      setRegenerating(true);


      const response =
        await fetch(
          "/api/ai/workout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              forceRegenerate: true,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Failed to regenerate workout."
        );

      }


      setPlan(data.plan);


      toast.success(
        "Your workout has been regenerated!"
      );


    } catch (error) {

      console.error(error);

      toast.error(
        error.message ||
        "Could not regenerate workout."
      );


    } finally {

      setRegenerating(false);

    }

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173d30] text-white">

            <Loader2
              size={24}
              className="animate-spin"
            />

          </div>

          <h1 className="mt-5 text-xl font-bold text-[#173d30]">

            Creating your personalized workout...

          </h1>

          <p className="mt-2 text-sm text-[#7b8982]">

            FitSync AI is using your fitness profile.

          </p>

        </div>

      </main>

    );

  }


  // ============================================================
  // NO PLAN
  // ============================================================

  if (!plan) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-5">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-[#173d30]">

            We couldn't create your workout.

          </h1>

          <button
            onClick={loadWorkout}
            className="mt-5 rounded-full bg-[#173d30] px-6 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>

        </div>

      </main>

    );

  }


  return (

    <main className="min-h-screen bg-[#f7faf8] px-5 py-10 text-[#17231e] sm:px-8">

      <div className="mx-auto max-w-6xl">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <section>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173d30] text-white shadow-lg">

                  <Dumbbell size={23} />

                </div>

                <div>

                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
                    FitSync AI
                  </p>

                  <h1 className="mt-1 text-3xl font-bold text-[#173d30]">
                    {plan.title}
                  </h1>

                </div>

              </div>

              <p className="mt-5 max-w-3xl leading-7 text-[#71817a]">
                {plan.description}
              </p>

            </div>


            <button
              onClick={regenerateWorkout}
              disabled={regenerating}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8e5de] bg-white px-5 py-3 text-sm font-bold text-[#397054] transition hover:bg-[#edf6f0]"
            >

              <RotateCcw size={16} />

              Regenerate

            </button>
            <Link
              href="/dashboard/today"
              className="inline-flex items-center gap-2 rounded-full bg-[#173d30] px-5 py-3 text-sm font-bold text-white"
            >
              <Dumbbell size={16} />
              Start Today's Workout
            </Link>

          </div>
          

        </section>

        
        {/* ====================================================
            PLAN SUMMARY
        ==================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">

          <SummaryCard
            icon={<Target size={19} />}
            label="Goal"
            value={formatValue(plan.primaryGoal)}
          />

          <SummaryCard
            icon={<Dumbbell size={19} />}
            label="Training"
            value={`${plan.workoutDaysPerWeek} days / week`}
          />

          <SummaryCard
            icon={<Clock size={19} />}
            label="Duration"
            value={`${plan.workoutDuration} minutes`}
          />

        </section>


        {/* ====================================================
            STRATEGY
        ==================================================== */}

        <section className="mt-8 rounded-[2rem] bg-[#173d30] p-7 text-white sm:p-9">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
            Your strategy
          </p>

          <p className="mt-4 max-w-4xl leading-7 text-[#d0ded6]">
            {plan.strategy}
          </p>

        </section>


        {/* ====================================================
            WORKOUT DAYS
        ==================================================== */}

        <section className="mt-8 space-y-6">

          {plan.days?.map((day) => (

            <WorkoutDay
              key={day.dayNumber}
              day={day}
            />

          ))}

        </section>


        {/* ====================================================
            PROGRESSION
        ==================================================== */}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">

          <AdviceCard
            title="Progression"
            items={plan.progressionAdvice}
          />

          <AdviceCard
            title="Recovery"
            items={plan.recoveryAdvice}
          />

        </section>


      </div>

    </main>

  );

}


// ============================================================
// WORKOUT DAY
// ============================================================

function WorkoutDay({ day }) {

  return (

    <article className="overflow-hidden rounded-[2rem] border border-[#e1eae5] bg-white shadow-sm">

      <div className="border-b border-[#e7eee9] bg-[#f9fbfa] p-6 sm:p-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
              Day {day.dayNumber}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#173d30]">
              {day.title}
            </h2>

            <p className="mt-1 text-sm text-[#71817a]">
              {day.focus}
            </p>

          </div>


          <div className="flex items-center gap-2 rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-bold text-[#397054]">

            <Clock size={14} />

            {day.estimatedDuration} min

          </div>

        </div>

      </div>


      <div className="p-6 sm:p-7">


        {/* Warmup */}

        <div>

          <h3 className="font-bold text-[#24483a]">
            Warm-up
          </h3>

          <ul className="mt-3 space-y-2">

            {day.warmup?.map((item, index) => (

              <li
                key={index}
                className="text-sm leading-6 text-[#71817a]"
              >
                • {item}
              </li>

            ))}

          </ul>

        </div>


        {/* Exercises */}

        <div className="mt-8 space-y-3">

          <h3 className="font-bold text-[#24483a]">
            Exercises
          </h3>


          {day.exercises?.map((exercise, index) => (

            <div
              key={index}
              className="rounded-2xl border border-[#e2ebe6] bg-[#f9fbfa] p-5"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <h4 className="font-bold text-[#24483a]">
                    {index + 1}. {exercise.name}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#71817a]">
                    {exercise.instructions}
                  </p>

                </div>


                <div className="grid grid-cols-3 gap-2 text-center">

                  <ExerciseStat
                    label="Sets"
                    value={exercise.sets}
                  />

                  <ExerciseStat
                    label="Reps"
                    value={exercise.reps}
                  />

                  <ExerciseStat
                    label="Rest"
                    value={`${exercise.restSeconds}s`}
                  />

                </div>

              </div>


              {exercise.targetMuscles?.length > 0 && (

                <div className="mt-4 flex flex-wrap gap-2">

                  {exercise.targetMuscles.map(
                    (muscle) => (

                      <span
                        key={muscle}
                        className="rounded-full bg-[#e8f1eb] px-3 py-1 text-xs font-semibold text-[#397054]"
                      >
                        {muscle}
                      </span>

                    )
                  )}

                </div>

              )}

            </div>

          ))}

        </div>


        {/* Cooldown */}

        <div className="mt-8">

          <h3 className="font-bold text-[#24483a]">
            Cooldown
          </h3>

          <ul className="mt-3 space-y-2">

            {day.cooldown?.map((item, index) => (

              <li
                key={index}
                className="text-sm leading-6 text-[#71817a]"
              >
                • {item}
              </li>

            ))}

          </ul>

        </div>


      </div>

    </article>

  );

}


// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  icon,
  label,
  value,
}) {

  return (

    <div className="rounded-3xl border border-[#e1eae5] bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1eee7] text-[#397054]">
        {icon}
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8a9992]">
        {label}
      </p>

      <p className="mt-1 font-bold text-[#24483a]">
        {value}
      </p>

    </div>

  );

}


// ============================================================
// EXERCISE STAT
// ============================================================

function ExerciseStat({
  label,
  value,
}) {

  return (

    <div className="min-w-[55px] rounded-xl bg-white px-2 py-2">

      <p className="text-[10px] uppercase tracking-wider text-[#8a9992]">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-[#397054]">
        {value}
      </p>

    </div>

  );

}


// ============================================================
// ADVICE CARD
// ============================================================

function AdviceCard({
  title,
  items,
}) {

  return (

    <section className="rounded-[2rem] border border-[#e1eae5] bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-[#24483a]">
        {title}
      </h2>

      <ul className="mt-5 space-y-3">

        {items?.map((item, index) => (

          <li
            key={index}
            className="text-sm leading-7 text-[#71817a]"
          >
            • {item}
          </li>

        ))}

      </ul>

    </section>

  );

}


// ============================================================
// FORMAT VALUE
// ============================================================

function formatValue(value) {

  if (!value) return "Not specified";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

}