"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  Clock,
  Dumbbell,
  Utensils,
  Play,
  Trophy,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";


export default function TodayPage() {

  const [workoutPlan, setWorkoutPlan] =
    useState(null);

  const [workoutLog, setWorkoutLog] =
    useState(null);

  const [nutritionPlan, setNutritionPlan] =
    useState(null);

  const [nutritionLog, setNutritionLog] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);


  const today =
    getLocalDate();


  // ==========================================================
  // LOAD EVERYTHING
  // ==========================================================

  useEffect(() => {

    loadToday();

  }, []);


  async function loadToday() {

    try {

      setLoading(true);


      const [
        workoutPlanResponse,
        workoutLogResponse,
        nutritionPlanResponse,
        nutritionLogResponse,
      ] = await Promise.all([

        fetch("/api/ai/workout"),

        fetch(
          `/api/tracking/workout?date=${today}`
        ),

        fetch("/api/ai/nutrition"),

        fetch(
          `/api/tracking/nutrition?date=${today}`
        ),

      ]);


      const workoutPlanData =
        await workoutPlanResponse.json();

      const workoutLogData =
        await workoutLogResponse.json();

      const nutritionPlanData =
        await nutritionPlanResponse.json();

      const nutritionLogData =
        await nutritionLogResponse.json();


      setWorkoutPlan(
        workoutPlanData.plan || null
      );

      setWorkoutLog(
        workoutLogData.log || null
      );

      setNutritionPlan(
        nutritionPlanData.plan || null
      );

      setNutritionLog(
        nutritionLogData.log || null
      );


    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load today's activity."
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // START WORKOUT
  // ==========================================================

  async function startWorkout() {

    if (!workoutPlan?.days?.length) {

      toast.error(
        "No workout plan found."
      );

      return;

    }


    try {

      setActionLoading(true);


      /*
        Phase 5 temporary scheduling:

        Rotate through the workout plan days.

        Later we will allow the user to choose
        Monday / Wednesday / Friday etc.
      */

      const dayIndex =
        getDayIndex(
          today,
          workoutPlan.days.length
        );


      const day =
        workoutPlan.days[dayIndex];


      const response =
        await fetch(
          "/api/tracking/workout",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              date: today,
              dayNumber:
                day.dayNumber,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Could not start workout."
        );

      }


      setWorkoutLog(data.log);

      toast.success(
        "Workout started! Let's go 💪"
      );


    } catch (error) {

      console.error(error);

      toast.error(
        error.message ||
        "Could not start workout."
      );

    } finally {

      setActionLoading(false);

    }

  }


  // ==========================================================
  // COMPLETE EXERCISE
  // ==========================================================

  async function toggleExercise(
    exerciseIndex,
    completed
  ) {

    try {

      setActionLoading(true);


      const response =
        await fetch(
          "/api/tracking/workout/exercise",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              date: today,
              exerciseIndex,
              completed:
                !completed,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Could not update exercise."
        );

      }


      setWorkoutLog(data.log);


    } catch (error) {

      toast.error(
        error.message ||
        "Could not update exercise."
      );

    } finally {

      setActionLoading(false);

    }

  }


  // ==========================================================
  // FINISH WORKOUT
  // ==========================================================

  async function finishWorkout() {

    try {

      setActionLoading(true);


      const response =
        await fetch(
          "/api/tracking/workout/finish",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              date: today,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Could not finish workout."
        );

      }


      setWorkoutLog(data.log);


      toast.success(
        "Workout complete! 🔥"
      );


    } catch (error) {

      toast.error(
        error.message ||
        "Could not finish workout."
      );

    } finally {

      setActionLoading(false);

    }

  }


  // ==========================================================
  // CREATE NUTRITION LOG
  // ==========================================================

  async function startNutritionTracking() {

    try {

      const response =
        await fetch(
          "/api/tracking/nutrition",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              date: today,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Could not load nutrition."
        );

      }


      setNutritionLog(data.log);


    } catch (error) {

      toast.error(
        error.message ||
        "Could not load nutrition."
      );

    }

  }


  // ==========================================================
  // COMPLETE MEAL
  // ==========================================================

  async function toggleMeal(
    mealIndex,
    completed
  ) {

    try {

      const response =
        await fetch(
          "/api/tracking/nutrition/meal",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              date: today,
              mealIndex,
              completed:
                !completed,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Could not update meal."
        );

      }


      setNutritionLog(data.log);


    } catch (error) {

      toast.error(
        error.message ||
        "Could not update meal."
      );

    }

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">

        <Loader2
          size={30}
          className="animate-spin text-[#397054]"
        />

      </main>

    );

  }


  // ==========================================================
  // FIND TODAY'S WORKOUT DAY
  // ==========================================================

  const workoutDay =
    workoutPlan?.days?.[
      getDayIndex(
        today,
        workoutPlan?.days?.length || 1
      )
    ];


  const completedExercises =
    workoutLog?.exercises?.filter(
      (exercise) =>
        exercise.completed
    ).length || 0;


  const totalExercises =
    workoutLog?.exercises?.length || 0;


  const completedMeals =
    nutritionLog?.meals?.filter(
      (meal) =>
        meal.completed
    ).length || 0;


  const totalMeals =
    nutritionLog?.meals?.length || 0;


  return (

    <main className="min-h-screen bg-[#f7faf8] px-5 py-10 text-[#17231e] sm:px-8">

      <div className="mx-auto max-w-5xl">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#397054]"
        >
          <ArrowLeft size={17} />

          Dashboard
        </Link>


        <section className="mt-8">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
            Today
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#173d30]">
            Let's get it done.
          </h1>

          <p className="mt-3 text-[#71817a]">
            Track your workout and nutrition as you go.
          </p>

        </section>


        {/* ====================================================
            WORKOUT
        ==================================================== */}

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#dfe9e3] bg-white shadow-sm">

          <div className="bg-[#173d30] p-7 text-white sm:p-8">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Dumbbell size={23} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-[#a8cbb7]">
                  Workout
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {workoutDay?.title ||
                    "Today's workout"}
                </h2>

              </div>

            </div>


            {workoutDay && (

              <p className="mt-4 text-sm text-[#c6d8cf]">
                {workoutDay.focus}
                {" • "}
                {workoutDay.estimatedDuration} minutes
              </p>

            )}

          </div>


          <div className="p-6 sm:p-8">


            {/* NOT STARTED */}

            {!workoutLog && (

              <div className="text-center">

                <p className="text-sm text-[#71817a]">
                  Your workout is ready.
                </p>

                <button
                  onClick={startWorkout}
                  disabled={actionLoading}
                  className="mt-5 inline-flex items-center gap-3 rounded-full bg-[#173d30] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#245442] disabled:opacity-50"
                >

                  <Play size={17} />

                  Start Workout

                </button>

              </div>

            )}


            {/* IN PROGRESS */}

            {workoutLog &&
              workoutLog.status !==
                "completed" && (

              <div>

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-bold text-[#24483a]">
                      {completedExercises} /{" "}
                      {totalExercises} exercises
                    </p>

                    <p className="mt-1 text-xs text-[#8a9992]">
                      Complete each exercise as you go.
                    </p>

                  </div>


                  <div className="rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-bold text-[#397054]">
                    In progress
                  </div>

                </div>


                <div className="mt-6 space-y-3">

                  {workoutDay?.exercises?.map(
                    (exercise, index) => {

                      const logExercise =
                        workoutLog.exercises?.[
                          index
                        ];

                      const completed =
                        logExercise?.completed ||
                        false;


                      return (

                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            toggleExercise(
                              index,
                              completed
                            )
                          }
                          disabled={actionLoading}
                          className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                            completed
                              ? "border-[#b9d8c6] bg-[#edf6f0]"
                              : "border-[#e1eae5] bg-[#f9fbfa] hover:border-[#bdd7c8]"
                          }`}
                        >

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? "bg-[#397054] text-white"
                                : "bg-white text-[#8a9992]"
                            }`}
                          >

                            {completed ? (
                              <Check size={19} />
                            ) : (
                              <span className="text-sm font-bold">
                                {index + 1}
                              </span>
                            )}

                          </div>


                          <div className="flex-1">

                            <p
                              className={`font-bold ${
                                completed
                                  ? "text-[#397054] line-through"
                                  : "text-[#24483a]"
                              }`}
                            >
                              {exercise.name}
                            </p>

                            <p className="mt-1 text-xs text-[#8a9992]">
                              {exercise.sets} sets ×{" "}
                              {exercise.reps}
                            </p>

                          </div>


                          <span className="text-xs font-bold text-[#397054]">
                            {completed
                              ? "Done"
                              : "Complete"}
                          </span>

                        </button>

                      );

                    }
                  )}

                </div>


                <button
                  onClick={finishWorkout}
                  disabled={
                    actionLoading ||
                    completedExercises === 0
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#173d30] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#245442] disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <Trophy size={17} />

                  Finish Workout

                </button>

              </div>

            )}


            {/* COMPLETED */}

            {workoutLog?.status ===
              "completed" && (

              <div className="py-5 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e1eee7] text-[#397054]">

                  <Check size={30} />

                </div>

                <h3 className="mt-5 text-2xl font-bold text-[#173d30]">
                  Workout complete! 🎉
                </h3>

                <p className="mt-2 text-sm text-[#71817a]">
                  You completed{" "}
                  {completedExercises} of{" "}
                  {totalExercises} exercises.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* ====================================================
            NUTRITION
        ==================================================== */}

        <section className="mt-8 rounded-[2rem] border border-[#dfe9e3] bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">
                <Utensils size={22} />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-[#8a9992]">
                  Nutrition
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#24483a]">
                  Today's meals
                </h2>

              </div>

            </div>


            {nutritionLog && (

              <div className="rounded-full bg-[#edf6f0] px-4 py-2 text-xs font-bold text-[#397054]">
                {completedMeals}/{totalMeals}
              </div>

            )}

          </div>


          {!nutritionLog && (

            <div className="mt-6 text-center">

              <p className="text-sm text-[#71817a]">
                Track the meals you eat today.
              </p>

              <button
                onClick={startNutritionTracking}
                className="mt-5 rounded-full bg-[#173d30] px-6 py-3 text-sm font-bold text-white"
              >
                Start Nutrition Tracking
              </button>

            </div>

          )}


          {nutritionLog && (

            <div className="mt-6 space-y-3">

              {nutritionLog.meals.map(
                (meal, index) => (

                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      toggleMeal(
                        index,
                        meal.completed
                      )
                    }
                    className={`flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition ${
                      meal.completed
                        ? "border-[#b9d8c6] bg-[#edf6f0]"
                        : "border-[#e1eae5] bg-[#f9fbfa]"
                    }`}
                  >

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        meal.completed
                          ? "bg-[#397054] text-white"
                          : "bg-white text-[#8a9992]"
                      }`}
                    >

                      {meal.completed ? (
                        <Check size={18} />
                      ) : (
                        <Utensils size={17} />
                      )}

                    </div>


                    <div className="flex-1">

                      <p
                        className={`font-bold ${
                          meal.completed
                            ? "text-[#397054] line-through"
                            : "text-[#24483a]"
                        }`}
                      >
                        {meal.mealName}
                      </p>

                    </div>


                    <span className="text-xs font-bold text-[#397054]">

                      {meal.completed
                        ? "Eaten"
                        : "Mark done"}

                    </span>

                  </button>

                )
              )}

            </div>

          )}

        </section>


        {/* ====================================================
            PROGRESS
        ==================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">

          <ProgressCard
            icon={<Dumbbell size={20} />}
            label="Workout"
            value={
              workoutLog?.status ===
              "completed"
                ? "Completed"
                : `${completedExercises}/${totalExercises}`
            }
          />

          <ProgressCard
            icon={<Utensils size={20} />}
            label="Nutrition"
            value={
              nutritionLog
                ? `${completedMeals}/${totalMeals} meals`
                : "Not started"
            }
          />

        </section>


      </div>

    </main>
  );
}


// ============================================================
// PROGRESS CARD
// ============================================================

function ProgressCard({
  icon,
  label,
  value,
}) {

  return (

    <div className="rounded-3xl border border-[#e1eae5] bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e1eee7] text-[#397054]">
          {icon}
        </div>

        <div>

          <p className="text-xs font-bold uppercase tracking-wider text-[#8a9992]">
            {label}
          </p>

          <p className="mt-1 font-bold text-[#24483a]">
            {value}
          </p>

        </div>

      </div>

    </div>

  );
}


// ============================================================
// LOCAL DATE
// ============================================================

function getLocalDate() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;
}


// ============================================================
// PLAN DAY ROTATION
// ============================================================

function getDayIndex(
  date,
  numberOfDays
) {

  if (!numberOfDays) return 0;


  const start =
    new Date("2026-01-01T00:00:00Z");

  const current =
    new Date(`${date}T00:00:00Z`);


  const diff =
    Math.floor(
      (
        current.getTime() -
        start.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    );


  return (
    ((diff % numberOfDays) +
      numberOfDays) %
    numberOfDays
  );
}