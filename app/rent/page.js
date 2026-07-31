"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function RentPage() {
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id");

    const [loadingEdit, setLoadingEdit] = useState(Boolean(editId));
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        studentName: "",
        branch: "",
        year: "",
        phone: "",
        whatsapp: "",
        itemNeeded: "",
        description: "",
        fromTime: "",
        toTime: "",
        fromDate: "",
        toDate: "",
        meetLocation: "",
        offeredMoney: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const loadRequest = async () => {
            if (!editId || status !== "authenticated") return;

            try {
                setLoadingEdit(true);

                const res = await fetch(`/api/rent/${editId}`, {
                    cache: "no-store",
                });

                if (res.status === 401) {
                    router.replace("/login");
                    return;
                }

                if (!res.ok) {
                    throw new Error("Failed to load request");
                }

                const data = await res.json();

                setForm({
                    studentName: data.studentName || "",
                    branch: data.branch || "",
                    year: data.year || "",
                    phone: data.phone || "",
                    whatsapp: data.whatsapp || "",
                    itemNeeded: data.itemNeeded || "",
                    description: data.description || "",
                    fromTime: data.fromTime || "",
                    toTime: data.toTime || "",
                    fromDate: data.fromDate || "",
                    toDate: data.toDate || "",
                    meetLocation: data.meetLocation || "",
                    offeredMoney: data.offeredMoney || "",
                });
            } catch (error) {
                console.log(error);
                toast.error("Could not load rent request for editing.");
                router.replace("/my-activity");
            } finally {
                setLoadingEdit(false);
            }
        };

        loadRequest();
    }, [editId, status, router]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasDate = form.fromDate && form.toDate;
        const hasTime = form.fromTime && form.toTime;

        if (
            !form.studentName ||
            !form.branch ||
            !form.year ||
            !form.phone ||
            !form.whatsapp ||
            !form.itemNeeded ||
            !form.meetLocation ||
            !form.offeredMoney
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (!hasDate && !hasTime) {
            toast.error("Please provide either a date range or a time range.");
            return;
        }

        try {
            setLoading(true);

            const url = editId ? `/api/rent/${editId}` : "/api/rent";
            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                throw new Error("Failed to save rent request");
            }

            toast.success(
                editId
                    ? "Rent request updated successfully!"
                    : "Rent request posted successfully!"
            );

            router.replace("/");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || (editId && loadingEdit)) {
        return (
            <main className="min-h-screen flex items-center justify-center text-2xl font-bold">
                Loading...
            </main>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 py-10 text-white">
            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md"
            >
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8">
                    <h1 className="text-3xl font-bold sm:text-4xl">
                        {editId ? "Edit Rent Request" : "Rent Stationery"}
                    </h1>
                    <p className="mt-2 text-white/90">
                        Fill in your details and request the stationery you need.
                    </p>
                </div>

                <div className="space-y-10 p-6 sm:p-8">
                    <section>
                        <h2 className="mb-6 text-2xl font-bold">Student Details</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    Student Name
                                </label>
                                <input
                                    name="studentName"
                                    value={form.studentName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    Branch
                                </label>
                                <input
                                    name="branch"
                                    value={form.branch}
                                    onChange={handleChange}
                                    placeholder="Computer Science"
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    Year
                                </label>
                                <select
                                    name="year"
                                    value={form.year}
                                    onChange={handleChange}
                                    className="rounded-2xl border border-white/15 bg-white text-black px-4 py-3 outline-none"
                                >
                                    <option value="">Select Year</option>
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    Phone Number
                                </label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block font-semibold text-white/90">
                                    WhatsApp Number
                                </label>
                                <input
                                    name="whatsapp"
                                    value={form.whatsapp}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-6 text-2xl font-bold">Rent Request Details</h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    Stationery Needed
                                </label>
                                <input
                                    name="itemNeeded"
                                    value={form.itemNeeded}
                                    onChange={handleChange}
                                    placeholder="Scientific Calculator"
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    Money Offered (₹)
                                </label>
                                <input
                                    type="number"
                                    name="offeredMoney"
                                    value={form.offeredMoney}
                                    onChange={handleChange}
                                    placeholder="100"
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    From Time
                                </label>
                                <input
                                    type="time"
                                    name="fromTime"
                                    value={form.fromTime}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    To Time
                                </label>
                                <input
                                    type="time"
                                    name="toTime"
                                    value={form.toTime}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={form.fromDate}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none focus:border-white/30"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-semibold text-white/90">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={form.toDate}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none focus:border-white/30"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block font-semibold text-white/90">
                                    Meet Location
                                </label>
                                <input
                                    name="meetLocation"
                                    value={form.meetLocation}
                                    onChange={handleChange}
                                    placeholder="Library, Hostel Gate, Campus Canteen..."
                                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block font-semibold text-white/90">
                                    Description
                                </label>
                                <textarea
                                    rows={5}
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Tell others exactly what you need..."
                                    className="w-full resize-none rounded-xl border border-white/15 bg-white/10 px-4 py-3 outline-none placeholder:text-white/40 focus:border-white/30"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-center pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-12 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                        >
                            {loading ? "Posting..." : editId ? "Update Rent Request" : "Post Rent Request"}
                        </button>
                    </div>
                </div>
            </form>
        </main>
    );
}