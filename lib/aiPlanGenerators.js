import ai from "@/lib/gemini";


// ============================================================
// WORKOUT GENERATOR
// ============================================================

export async function generateWorkoutPlan({
  profile,
  aiContext,
}) {

  const workoutConstraints =
    aiContext?.workoutConstraints || [];


  const prompt = `
You are FitSync AI, a personalized fitness planning engine.

Create a realistic weekly workout plan for this user.

You MUST use the user's provided fitness profile.

Do not ask the user questions.

Do not require an additional prompt.

Do not invent missing information.

Respect:
- user's goal
- experience level
- workout days
- workout duration
- workout location
- available equipment
- activity level
- recovery/sleep information

IMPORTANT USER-PROVIDED WORKOUT CONSTRAINTS:

${workoutConstraints.length
    ? workoutConstraints.join("\n- ")
    : "None"}

You MUST respect these constraints.

If the user has reported pain, injury, or another medical concern:
- Do not diagnose it.
- Avoid exercises that could reasonably aggravate the stated issue.
- Keep recommendations conservative.
- Recommend consulting a qualified healthcare professional when appropriate.

The workout must be practical and progressive.

The number of workout days MUST match the user's requested frequency.

The approximate duration of each workout MUST fit within the requested duration.

Only use equipment the user has available.

USER PROFILE:

Age:
${profile.age}

Gender:
${profile.gender || "Not specified"}

Height:
${profile.height?.value} ${profile.height?.unit}

Weight:
${profile.weight?.value} ${profile.weight?.unit}

Primary goal:
${profile.primaryGoal}

Experience level:
${profile.experienceLevel}

Workout days:
${profile.workoutDays}

Workout duration:
${profile.workoutDuration} minutes

Workout location:
${profile.workoutLocation}

Equipment:
${profile.equipment?.join(", ") || "No equipment"}

Activity level:
${profile.activityLevel}

Sleep:
${profile.sleepHours} hours

Motivation:
${profile.motivation || "Not specified"}


Create:

1. Workout title
2. Description
3. Training strategy
4. Workout for each training day
5. Warm-up
6. Exercises
7. Sets
8. Repetitions
9. Rest
10. Instructions
11. Target muscles
12. Cooldown
13. Progression advice
14. Recovery advice


Return ONLY valid JSON.
`;


  const response =
    await ai.models.generateContent({

      model: "gemini-3.6-flash",

      contents: prompt,

      config: {

        responseMimeType: "application/json",

        responseSchema: {

          type: "object",

          properties: {

            title: {
              type: "string",
            },

            description: {
              type: "string",
            },

            primaryGoal: {
              type: "string",
            },

            experienceLevel: {
              type: "string",
            },

            workoutDaysPerWeek: {
              type: "integer",
            },

            workoutDuration: {
              type: "integer",
            },

            strategy: {
              type: "string",
            },

            progressionAdvice: {
              type: "array",
              items: {
                type: "string",
              },
            },

            recoveryAdvice: {
              type: "array",
              items: {
                type: "string",
              },
            },

            days: {

              type: "array",

              items: {

                type: "object",

                properties: {

                  dayNumber: {
                    type: "integer",
                  },

                  title: {
                    type: "string",
                  },

                  focus: {
                    type: "string",
                  },

                  estimatedDuration: {
                    type: "integer",
                  },

                  warmup: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },

                  exercises: {

                    type: "array",

                    items: {

                      type: "object",

                      properties: {

                        name: {
                          type: "string",
                        },

                        sets: {
                          type: "integer",
                        },

                        reps: {
                          type: "string",
                        },

                        restSeconds: {
                          type: "integer",
                        },

                        instructions: {
                          type: "string",
                        },

                        targetMuscles: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },

                      },

                      required: [
                        "name",
                        "sets",
                        "reps",
                        "restSeconds",
                        "instructions",
                        "targetMuscles",
                      ],
                    },
                  },

                  cooldown: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },

                },

                required: [
                  "dayNumber",
                  "title",
                  "focus",
                  "estimatedDuration",
                  "warmup",
                  "exercises",
                  "cooldown",
                ],
              },
            },

          },

          required: [
            "title",
            "description",
            "primaryGoal",
            "experienceLevel",
            "workoutDaysPerWeek",
            "workoutDuration",
            "strategy",
            "progressionAdvice",
            "recoveryAdvice",
            "days",
          ],
        },
      },
    });


  return JSON.parse(response.text);
}


// ============================================================
// NUTRITION GENERATOR
// ============================================================

export async function generateNutritionPlan({
  profile,
  aiContext,
}) {

  const dietaryAvoidances =
    aiContext?.dietaryAvoidances || [];


  const prompt = `
You are the AI nutritionist for FitSync.

Create a personalized GENERAL nutrition plan.

Use the user's onboarding information.

Do not ask the user additional questions.

IMPORTANT USER-PROVIDED FOOD RESTRICTIONS:

${dietaryAvoidances.length
    ? dietaryAvoidances.join("\n- ")
    : "None"}

You MUST NOT include foods that violate these restrictions.

Respect:
- diet type
- dietary preferences
- fitness goal
- activity level
- meals per day
- food restrictions

This is general fitness nutrition guidance, not medical advice.

Do not recommend extreme calorie restriction.

Generate exactly 7 days.

The number of meals should follow mealsPerDay as closely as possible.

USER PROFILE:

${JSON.stringify(
  {
    age: profile.age,
    gender: profile.gender,
    height: profile.height,
    weight: profile.weight,
    primaryGoal: profile.primaryGoal,
    experienceLevel: profile.experienceLevel,
    activityLevel: profile.activityLevel,
    sleepHours: profile.sleepHours,
    dietType: profile.dietType,
    dietaryPreferences:
      profile.dietaryPreferences,
    mealsPerDay: profile.mealsPerDay,
    motivation: profile.motivation,
  },
  null,
  2
)}


RETURN ONLY VALID JSON.

Use exactly:

{
  "title": "string",
  "summary": "string",
  "caloriesTarget": 0,
  "proteinTarget": 0,
  "carbsTarget": 0,
  "fatsTarget": 0,
  "days": [
    {
      "day": "Day 1",
      "meals": [
        {
          "name": "string",
          "time": "string",
          "description": "string",
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fats": 0
        }
      ],
      "dailyCalories": 0,
      "dailyProtein": 0,
      "dailyCarbs": 0,
      "dailyFats": 0
    }
  ],
  "hydration": "string",
  "tips": ["string"]
}

Return exactly 7 days.
`;


  const model =
    ai.models;


  const response =
    await model.generateContent({

      model: "gemini-3.6-flash",

      contents: prompt,

      config: {
        responseMimeType: "application/json",
      },
    });


  let text =
    response.text.trim();


  if (text.startsWith("```")) {

    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }


  return JSON.parse(text);
}