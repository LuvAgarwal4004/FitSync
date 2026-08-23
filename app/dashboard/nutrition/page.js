"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Sparkles,
  Utensils,
  Droplets,
  Flame,
  Dumbbell,
  RefreshCw,
  Clock,
} from "lucide-react";


export default function NutritionPage() {

  const [plan, setPlan] = useState(null);

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] =
    useState(false);


  // ============================================================
  // LOAD SAVED PLAN
  // ============================================================

  useEffect(() => {

    loadPlan();

  }, []);


  async function loadPlan() {

    try {

      setLoading(true);


      const res = await fetch(
        "/api/ai/nutrition"
      );


      const data = await res.json();


      if (!res.ok || !data.success) {

        throw new Error(
          data.error ||
          "Failed to load nutrition plan"
        );
      }


      setPlan(data.plan);


    } catch (error) {

      console.error(error);

      toast.error(
        error.message ||
        "Failed to load nutrition plan"
      );

    } finally {

      setLoading(false);

    }
  }


  // ============================================================
  // GENERATE
  // ============================================================

  async function generatePlan() {

    try {

      setGenerating(true);


      const res = await fetch(
        "/api/ai/nutrition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            forceRegenerate: true,
          }),
        }
      );


      const data = await res.json();


      if (!res.ok || !data.success) {

        throw new Error(
          data.error ||
          "Failed to generate nutrition plan"
        );
      }


      setPlan(data.plan);


      toast.success(
        "Your nutrition plan is ready!"
      );


    } catch (error) {

      console.error(error);

      toast.error(
        error.message ||
        "Something went wrong"
      );

    } finally {

      setGenerating(false);

    }
  }


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">

        <div className="text-sm font-semibold text-[#5d9c7b]">
          Loading your nutrition plan...
        </div>

      </main>
    );
  }


  // ============================================================
  // NO PLAN
  // ============================================================

  if (!plan) {

    return (
      <main className="min-h-screen bg-[#f7faf8] px-5 py-10 text-[#17231e] sm:px-8">

        <div className="mx-auto max-w-4xl">


          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#397054]"
          >
            <ArrowLeft size={17} />

            Back to dashboard
          </Link>


          <div className="mt-8 overflow-hidden rounded-[2rem] bg-[#173d30] text-white">

            <div className="p-8 sm:p-12">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Utensils size={26} />
              </div>


              <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#a8cbb7]">
                AI Nutritionist
              </p>


              <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
                Your personalized nutrition plan.
              </h1>


              <p className="mt-5 max-w-2xl leading-7 text-[#c1d6ca]">
                FitSync will use the information you provided
                during onboarding to create a nutrition plan
                around your goal, diet, activity level and
                meal preferences.
              </p>


              <button
                type="button"
                onClick={generatePlan}
                disabled={generating}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#173d30] transition hover:-translate-y-0.5 hover:bg-[#edf6f0] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {generating ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />

                    Creating your plan...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />

                    Generate My Nutrition Plan
                  </>
                )}

              </button>

            </div>

          </div>


          <p className="mt-5 text-center text-xs leading-5 text-[#8a9992]">
            FitSync provides general fitness and nutrition
            guidance and is not a substitute for professional
            medical advice.
          </p>

        </div>

      </main>
    );
  }


  // ============================================================
  // PLAN EXISTS
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f7faf8] px-5 py-10 text-[#17231e] sm:px-8">

      <div className="mx-auto max-w-6xl">


        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex items-center justify-between">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#397054]"
          >
            <ArrowLeft size={17} />

            Dashboard
          </Link>


          <button
            type="button"
            onClick={generatePlan}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-full border border-[#dce8e1] bg-white px-4 py-2.5 text-xs font-bold text-[#397054] shadow-sm transition hover:border-[#bdd7c8] disabled:opacity-50"
          >

            <RefreshCw
              size={15}
              className={
                generating
                  ? "animate-spin"
                  : ""
              }
            />

            Regenerate

          </button>

        </div>


        {/* ======================================================
            TITLE
        ====================================================== */}

        <section className="mt-10">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
            AI Nutritionist
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#173d30] sm:text-5xl">
            {plan.title}
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-[#71817a]">
            {plan.summary}
          </p>

        </section>


        {/* ======================================================
            MACROS
        ====================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <NutritionStat
            icon={<Flame size={20} />}
            label="Calories"
            value={`${plan.caloriesTarget || 0}`}
            unit="kcal/day"
          />

          <NutritionStat
            icon={<Dumbbell size={20} />}
            label="Protein"
            value={`${plan.proteinTarget || 0}`}
            unit="g/day"
          />

          <NutritionStat
            icon={<Utensils size={20} />}
            label="Carbs"
            value={`${plan.carbsTarget || 0}`}
            unit="g/day"
          />

          <NutritionStat
            icon={<Sparkles size={20} />}
            label="Fats"
            value={`${plan.fatsTarget || 0}`}
            unit="g/day"
          />

        </section>


        {/* ======================================================
            HYDRATION
        ====================================================== */}

        <section className="mt-8 rounded-3xl border border-[#dfe9e3] bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
              <Droplets size={21} />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-[#8a9992]">
                Hydration
              </p>

              <p className="mt-1 text-sm font-semibold text-[#315047]">
                {plan.hydration}
              </p>

            </div>

          </div>

        </section>


        {/* ======================================================
            7 DAY PLAN
        ====================================================== */}

        <section className="mt-10">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
            Your week
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#173d30]">
            7-day nutrition plan
          </h2>


          <div className="mt-5 space-y-6">

            {(plan.days || []).map(
              (day, index) => (

                <div
                  key={`${day.day}-${index}`}
                  className="overflow-hidden rounded-[2rem] border border-[#e1eae5] bg-white shadow-sm"
                >

                  {/* DAY HEADER */}

                  <div className="border-b border-[#e7eee9] bg-[#f9fbfa] px-6 py-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-[#8a9992]">
                          Day {index + 1}
                        </p>

                        <h3 className="mt-1 text-xl font-bold text-[#24483a]">
                          {day.day}
                        </h3>

                      </div>


                      <div className="flex flex-wrap gap-2 text-xs font-semibold">

                        <span className="rounded-full bg-[#edf6f0] px-3 py-1.5 text-[#397054]">
                          {day.dailyCalories || 0} kcal
                        </span>

                        <span className="rounded-full bg-[#edf6f0] px-3 py-1.5 text-[#397054]">
                          {day.dailyProtein || 0}g protein
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* MEALS */}

                  <div className="divide-y divide-[#edf1ee]">

                    {(day.meals || []).map(
                      (meal, mealIndex) => (

                        <div
                          key={mealIndex}
                          className="p-6"
                        >

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div className="flex gap-4">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e1eee7] text-[#397054]">
                                <Utensils size={18} />
                              </div>

                              <div>

                                <h4 className="font-bold text-[#24483a]">
                                  {meal.name}
                                </h4>

                                <div className="mt-1 flex items-center gap-2 text-xs text-[#8a9992]">
                                  <Clock size={13} />
                                  {meal.time}
                                </div>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#71817a]">
                                  {meal.description}
                                </p>

                              </div>

                            </div>


                            <div className="flex flex-wrap gap-2 text-xs font-semibold">

                              <span className="rounded-full bg-[#f4f7f5] px-3 py-1.5 text-[#52665d]">
                                {meal.calories || 0} kcal
                              </span>

                              <span className="rounded-full bg-[#f4f7f5] px-3 py-1.5 text-[#52665d]">
                                P {meal.protein || 0}g
                              </span>

                              <span className="rounded-full bg-[#f4f7f5] px-3 py-1.5 text-[#52665d]">
                                C {meal.carbs || 0}g
                              </span>

                              <span className="rounded-full bg-[#f4f7f5] px-3 py-1.5 text-[#52665d]">
                                F {meal.fats || 0}g
                              </span>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* ======================================================
            TIPS
        ====================================================== */}

        {(plan.tips || []).length > 0 && (

          <section className="mt-10">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
              FitSync guidance
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#173d30]">
              Keep these in mind
            </h2>


            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              {plan.tips.map(
                (tip, index) => (

                  <div
                    key={index}
                    className="rounded-3xl border border-[#e1eae5] bg-white p-5 shadow-sm"
                  >

                    <div className="flex gap-4">

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e1eee7] text-xs font-bold text-[#397054]">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-6 text-[#71817a]">
                        {tip}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        <p className="mt-10 text-center text-xs leading-5 text-[#8a9992]">
          FitSync nutrition guidance is for general fitness
          purposes and does not replace professional medical
          or dietary advice.
        </p>

      </div>

    </main>
  );
}


// ============================================================
// NUTRITION STAT
// ============================================================

function NutritionStat({
  icon,
  label,
  value,
  unit,
}) {

  return (

    <div className="rounded-3xl border border-[#e1eae5] bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1eee7] text-[#397054]">
        {icon}
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#8a9992]">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-2">

        <p className="text-2xl font-bold text-[#173d30]">
          {value}
        </p>

        <span className="text-xs font-medium text-[#82918a]">
          {unit}
        </span>

      </div>

    </div>
  );
}