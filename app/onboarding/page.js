"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const steps = [
  "Basics",
  "Goal",
  "Training",
  "Lifestyle",
  "Nutrition",
];

const equipmentOptions = [
  "No equipment",
  "Dumbbells",
  "Barbell",
  "Resistance bands",
  "Bench",
  "Pull-up bar",
  "Treadmill",
  "Exercise bike",
];

const dietOptions = [
  "No specific preference",
  "High protein",
  "Low carb",
  "Low fat",
  "Gluten free",
  "Dairy free",
];

export default function OnboardingPage() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    age: "",
    gender: "",

    height: {
      value: "",
      unit: "cm",
    },

    weight: {
      value: "",
      unit: "kg",
    },

    primaryGoal: "",
    experienceLevel: "",

    workoutDays: 4,
    workoutDuration: 60,
    workoutLocation: "",

    equipment: [],

    activityLevel: "",
    sleepHours: 7,

    dietType: "",
    dietaryPreferences: [],
    mealsPerDay: 3,

    motivation: "",
  });

  // ============================================================
  // AUTHENTICATION CHECK
  // ============================================================

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // ============================================================
  // LOAD EXISTING PROFILE
  // ============================================================

useEffect(() => {
  if (status !== "authenticated") return;

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/fitness-profile");

      const data = await res.json();

      if (!res.ok) {
        return;
      }

      // ========================================================
      // PROFILE ALREADY COMPLETED
      // Send user straight to dashboard
      // ========================================================

      if (data.success && data.profile?.completed) {
        router.replace("/dashboard");
        return;
      }


      // ========================================================
      // PROFILE EXISTS BUT IS NOT COMPLETE
      // Load whatever information has already been saved
      // ========================================================

      if (data.success && data.profile) {
        const profile = data.profile;

        setForm({
          age: profile.age || "",
          gender: profile.gender || "",

          height: {
            value: profile.height?.value || "",
            unit: profile.height?.unit || "cm",
          },

          weight: {
            value: profile.weight?.value || "",
            unit: profile.weight?.unit || "kg",
          },

          primaryGoal: profile.primaryGoal || "",
          experienceLevel: profile.experienceLevel || "",

          workoutDays: profile.workoutDays ?? 4,
          workoutDuration: profile.workoutDuration ?? 60,
          workoutLocation: profile.workoutLocation || "",

          equipment: profile.equipment || [],

          activityLevel: profile.activityLevel || "",
          sleepHours: profile.sleepHours ?? 7,

          dietType: profile.dietType || "",
          dietaryPreferences:
            profile.dietaryPreferences || [],

          mealsPerDay: profile.mealsPerDay ?? 3,

          motivation: profile.motivation || "",
        });
      }

    } catch (error) {
      console.error("LOAD FITNESS PROFILE ERROR:", error);
    }
  };

  loadProfile();
}, [status, router]);

  // ============================================================
  // UPDATE FORM
  // ============================================================

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateNestedField = (parent, field, value) => {
    setForm((previous) => ({
      ...previous,
      [parent]: {
        ...previous[parent],
        [field]: value,
      },
    }));
  };

  // ============================================================
  // TOGGLE MULTI SELECT
  // ============================================================

  const toggleArrayValue = (field, value) => {
    setForm((previous) => {
      const exists = previous[field].includes(value);

      return {
        ...previous,
        [field]: exists
          ? previous[field].filter((item) => item !== value)
          : [...previous[field], value],
      };
    });
  };

  // ============================================================
  // STEP VALIDATION
  // ============================================================

  const validateStep = () => {
    if (step === 0) {
      if (!form.age || !form.height.value || !form.weight.value) {
        toast.error("Please complete your basic information.");
        return false;
      }
    }

    if (step === 1) {
      if (!form.primaryGoal || !form.experienceLevel) {
        toast.error("Please select your goal and experience level.");
        return false;
      }
    }

    if (step === 2) {
      if (!form.workoutLocation) {
        toast.error("Please select where you train.");
        return false;
      }
    }

    if (step === 3) {
      if (!form.activityLevel) {
        toast.error("Please select your activity level.");
        return false;
      }
    }

    if (step === 4) {
      if (!form.dietType) {
        toast.error("Please select your diet type.");
        return false;
      }
    }

    return true;
  };

  // ============================================================
  // NEXT
  // ============================================================

  const nextStep = () => {
    if (!validateStep()) return;

    setStep((previous) => Math.min(previous + 1, steps.length - 1));
  };

  // ============================================================
  // SAVE
  // ============================================================

  const saveProfile = async () => {
    if (!validateStep()) return;

    try {
      setSaving(true);

      const res = await fetch("/api/fitness-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save profile");
      }

      toast.success("Fitness profile created!");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <div className="text-sm font-semibold text-[#5d9c7b]">
          Loading FitSync...
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-8 text-[#17231e] sm:px-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mx-auto max-w-3xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <div className="text-xl font-bold text-[#173d30]">
              FitSync
            </div>

            <p className="text-xs text-[#82918a]">
              Personalize your fitness journey
            </p>
          </div>

          <div className="text-sm font-semibold text-[#5d9c7b]">
            {step + 1}/{steps.length}
          </div>

        </div>

        {/* ====================================================
            PROGRESS BAR
        ==================================================== */}

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-[#e1ebe5]">

          <div
            className="h-full rounded-full bg-[#68a981] transition-all duration-500"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          />

        </div>

        {/* ====================================================
            MAIN CARD
        ==================================================== */}

        <div className="overflow-hidden rounded-[2rem] border border-[#dfe9e3] bg-white shadow-xl shadow-[#294f40]/5">

          <div className="p-6 sm:p-10">

            {/* =================================================
                STEP 1 — BASICS
            ================================================= */}

            {step === 0 && (
              <StepContainer
                eyebrow="Let's get to know you"
                title="Tell us about yourself."
                description="We'll use this information to personalize your fitness experience."
              >

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Age"
                    type="number"
                    value={form.age}
                    onChange={(e) =>
                      updateField("age", e.target.value)
                    }
                    placeholder="e.g. 22"
                  />

                  <Select
                    label="Gender"
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value)
                    }
                    options={[
                      ["male", "Male"],
                      ["female", "Female"],
                      ["other", "Other"],
                      [
                        "prefer_not_to_say",
                        "Prefer not to say",
                      ],
                    ]}
                  />

                  <Input
                    label="Height"
                    type="number"
                    value={form.height.value}
                    onChange={(e) =>
                      updateNestedField(
                        "height",
                        "value",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 175"
                  />

                  <Select
                    label="Height unit"
                    value={form.height.unit}
                    onChange={(e) =>
                      updateNestedField(
                        "height",
                        "unit",
                        e.target.value
                      )
                    }
                    options={[
                      ["cm", "Centimetres"],
                      ["ft", "Feet"],
                    ]}
                  />

                  <Input
                    label="Weight"
                    type="number"
                    value={form.weight.value}
                    onChange={(e) =>
                      updateNestedField(
                        "weight",
                        "value",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 70"
                  />

                  <Select
                    label="Weight unit"
                    value={form.weight.unit}
                    onChange={(e) =>
                      updateNestedField(
                        "weight",
                        "unit",
                        e.target.value
                      )
                    }
                    options={[
                      ["kg", "Kilograms"],
                      ["lb", "Pounds"],
                    ]}
                  />

                </div>

              </StepContainer>
            )}

            {/* =================================================
                STEP 2 — GOAL
            ================================================= */}

            {step === 1 && (
              <StepContainer
                eyebrow="Your objective"
                title="What are you working toward?"
                description="Your primary goal will influence the workouts and recommendations we generate."
              >

                <OptionGrid
                  value={form.primaryGoal}
                  onChange={(value) =>
                    updateField("primaryGoal", value)
                  }
                  options={[
                    ["lose_weight", "Lose weight", "🔥"],
                    ["build_muscle", "Build muscle", "💪"],
                    ["gain_weight", "Gain weight", "📈"],
                    [
                      "improve_fitness",
                      "Improve fitness",
                      "🏃",
                    ],
                    [
                      "increase_strength",
                      "Increase strength",
                      "⚡",
                    ],
                    [
                      "maintain",
                      "Maintain my current fitness",
                      "🎯",
                    ],
                  ]}
                />

                <div className="mt-8">

                  <label className="mb-3 block text-sm font-bold text-[#315047]">
                    Fitness experience
                  </label>

                  <OptionGrid
                    value={form.experienceLevel}
                    onChange={(value) =>
                      updateField(
                        "experienceLevel",
                        value
                      )
                    }
                    options={[
                      [
                        "beginner",
                        "Beginner",
                        "🌱",
                      ],
                      [
                        "intermediate",
                        "Intermediate",
                        "📊",
                      ],
                      [
                        "advanced",
                        "Advanced",
                        "🏆",
                      ],
                    ]}
                  />

                </div>

              </StepContainer>
            )}

            {/* =================================================
                STEP 3 — TRAINING
            ================================================= */}

            {step === 2 && (
              <StepContainer
                eyebrow="Your training"
                title="How do you like to train?"
                description="This helps FitSync create realistic routines around your lifestyle."
              >

                <label className="mb-3 block text-sm font-bold text-[#315047]">
                  Where do you train?
                </label>

                <OptionGrid
                  value={form.workoutLocation}
                  onChange={(value) =>
                    updateField(
                      "workoutLocation",
                      value
                    )
                  }
                  options={[
                    ["home", "At home", "🏠"],
                    ["gym", "At the gym", "🏋️"],
                    ["outdoors", "Outdoors", "🌳"],
                    ["mixed", "A mixture", "🔄"],
                  ]}
                />

                <div className="mt-8 grid gap-5 sm:grid-cols-2">

                  <RangeInput
                    label="Workout days per week"
                    value={form.workoutDays}
                    min={1}
                    max={7}
                    onChange={(e) =>
                      updateField(
                        "workoutDays",
                        Number(e.target.value)
                      )
                    }
                    display={`${form.workoutDays} days`}
                  />

                  <RangeInput
                    label="Workout duration"
                    value={form.workoutDuration}
                    min={15}
                    max={120}
                    step={15}
                    onChange={(e) =>
                      updateField(
                        "workoutDuration",
                        Number(e.target.value)
                      )
                    }
                    display={`${form.workoutDuration} min`}
                  />

                </div>

                <div className="mt-8">

                  <label className="mb-3 block text-sm font-bold text-[#315047]">
                    Equipment available
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {equipmentOptions.map((equipment) => (
                      <CheckboxOption
                        key={equipment}
                        label={equipment}
                        checked={form.equipment.includes(
                          equipment
                        )}
                        onClick={() =>
                          toggleArrayValue(
                            "equipment",
                            equipment
                          )
                        }
                      />
                    ))}

                  </div>

                </div>

              </StepContainer>
            )}

            {/* =================================================
                STEP 4 — LIFESTYLE
            ================================================= */}

            {step === 3 && (
              <StepContainer
                eyebrow="Your lifestyle"
                title="Help us understand your routine."
                description="Your daily activity and recovery habits help us give better recommendations."
              >

                <label className="mb-3 block text-sm font-bold text-[#315047]">
                  How active are you outside workouts?
                </label>

                <OptionGrid
                  value={form.activityLevel}
                  onChange={(value) =>
                    updateField(
                      "activityLevel",
                      value
                    )
                  }
                  options={[
                    [
                      "sedentary",
                      "Mostly sitting",
                      "🪑",
                    ],
                    [
                      "lightly_active",
                      "Lightly active",
                      "🚶",
                    ],
                    [
                      "moderately_active",
                      "Moderately active",
                      "🏃",
                    ],
                    [
                      "very_active",
                      "Very active",
                      "🔥",
                    ],
                  ]}
                />

                <div className="mt-8">

                  <RangeInput
                    label="Average sleep"
                    value={form.sleepHours}
                    min={4}
                    max={12}
                    step={0.5}
                    onChange={(e) =>
                      updateField(
                        "sleepHours",
                        Number(e.target.value)
                      )
                    }
                    display={`${form.sleepHours} hours`}
                  />

                </div>

              </StepContainer>
            )}

            {/* =================================================
                STEP 5 — NUTRITION
            ================================================= */}

            {step === 4 && (
              <StepContainer
                eyebrow="Fuel your body"
                title="Tell us about your nutrition."
                description="This information helps FitSync personalize general nutrition guidance."
              >

                <label className="mb-3 block text-sm font-bold text-[#315047]">
                  Diet type
                </label>

                <OptionGrid
                  value={form.dietType}
                  onChange={(value) =>
                    updateField(
                      "dietType",
                      value
                    )
                  }
                  options={[
                    ["omnivore", "Omnivore", "🍗"],
                    ["vegetarian", "Vegetarian", "🥗"],
                    ["vegan", "Vegan", "🌱"],
                    ["eggetarian", "Eggetarian", "🥚"],
                    ["other", "Other", "🍽️"],
                  ]}
                />

                <div className="mt-8">

                  <label className="mb-3 block text-sm font-bold text-[#315047]">
                    Dietary preferences
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {dietOptions.map((option) => (
                      <CheckboxOption
                        key={option}
                        label={option}
                        checked={form.dietaryPreferences.includes(
                          option
                        )}
                        onClick={() =>
                          toggleArrayValue(
                            "dietaryPreferences",
                            option
                          )
                        }
                      />
                    ))}

                  </div>

                </div>

                <div className="mt-8">

                  <RangeInput
                    label="Meals per day"
                    value={form.mealsPerDay}
                    min={1}
                    max={6}
                    onChange={(e) =>
                      updateField(
                        "mealsPerDay",
                        Number(e.target.value)
                      )
                    }
                    display={`${form.mealsPerDay} meals`}
                  />

                </div>

                <div className="mt-8">

                  <label className="mb-2 block text-sm font-bold text-[#315047]">
                    What motivates you?
                  </label>

                  <textarea
                    value={form.motivation}
                    onChange={(e) =>
                      updateField(
                        "motivation",
                        e.target.value
                      )
                    }
                    placeholder="e.g. I want to feel stronger and more confident..."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] px-4 py-3 text-sm outline-none transition focus:border-[#68a981] focus:ring-4 focus:ring-[#68a981]/10"
                  />

                </div>

              </StepContainer>
            )}

          </div>

          {/* ==================================================
              FOOTER CONTROLS
          ================================================== */}

          <div className="flex items-center justify-between border-t border-[#e5ece8] bg-[#f9fbfa] px-6 py-5 sm:px-10">

            <button
              type="button"
              onClick={() =>
                setStep((previous) =>
                  Math.max(previous - 1, 0)
                )
              }
              disabled={step === 0}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#52665d] transition hover:bg-[#e8f0eb] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-[#173d30] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#173d30]/15 transition hover:-translate-y-0.5 hover:bg-[#245543]"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="rounded-full bg-[#173d30] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#173d30]/15 transition hover:-translate-y-0.5 hover:bg-[#245543] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Finish Setup"}
              </button>
            )}

          </div>

        </div>

        <p className="mt-5 text-center text-xs leading-5 text-[#8a9992]">
          Your information is stored in your FitSync account and is used to
          personalize your experience.
        </p>

      </div>
    </main>
  );
}


// ============================================================
// COMPONENTS
// ============================================================

function StepContainer({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <div>

      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5d9c7b]">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#173d30] sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#718079] sm:text-base">
        {description}
      </p>

      <div className="mt-8">
        {children}
      </div>

    </div>
  );
}


