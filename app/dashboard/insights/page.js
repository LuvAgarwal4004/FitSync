"use client";

import { useEffect, useState } from "react";


export default function InsightsPage() {

  const [insights, setInsights] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [adapting, setAdapting] =
    useState(null);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD
  // ==========================================================

  async function loadInsights() {

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/ai/insights"
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to load insights."
        );

      }

      setInsights(
        data.insights || []
      );

    } catch (error) {

      console.error(error);

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // ANALYZE
  // ==========================================================

  async function analyze() {

    try {

      setAnalyzing(true);

      setError("");

      const response =
        await fetch(
          "/api/ai/insights",
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to analyze activity."
        );

      }

      setInsights(
        data.insights || []
      );

    } catch (error) {

      console.error(error);

      setError(
        error.message
      );

    } finally {

      setAnalyzing(false);

    }

  }


  // ==========================================================
  // ADAPT
  // ==========================================================

  async function adaptPlan(type) {

    const confirmed =
      window.confirm(
        `Are you sure you want FitSync AI to adapt your ${type} plan based on your recent activity?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setAdapting(type);

      setError("");

      const response =
        await fetch(
          "/api/ai/adapt",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              type,
            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to adapt plan."
        );

      }


      await loadInsights();


      alert(
        `${type === "workout" ? "Workout" : "Nutrition"} plan adapted successfully.`
      );


    } catch (error) {

      console.error(error);

      setError(
        error.message
      );

    } finally {

      setAdapting(null);

    }

  }


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadInsights();

  }, []);


  // ==========================================================
  // UI
  // ==========================================================

  return (

    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "32px 20px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "30px",
        }}
      >

        <div>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            AI Insights
          </h1>

          <p
            style={{
              opacity: 0.7,
            }}
          >
            FitSync AI analyzes your recent
            workout and nutrition behavior.
          </p>

        </div>


        <button
          onClick={analyze}
          disabled={analyzing}
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            border: "none",
            cursor:
              analyzing
                ? "not-allowed"
                : "pointer",
          }}
        >

          {analyzing
            ? "Analyzing..."
            : "Analyze My Progress"}

        </button>

      </div>


      {error && (

        <div
          style={{
            padding: "14px",
            marginBottom: "20px",
            borderRadius: "10px",
            background:
              "#fee2e2",
          }}
        >

          {error}

        </div>

      )}


      {loading ? (

        <p>
          Loading insights...
        </p>

      ) : insights.length === 0 ? (

        <div
          style={{
            padding: "30px",
            borderRadius: "16px",
            border: "1px solid #ddd",
            textAlign: "center",
          }}
        >

          <h2>
            No insights yet
          </h2>

          <p
            style={{
              opacity: 0.7,
              marginTop: "8px",
            }}
          >
            Complete some workouts and meals,
            then ask FitSync AI to analyze
            your progress.
          </p>

        </div>

      ) : (

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >

          {insights.map(
            insight => (

              <div
                key={insight._id}
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "16px",
                  padding:
                    "22px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "10px",
                  }}
                >

                  <span
                    style={{
                      fontSize: "13px",
                      textTransform:
                        "uppercase",
                      opacity: 0.6,
                    }}
                  >
                    {insight.type}
                  </span>


                  <span
                    style={{
                      fontSize: "13px",
                      opacity: 0.6,
                    }}
                  >
                    {insight.severity}
                  </span>

                </div>


                <h2
                  style={{
                    fontSize: "21px",
                    fontWeight: "700",
                    marginTop: "10px",
                  }}
                >
                  {insight.title}
                </h2>


                <p
                  style={{
                    marginTop: "10px",
                    lineHeight: 1.6,
                  }}
                >
                  {insight.message}
                </p>


                {insight.recommendation && (

                  <div
                    style={{
                      marginTop: "16px",
                      padding: "14px",
                      borderRadius: "10px",
                      background:
                        "rgba(0,0,0,0.04)",
                    }}
                  >

                    <strong>
                      Recommendation
                    </strong>

                    <p
                      style={{
                        marginTop: "6px",
                      }}
                    >
                      {insight.recommendation}
                    </p>

                  </div>

                )}


                {insight.action ===
                  "adapt_workout" && (

                  <button
                    onClick={() =>
                      adaptPlan(
                        "workout"
                      )
                    }
                    disabled={
                      adapting ===
                      "workout"
                    }
                    style={{
                      marginTop: "18px",
                      padding:
                        "12px 18px",
                      borderRadius:
                        "10px",
                      border: "none",
                      cursor:
                        "pointer",
                    }}
                  >

                    {adapting ===
                    "workout"
                      ? "Adapting Workout..."
                      : "Adapt Workout Plan"}

                  </button>

                )}


                {insight.action ===
                  "adapt_nutrition" && (

                  <button
                    onClick={() =>
                      adaptPlan(
                        "nutrition"
                      )
                    }
                    disabled={
                      adapting ===
                      "nutrition"
                    }
                    style={{
                      marginTop: "18px",
                      padding:
                        "12px 18px",
                      borderRadius:
                        "10px",
                      border: "none",
                      cursor:
                        "pointer",
                    }}
                  >

                    {adapting ===
                    "nutrition"
                      ? "Adapting Nutrition..."
                      : "Adapt Nutrition Plan"}

                  </button>

                )}

              </div>

            )
          )}

        </div>

      )}

    </main>

  );

}