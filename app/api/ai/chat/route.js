import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/db/connectDb";

import FitnessProfile from "@/models/FitnessProfile";
import WorkoutPlan from "@/models/WorkoutPlan";
import NutritionPlan from "@/models/NutritionPlan";
import AIUserContext from "@/models/AIUserContext";
import AIChatMessage from "@/models/AIChatMessage";

import {
    generateWorkoutPlan,
    generateNutritionPlan,
} from "@/lib/aiPlanGenerators";

import ai from "@/lib/gemini";


// ============================================================
// AUTH HELPER
// ============================================================

async function getAuthenticatedUser() {

    const session =
        await getServerSession(authOptions);


    if (!session?.user?.id) {
        return null;
    }


    return session.user;
}


// ============================================================
// GET CHAT HISTORY
// ============================================================

export async function GET() {

    try {

        const user =
            await getAuthenticatedUser();


        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }


        await connectDB();


        const messages =
            await AIChatMessage.find({
                userId: user.id,
            })
                .sort({
                    createdAt: 1,
                })
                .limit(100)
                .lean();


        return NextResponse.json({
            success: true,
            messages,
        });


    } catch (error) {

        console.error(
            "GET AI CHAT ERROR:",
            error
        );


        return NextResponse.json(
            {
                success: false,
                error: "Failed to load chat.",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// POST CHAT MESSAGE
// ============================================================

export async function POST(request) {

    try {

        const user =
            await getAuthenticatedUser();


        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }


        await connectDB();


        const body =
            await request.json();


        const message =
            String(body.message || "").trim();


        if (!message) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Message is required.",
                },
                {
                    status: 400,
                }
            );
        }


        if (message.length > 3000) {

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Message is too long. Keep it under 3000 characters.",
                },
                {
                    status: 400,
                }
            );
        }


        // ========================================================
        // LOAD USER DATA
        // ========================================================

        const [
            profile,
            workoutPlan,
            nutritionPlan,
            aiContext,
            history,
        ] = await Promise.all([

            FitnessProfile.findOne({
                userId: user.id,
            }).lean(),

            WorkoutPlan.findOne({
                userId: user.id,
                active: true,
            }).lean(),

            NutritionPlan.findOne({
                userId: user.id,
            }).lean(),

            AIUserContext.findOne({
                userId: user.id,
            }).lean(),

            AIChatMessage.find({
                userId: user.id,
            })
                .sort({
                    createdAt: -1,
                })
                .limit(30)
                .lean(),

        ]);


        if (!profile || !profile.completed) {

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Please complete onboarding first.",
                },
                {
                    status: 400,
                }
            );
        }


        // ========================================================
        // SAVE USER MESSAGE
        // ========================================================

        await AIChatMessage.create({

            userId: user.id,

            role: "user",

            content: message,

            action: "none",

            actionStatus: "none",

        });


        // ========================================================
        // CHECK WHETHER USER IS ANSWERING A PENDING ACTION
        // ========================================================

        const lastPendingAction =
            await AIChatMessage.findOne({

                userId: user.id,

                role: "assistant",

                actionStatus: "pending",

            })
                .sort({
                    createdAt: -1,
                });


        const normalizedMessage =
            message
                .toLowerCase()
                .replace(/[.!?,]/g, "")
                .trim();


        const affirmativeWords = [
            "yes",
            "y",
            "yeah",
            "yep",
            "sure",
            "do it",
            "regenerate",
            "regenerate it",
            "please do",
            "yes please",
        ];


        const negativeWords = [
            "no",
            "n",
            "nope",
            "not now",
            "keep it",
            "dont",
            "don't",
            "leave it",
        ];


        // ========================================================
        // USER CONFIRMED REGENERATION
        // ========================================================

        if (
            lastPendingAction &&
            affirmativeWords.includes(
                normalizedMessage
            )
        ) {

            const action =
                lastPendingAction.action;

            const reason =
                lastPendingAction.actionReason;


            // ------------------------------------------------------
            // SAVE CONTEXT
            // ------------------------------------------------------

            const contextUpdate = {};


            if (
                action === "regenerate_nutrition"
            ) {

                contextUpdate.$addToSet = {
                    dietaryAvoidances: reason,
                };

            }


            if (
                action === "regenerate_workout"
            ) {

                contextUpdate.$addToSet = {
                    workoutConstraints: reason,
                };

            }


            const updatedContext =
                await AIUserContext.findOneAndUpdate(

                    {
                        userId: user.id,
                    },

                    {
                        $setOnInsert: {
                            userId: user.id,
                        },

                        ...contextUpdate,
                    },

                    {
                        new: true,
                        upsert: true,
                    }
                );


            // ------------------------------------------------------
            // REGENERATE
            // ------------------------------------------------------

            let assistantText = "";


            if (
                action === "regenerate_nutrition"
            ) {

                const generated =
                    await generateNutritionPlan({

                        profile,

                        aiContext:
                            updatedContext.toObject(),

                    });


                await NutritionPlan.findOneAndUpdate(

                    {
                        userId: user.id,
                    },

                    {
                        $set: {

                            ...generated,

                            userId: user.id,

                            generatedBy: "gemini",

                            generatedAt: new Date(),

                        },
                    },

                    {
                        new: true,
                        upsert: true,
                        runValidators: true,
                    }
                );


                assistantText =
                    "Done. I regenerated your nutrition plan and removed the food restriction you mentioned from the plan.";
            }


            if (
                action === "regenerate_workout"
            ) {

                const generated =
                    await generateWorkoutPlan({

                        profile,

                        aiContext:
                            updatedContext.toObject(),

                    });


                const currentPlan =
                    await WorkoutPlan.findOne({
                        userId: user.id,
                    }).lean();


                await WorkoutPlan.findOneAndUpdate(

                    {
                        userId: user.id,
                    },

                    {
                        $set: {

                            ...generated,

                            userId: user.id,

                            generatedBy: "gemini",

                            model: "gemini-3.6-flash",

                            active: true,

                        },

                        $inc: {
                            version: 1,
                        },
                    },

                    {
                        new: true,
                        upsert: true,
                        runValidators: true,
                    }
                );


                assistantText =
                    "Done. I regenerated your workout around the limitation you mentioned. I've also saved that preference so future workout generations can respect it.";
            }


            lastPendingAction.actionStatus =
                "confirmed";

            await lastPendingAction.save();


            const assistantMessage =
                await AIChatMessage.create({

                    userId: user.id,

                    role: "assistant",

                    content: assistantText,

                    action: "none",

                    actionStatus: "none",

                });


            return NextResponse.json({

                success: true,

                message: assistantMessage,

                regenerated: action,

            });
        }


        // ========================================================
        // USER REJECTED REGENERATION
        // ========================================================

        if (
            lastPendingAction &&
            negativeWords.includes(
                normalizedMessage
            )
        ) {

            lastPendingAction.actionStatus =
                "rejected";

            await lastPendingAction.save();


            const assistantMessage =
                await AIChatMessage.create({

                    userId: user.id,

                    role: "assistant",

                    content:
                        "No problem. I'll keep your current plan unchanged.",

                    action: "none",

                    actionStatus: "none",

                });


            return NextResponse.json({

                success: true,

                message: assistantMessage,

            });
        }


        // ========================================================
        // GEMINI CONTEXT
        // ========================================================

        const recentHistory =
            history
                .reverse()
                .map(
                    (item) =>
                        `${item.role.toUpperCase()}: ${item.content}`
                )
                .join("\n");


        const userContext = {

            profile: {

                age: profile.age,

                gender: profile.gender,

                height: profile.height,

                weight: profile.weight,

                primaryGoal:
                    profile.primaryGoal,

                experienceLevel:
                    profile.experienceLevel,

                workoutDays:
                    profile.workoutDays,

                workoutDuration:
                    profile.workoutDuration,

                workoutLocation:
                    profile.workoutLocation,

                equipment:
                    profile.equipment,

                activityLevel:
                    profile.activityLevel,

                sleepHours:
                    profile.sleepHours,

                dietType:
                    profile.dietType,

                dietaryPreferences:
                    profile.dietaryPreferences,

                mealsPerDay:
                    profile.mealsPerDay,

                motivation:
                    profile.motivation,

            },

            storedConstraints: {

                dietaryAvoidances:
                    aiContext?.dietaryAvoidances || [],

                workoutConstraints:
                    aiContext?.workoutConstraints || [],

            },

            currentWorkout:

                workoutPlan
                    ? {
                        title: workoutPlan.title,
                        strategy: workoutPlan.strategy,
                        days: workoutPlan.days,
                    }
                    : null,

            currentNutrition:

                nutritionPlan
                    ? {
                        title: nutritionPlan.title,
                        summary: nutritionPlan.summary,
                        caloriesTarget:
                            nutritionPlan.caloriesTarget,
                        proteinTarget:
                            nutritionPlan.proteinTarget,
                        carbsTarget:
                            nutritionPlan.carbsTarget,
                        fatsTarget:
                            nutritionPlan.fatsTarget,
                    }
                    : null,

        };


        // ========================================================
        // GEMINI PROMPT
        // ========================================================

        const prompt = `
You are FitSync AI Fitness Coach.

You are the user's personalized fitness assistant.

You have access to the user's onboarding information,
current workout plan, current nutrition plan,
stored constraints and recent conversation.

Do NOT ask the user to repeat information that already exists
in the context.

Do NOT invent user information.

Your responsibilities:

1. Answer normal fitness questions.
2. Explain workouts and exercises.
3. Explain nutrition concepts.
4. Help the user understand their plans.
5. Give practical fitness guidance.
6. Keep answers personalized using the provided context.

IMPORTANT:

If the user tells you about a FOOD ALLERGY,
FOOD INTOLERANCE,
FOOD THEY CANNOT EAT,
or another dietary restriction that should affect
their nutrition plan:

Set:
intent = "nutrition_regeneration"

Ask whether they want their nutrition plan regenerated.

The actionReason MUST contain ONLY the actual food restriction.

Example:

User:
"I'm allergic to peanuts."

actionReason:
"Peanuts"

If the user tells you about a WORKOUT LIMITATION,
such as:
- injury
- pain
- downstairs neighbours
- no jumping
- can't run
- equipment limitation
- exercise they cannot perform
- movement they want avoided

Set:
intent = "workout_regeneration"

Ask whether they want their workout regenerated.

The actionReason MUST contain the relevant limitation.

Example:

User:
"I have downstairs neighbours, so I can't do jumping exercises."

actionReason:
"Downstairs neighbours; avoid jumping/high-impact exercises."

For medical concerns:
- Do not diagnose.
- Do not claim to treat injuries.
- Give conservative guidance.
- Recommend a qualified professional when appropriate.

For ordinary questions:
intent = "normal"

Do NOT ask to regenerate anything unless the user actually
provided a new restriction that should change their plan.

USER CONTEXT:

${JSON.stringify(
            userContext,
            null,
            2
        )}

RECENT CONVERSATION:

${recentHistory || "No previous conversation."}

NEW USER MESSAGE:

${message}

RETURN ONLY JSON:

{
  "reply": "string",
  "intent": "normal | nutrition_regeneration | workout_regeneration",
  "actionReason": "string"
}
`;


        // ========================================================
        // GEMINI
        // ========================================================
        // ============================================================
        // GEMINI REQUEST WITH RETRY
        // ============================================================

        let response;

        const maxAttempts = 3;

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            try {

                response =
                    await ai.models.generateContent({

                        model: "gemini-3.6-flash",

                        contents: prompt,

                        config: {
                            responseMimeType: "application/json",
                        },

                    });

                break;

            } catch (error) {

                console.error(
                    `Gemini attempt ${attempt} failed:`,
                    error
                );

                const errorMessage =
                    error?.message ||
                    "";

                const isTemporary =
                    errorMessage.includes("503") ||
                    errorMessage.includes("UNAVAILABLE") ||
                    errorMessage.includes("high demand") ||
                    errorMessage.includes("overloaded");

                if (
                    !isTemporary ||
                    attempt === maxAttempts
                ) {

                    throw error;

                }

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            1000 * attempt
                        )
                );
            }
        }


        let result;


        try {

            let text =
                response.text.trim();


            if (text.startsWith("```")) {

                text = text
                    .replace(/^```json\s*/i, "")
                    .replace(/^```\s*/i, "")
                    .replace(/\s*```$/i, "")
                    .trim();
            }


            result =
                JSON.parse(text);


        } catch {

            result = {

                reply:
                    response.text ||

                    "I'm sorry, I couldn't process that.",

                intent: "normal",

                actionReason: "",

            };

        }


        // ========================================================
        // DETERMINE ACTION
        // ========================================================

        let action =
            "none";


        if (
            result.intent ===
            "nutrition_regeneration"
        ) {

            action =
                "regenerate_nutrition";

        }


        if (
            result.intent ===
            "workout_regeneration"
        ) {

            action =
                "regenerate_workout";

        }


        // ========================================================
        // SAVE ASSISTANT MESSAGE
        // ========================================================

        const assistantMessage =
            await AIChatMessage.create({

                userId: user.id,

                role: "assistant",

                content:
                    result.reply,

                action,

                actionStatus:
                    action === "none"
                        ? "none"
                        : "pending",

                actionReason:
                    result.actionReason || "",

            });


        return NextResponse.json({

            success: true,

            message:
                assistantMessage,

        });


    } catch (error) {

        console.error(
            "AI CHAT ERROR:",
            error
        );


        return NextResponse.json(
            {
                success: false,
                error:
                    error.message ||
                    "AI chat failed.",
            },
            {
                status: 500,
            }
        );
    }
}