"use client";
import { useEffect } from "react";
import { getFCMToken } from "@/lib/getFCMToken";
import { useSession } from "next-auth/react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function NotificationProvider() {
    const { data: session, status } = useSession();
    useEffect(() => {
        console.log("NotificationProvider mounted");
        console.log("Status:", status);
        console.log("Session:", session);
        async function setup() {
            console.log("setup() called");
            if (!session?.user?.id) {
                console.log("No user id");
                return;
            }
            console.log("User found:", session.user.id);
            const token =
                await getFCMToken();
            console.log("FCM Token:", token);
            if (token) {
                const res = await fetch(
                    "/api/notifications/token",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            token,

                            userId:
                                session.user.id

                        })
                    }
                );
                console.log("Save token status:", res.status);
                console.log(await res.json());
            }
        }
        setup();
    }, [session, status]);
    useEffect(() => {

        if (!messaging) return;

        const unsubscribe = onMessage(
            messaging,
            (payload) => {

                console.log("Foreground notification:", payload);
                toast(`${payload.notification?.title}: ${payload.notification?.body}`);
                // new Notification(
                //     payload.notification.title,
                //     {
                //         body: payload.notification.body,
                //         icon: "/logo.jpg",
                //     }
                // );

            }
        );

        return unsubscribe;

    }, []);
    return null;
}