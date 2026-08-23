"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
    ArrowLeft,
    Send,
    Sparkles,
    Loader2,
    Dumbbell,
    Utensils,
    Check,
    X,
} from "lucide-react";

import toast from "react-hot-toast";


export default function CoachPage() {

    const [messages, setMessages] =
        useState([]);

    const [input, setInput] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    const bottomRef =
        useRef(null);


    // ============================================================
    // LOAD CHAT
    // ============================================================

    useEffect(() => {

        loadMessages();

    }, []);


    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, sending]);

    useEffect(() => {

        function handleSuggestion(event) {

            sendMessage(event.detail);

        }

        window.addEventListener(
            "fitsync-ai-suggestion",
            handleSuggestion
        );

        return () => {

            window.removeEventListener(
                "fitsync-ai-suggestion",
                handleSuggestion
            );

        };

    }, []);
   async function loadMessages() {

    try {

        const response =
            await fetch(
                "/api/ai/chat",
                {
                    method: "GET",
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Could not load AI coach."
            );
        }

        setMessages(
            data.messages || []
        );

    } catch (error) {

        console.error(error);

        toast.error(
            error.message ||
            "Could not load AI coach."
        );

    } finally {

        setLoading(false);

    }
}


    // ============================================================
    // SEND MESSAGE
    // ============================================================

    async function sendMessage(
        customMessage
    ) {

        const text =
            (
                customMessage ??
                input
            ).trim();


        if (!text || sending) {
            return;
        }


        setInput("");


        setMessages((current) => [

            ...current,

            {
                role: "user",
                content: text,
                optimistic: true,
            },

        ]);


        try {

            setSending(true);


            const response =
                await fetch(
                    "/api/ai/chat",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            message: text,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.error ||
                    "AI request failed."
                );
            }


            setMessages((current) => [

                ...current,

                data.message,

            ]);


        } catch (error) {

            console.error(error);

            toast.error(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setSending(false);

        }
    }


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">

                <div className="text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173d30] text-white">

                        <Loader2
                            size={23}
                            className="animate-spin"
                        />

                    </div>

                    <p className="mt-5 font-semibold text-[#397054]">
                        Loading your AI coach...
                    </p>

                </div>

            </main>

        );
    }


    return (

        <main className="min-h-screen bg-[#f7faf8] text-[#17231e]">

            {/* ======================================================
          HEADER
      ====================================================== */}

            <header className="border-b border-[#e1eae5] bg-white">

                <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-5 sm:px-8">

                    <Link
                        href="/dashboard"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e1eae5] text-[#397054] transition hover:bg-[#edf6f0]"
                    >
                        <ArrowLeft size={18} />
                    </Link>


                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173d30] text-white">
                        <Sparkles size={21} />
                    </div>


                    <div>

                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
                            FitSync AI
                        </p>

                        <h1 className="font-bold text-[#173d30]">
                            Fitness Coach
                        </h1>

                    </div>

                </div>

            </header>


            {/* ======================================================
          CHAT
      ====================================================== */}

            <div className="mx-auto flex max-w-5xl flex-col px-5 sm:px-8">

                <div className="flex min-h-[calc(100vh-170px)] flex-col">

                    {/* MESSAGES */}

                    <div className="flex-1 space-y-5 py-8">

                        {messages.length === 0 && (

                            <WelcomeMessage />

                        )}


                        {messages.map(
                            (message, index) => (

                                <ChatBubble
                                    key={
                                        message._id ||
                                        `${message.createdAt}-${index}`
                                    }
                                    message={message}
                                    onAction={
                                        message.actionStatus ===
                                            "pending"
                                            ? sendMessage
                                            : null
                                    }
                                />

                            )
                        )}


                        {sending && (

                            <div className="flex items-start gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#173d30] text-white">

                                    <Sparkles size={16} />

                                </div>

                                <div className="rounded-3xl rounded-tl-md bg-white px-5 py-4 shadow-sm">

                                    <div className="flex items-center gap-2 text-sm text-[#71817a]">

                                        <Loader2
                                            size={15}
                                            className="animate-spin"
                                        />

                                        FitSync is thinking...

                                    </div>

                                </div>

                            </div>

                        )}


                        <div ref={bottomRef} />

                    </div>


                    {/* INPUT */}

                    <div className="sticky bottom-0 bg-[#f7faf8] pb-5 pt-3">

                        <form
                            onSubmit={(event) => {

                                event.preventDefault();

                                sendMessage();

                            }}

                            className="rounded-[2rem] border border-[#dce7e1] bg-white p-2 shadow-lg"
                        >

                            <div className="flex items-end gap-2">

                                <textarea
                                    value={input}
                                    onChange={(event) =>
                                        setInput(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={(event) => {

                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey
                                        ) {

                                            event.preventDefault();

                                            sendMessage();

                                        }

                                    }}
                                    placeholder="Ask your AI fitness coach anything..."
                                    rows={1}
                                    maxLength={3000}
                                    className="min-h-[48px] flex-1 resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#9aa8a1]"
                                />


                                <button
                                    type="submit"
                                    disabled={
                                        sending ||
                                        !input.trim()
                                    }
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#173d30] text-white transition hover:bg-[#245541] disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <Send size={18} />

                                </button>

                            </div>

                        </form>


                        <p className="mt-3 text-center text-[11px] leading-5 text-[#8a9992]">
                            FitSync AI provides general fitness guidance.
                            It does not diagnose or treat medical conditions.
                        </p>

                    </div>

                </div>

            </div>

        </main>

    );
}


