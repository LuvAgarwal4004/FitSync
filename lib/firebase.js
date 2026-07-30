import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyB8vbfoty_yIU_fSFKITiL8Jy_PhcWuncI",
    authDomain: "hitk-stationary-3d50f.firebaseapp.com",
    projectId: "hitk-stationary-3d50f",
    storageBucket: "hitk-stationary-3d50f.firebasestorage.app",
    messagingSenderId: "826070424222",
    appId: "1:826070424222:web:47b549425070fbbe27f98f"
};


const app = initializeApp(firebaseConfig);


export const messaging =
    typeof window !== "undefined"
        ? getMessaging(app)
        : null;