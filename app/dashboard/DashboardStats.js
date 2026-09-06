"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  Flame,
  Trophy,
  TrendingUp,
} from "lucide-react";


export default function DashboardStats() {

  const [data, setData] =
    useState(null);


  useEffect(() => {

    async function loadStats() {

      try {

        const response =
          await fetch(
            "/api/progress",
            {
              cache: "no-store",
            }
          );


        const result =
          await response.json();


        if (response.ok) {

          setData(result);

        }

      } catch (error) {

        console.error(
          "DASHBOARD STATS ERROR:",
          error
        );

      }

    }


    loadStats();

  }, []);


  const streak =
    data?.streak?.current || 0;


  const weeklyActivity =
    data?.workout?.weeklyActivity || 0;


  const rank =
    data?.gamification?.rank ||
    "Bronze";


  const xp =
    data?.gamification?.xp || 0;


  return (

    <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


      <StatCard
        icon={<Flame size={21} />}
        label="Current streak"
        value={`${streak} days`}
        description={
          streak > 0
            ? "Keep the streak alive"
            : "Start your streak today"
        }
      />


      <StatCard
        icon={<Activity size={21} />}
        label="Weekly activity"
        value={`${weeklyActivity}%`}
        description={
          weeklyActivity > 0
            ? "Workout activity this week"
            : "No workouts logged yet"
        }
      />


      <StatCard
        icon={<Trophy size={21} />}
        label="Rank"
        value={rank}
        description="Based on your XP"
      />


      <StatCard
        icon={<TrendingUp size={21} />}
        label="Points"
        value={`${xp} XP`}
        description="Earn XP by completing activities"
      />


    </section>

  );

}


// =========================================================
// STAT CARD
// =========================================================

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