// ============================================================
// WELCOME
// ============================================================

function WelcomeMessage() {

    return (

        <div className="mx-auto max-w-2xl py-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#173d30] text-white shadow-lg">

                <Sparkles size={27} />

            </div>


            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#5d9c7b]">
                Your AI fitness coach
            </p>


            <h2 className="mt-3 text-3xl font-bold text-[#173d30]">
                What can I help you with?
            </h2>


            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#71817a]">
                Ask about your workout, nutrition plan, exercises,
                recovery, fitness goals or anything else related
                to your fitness journey.
            </p>


            <div className="mt-7 grid gap-3 text-left sm:grid-cols-2">

                <Suggestion
                    icon={<Dumbbell size={17} />}
                    text="How can I improve my workout?"
                />

                <Suggestion
                    icon={<Utensils size={17} />}
                    text="What should I eat after training?"
                />

            </div>

        </div>

    );
}


// ============================================================
// SUGGESTION
// ============================================================

function Suggestion({
    icon,
    text,
}) {

    return (

        <button
            type="button"
            onClick={() => {

                const event =
                    new CustomEvent(
                        "fitsync-ai-suggestion",
                        {
                            detail: text,
                        }
                    );

                window.dispatchEvent(event);

            }}
            className="rounded-2xl border border-[#e1eae5] bg-white p-4 text-left text-sm font-semibold text-[#315047] transition hover:border-[#bdd7c8] hover:bg-[#f9fbfa]"
        >

            <div className="flex items-center gap-3">

                <span className="text-[#397054]">
                    {icon}
                </span>

                {text}

            </div>

        </button>

    );
}


// ============================================================
// CHAT BUBBLE
// ============================================================

function ChatBubble({
    message,
    onAction,
}) {

    const isUser =
        message.role === "user";


    return (

        <div
            className={
                isUser
                    ? "flex justify-end"
                    : "flex items-start gap-3"
            }
        >

            {!isUser && (

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#173d30] text-white">

                    <Sparkles size={16} />

                </div>

            )}


            <div
                className={
                    isUser
                        ? "max-w-[85%] rounded-3xl rounded-br-md bg-[#173d30] px-5 py-4 text-sm leading-7 text-white shadow-sm"
                        : "max-w-[85%] rounded-3xl rounded-tl-md bg-white px-5 py-4 text-sm leading-7 text-[#52665d] shadow-sm"
                }
            >

                <p className="whitespace-pre-wrap">
                    {message.content}
                </p>


                {/* ====================================================
            REGENERATION ACTION
        ==================================================== */}

                {message.actionStatus ===
                    "pending" &&
                    onAction && (

                        <div className="mt-5 rounded-2xl border border-[#dce8e1] bg-[#f7faf8] p-4">

                            <p className="text-xs font-bold uppercase tracking-wider text-[#397054]">
                                Update your plan?
                            </p>


                            <p className="mt-2 text-xs leading-5 text-[#71817a]">
                                FitSync can regenerate the relevant plan
                                using this new information.
                            </p>


                            <div className="mt-4 flex gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        onAction(
                                            "yes"
                                        )
                                    }
                                    className="inline-flex items-center gap-2 rounded-full bg-[#173d30] px-4 py-2.5 text-xs font-bold text-white"
                                >

                                    <Check size={14} />

                                    Yes, regenerate

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        onAction(
                                            "no"
                                        )
                                    }
                                    className="inline-flex items-center gap-2 rounded-full border border-[#d8e5de] bg-white px-4 py-2.5 text-xs font-bold text-[#397054]"
                                >

                                    <X size={14} />

                                    No, keep it

                                </button>

                            </div>

                        </div>

                    )}

            </div>
        </div>

    );
}