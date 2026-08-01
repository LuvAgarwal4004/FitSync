
console.log("SERVICE WORKER LOADED");
importScripts(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);


firebase.initializeApp({

    apiKey: "AIzaSyB8vbfoty_yIU_fSFKITiL8Jy_PhcWuncI",
    authDomain: "hitk-stationary-3d50f.firebaseapp.com",
    projectId: "hitk-stationary-3d50f",
    storageBucket: "hitk-stationary-3d50f.firebasestorage.app",
    messagingSenderId: "826070424222",
    appId: "1:826070424222:web:47b549425070fbbe27f98f"

});
self.skipWaiting();
self.addEventListener("activate", (event) => {
        event.waitUntil(clients.claim());
    });
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
// console.log("BACKGROUND MESSAGE");
// console.log(payload);
    // console.log(
        // "Background message received ",
        // payload
    // );


    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: "/logo1.jpg",

            data: {
                url: payload.data.url
            }

        }
    );
});


self.addEventListener(
    "notificationclick",
    (event) => {

        event.notification.close();


        event.waitUntil(

            clients.openWindow(
                event.notification.data.url
            )

        );

    });