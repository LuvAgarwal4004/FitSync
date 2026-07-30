"use client";

import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";


export async function getFCMToken() {
    console.log("getFCMToken started");

    try {
        console.log("Current permission:", Notification.permission);

        const permission =
            await Notification.requestPermission();
        console.log("Permission result:", permission);

        if (permission !== "granted") {
            return null;
        }

        const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
        );
        const token =
            await getToken(
                messaging,
                {
                    vapidKey:
                        "BKnwRqiGV-DTtqkPiGQJ4S29YH6dqLf0iC7h_m8mfxkzKM5eEqLf0IOhXfcJERDrf2dV15unJxgOkKdFtr6lS5o",
                    serviceWorkerRegistration: registration,
                }
            );


        return token;


    }
    catch (error) {

        console.log(
            "FCM TOKEN ERROR",
            error
        );

        return null;

    }


}