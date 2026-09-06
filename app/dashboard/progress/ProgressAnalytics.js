"use client";

import {
  Activity,
  Dumbbell,
  Utensils,
  TrendingUp,
} from "lucide-react";


export default function ProgressAnalytics({
  analytics,
}) {

  if (!analytics) {
    return null;
  }


  const {
    dailyActivity = [],
    weeklyAnalytics = [],
  } = analytics;


  return (

    <section className="mt-6 space-y-6">


      {/* =====================================================
          30 DAY ACTIVITY
      ===================================================== */}

      <AnalyticsCard
        icon={<Activity size={23} />}
        title="30-day activity"
        description="See how consistently you've been training and tracking nutrition."
      >

        <ActivityChart
          data={dailyActivity}
        />

      </AnalyticsCard>


      {/* =====================================================
          WEEKLY PERFORMANCE
      ===================================================== */}

      <AnalyticsCard
        icon={<TrendingUp size={23} />}
        title="Weekly performance"
        description="Compare your workout and nutrition consistency over the last four weeks."
      >

        <WeeklyChart
          data={weeklyAnalytics}
        />

      </AnalyticsCard>


      {/* =====================================================
          WEEKLY BREAKDOWN
      ===================================================== */}

      <div className="grid gap-5 md:grid-cols-2">

        <WeeklyWorkoutCard
          data={weeklyAnalytics}
        />


        <WeeklyNutritionCard
          data={weeklyAnalytics}
        />

      </div>

    </section>

  );

}


// ============================================================
// ANALYTICS CARD
// ============================================================

function AnalyticsCard({
  icon,
  title,
  description,
  children,
}) {

  return (

    <div className="rounded-[2rem] border border-[#e1eae5] bg-white p-7 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">

          {icon}

        </div>


        <div>

          <h2 className="text-xl font-bold text-[#24483a]">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#71817a]">
            {description}
          </p>

        </div>

      </div>


      <div className="mt-7">

        {children}

      </div>

    </div>

  );

}


// ============================================================
// ACTIVITY CHART
// ============================================================

function ActivityChart({
  data,
}) {

  if (!data.length) {

    return (

      <div className="rounded-2xl bg-[#f7faf8] p-8 text-center">

        <p className="text-sm text-[#71817a]">
          No activity data yet.
        </p>

      </div>

    );

  }


  return (

    <div>

      <div className="flex items-end gap-1.5 overflow-x-auto pb-2">

        {data.map(
          (day) => {

            const workoutHeight =
              day.workout.completion;


            const nutritionHeight =
              day.nutrition.completion;


            const height =
              Math.max(
                workoutHeight,
                nutritionHeight
              );


            return (

              <div
                key={day.date}
                className="group flex min-w-[14px] flex-1 flex-col items-center"
              >

                <div className="relative flex h-44 w-full items-end justify-center">

                  <div
                    className="w-full max-w-[14px] rounded-t-full bg-[#397054] transition-all duration-300 group-hover:opacity-80"
                    style={{
                      height:
                        `${Math.max(
                          height,
                          day.activity
                            ? 5
                            : 2
                        )}%`,
                    }}
                  />

                </div>


                <span className="mt-2 text-[9px] text-[#9aa8a1]">

                  {day.date.slice(
                    8
                  )}

                </span>

              </div>

            );

          }
        )}

      </div>


      <div className="mt-5 flex flex-wrap gap-5 text-xs text-[#71817a]">

        <Legend
          label="Activity"
        />

        <span>
          Height represents your strongest activity for the day.
        </span>

      </div>

    </div>

  );

}


// ============================================================
// WEEKLY CHART
// ============================================================

function WeeklyChart({
  data,
}) {

  if (!data.length) {
    return null;
  }


  return (

    <div className="space-y-5">

      {data.map(
        (week) => (

          <div
            key={week.week}
          >

            <div className="flex items-center justify-between">

              <span className="text-sm font-bold text-[#24483a]">
                Week {week.week}
              </span>

              <span className="text-xs font-semibold text-[#82918a]">
                {week.overallConsistency}% consistency
              </span>

            </div>


            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#edf2ef]">

              <div
                className="h-full rounded-full bg-[#397054] transition-all"
                style={{
                  width:
                    `${week.overallConsistency}%`,
                }}
              />

            </div>


            <div className="mt-2 flex justify-between text-xs text-[#82918a]">

              <span>
                {week.completedWorkouts}/
                {week.targetWorkouts || 0}
                {" "}workouts
              </span>

              <span>
                {week.nutritionCompletion}% nutrition
              </span>

            </div>

          </div>

        )
      )}

    </div>

  );

}


// ============================================================
// WORKOUT BREAKDOWN
// ============================================================

function WeeklyWorkoutCard({
  data,
}) {

  const latest =
    data[data.length - 1];


  if (!latest) {
    return null;
  }


  return (

    <div className="rounded-[2rem] border border-[#e1eae5] bg-white p-7 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">

          <Dumbbell size={23} />

        </div>


        <div>

          <h3 className="font-bold text-[#24483a]">
            Workout consistency
          </h3>

          <p className="text-xs text-[#82918a]">
            Latest week
          </p>

        </div>

      </div>


      <p className="mt-6 text-3xl font-bold text-[#173d30]">
        {latest.workoutCompletion}%
      </p>


      <p className="mt-2 text-sm text-[#71817a]">

        {latest.completedWorkouts} completed workout
        {latest.completedWorkouts === 1
          ? ""
          : "s"}

        {latest.targetWorkouts > 0
          ? ` out of ${latest.targetWorkouts} planned`
          : ""}

      </p>

    </div>

  );

}


// ============================================================
// NUTRITION BREAKDOWN
// ============================================================

function WeeklyNutritionCard({
  data,
}) {

  const latest =
    data[data.length - 1];


  if (!latest) {
    return null;
  }


  return (

    <div className="rounded-[2rem] border border-[#e1eae5] bg-white p-7 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1eee7] text-[#397054]">

          <Utensils size={23} />

        </div>


        <div>

          <h3 className="font-bold text-[#24483a]">
            Nutrition consistency
          </h3>

          <p className="text-xs text-[#82918a]">
            Latest week
          </p>

        </div>

      </div>


      <p className="mt-6 text-3xl font-bold text-[#173d30]">
        {latest.nutritionCompletion}%
      </p>


      <p className="mt-2 text-sm text-[#71817a]">

        {latest.completedMeals} of{" "}
        {latest.totalMeals} tracked meals completed.

      </p>

    </div>

  );

}


// ============================================================
// LEGEND
// ============================================================

function Legend({
  label,
}) {

  return (

    <div className="flex items-center gap-2">

      <span className="h-2.5 w-2.5 rounded-full bg-[#397054]" />

      <span>
        {label}
      </span>

    </div>

  );

}