function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-[#315047]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] px-4 py-3.5 text-sm outline-none transition focus:border-[#68a981] focus:ring-4 focus:ring-[#68a981]/10"
      />

    </div>
  );
}


function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold text-[#315047]">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-2xl border border-[#dce7e1] bg-[#f8fbf9] px-4 py-3.5 text-sm outline-none transition focus:border-[#68a981] focus:ring-4 focus:ring-[#68a981]/10"
      >

        <option value="">
          Select...
        </option>

        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}

      </select>

    </div>
  );
}


function OptionGrid({
  value,
  onChange,
  options,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">

      {options.map(([optionValue, label, icon]) => {

        const selected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
              selected
                ? "border-[#68a981] bg-[#edf6f0] shadow-sm"
                : "border-[#dfe8e3] bg-[#f9fbfa] hover:border-[#bdd7c8] hover:bg-white"
            }`}
          >

            <span className="text-2xl">
              {icon}
            </span>

            <span
              className={`text-sm font-semibold ${
                selected
                  ? "text-[#245543]"
                  : "text-[#53665e]"
              }`}
            >
              {label}
            </span>

            <span
              className={`ml-auto h-5 w-5 rounded-full border-2 ${
                selected
                  ? "border-[#68a981] bg-[#68a981]"
                  : "border-[#cbd8d1]"
              }`}
            />

          </button>
        );
      })}

    </div>
  );
}


function CheckboxOption({
  label,
  checked,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
        checked
          ? "border-[#68a981] bg-[#edf6f0]"
          : "border-[#dfe8e3] bg-[#f9fbfa] hover:border-[#bdd7c8]"
      }`}
    >

      <span className="text-sm font-medium text-[#53665e]">
        {label}
      </span>

      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs font-bold ${
          checked
            ? "border-[#68a981] bg-[#68a981] text-white"
            : "border-[#cbd8d1]"
        }`}
      >
        {checked ? "✓" : ""}
      </span>

    </button>
  );
}


function RangeInput({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}) {
  return (
    <div>

      <div className="mb-3 flex items-center justify-between">

        <label className="text-sm font-bold text-[#315047]">
          {label}
        </label>

        <span className="rounded-full bg-[#edf6f0] px-3 py-1 text-xs font-bold text-[#397054]">
          {display}
        </span>

      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className="w-full accent-[#68a981]"
      />

    </div>
  );
}