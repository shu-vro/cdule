// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    connectAuthEmulator,
} from "firebase/auth";
import {
    connectFirestoreEmulator,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzsb3HYq6oT3eNMjjT-w6jUSDj-GcEyXQ",
    authDomain: "c-dule.firebaseapp.com",
    projectId: "c-dule",
    storageBucket: "c-dule.appspot.com",
    messagingSenderId: "574855510160",
    appId: "1:574855510160:web:597b9e13d64d54c11d8015",
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});

if (globalThis?.location?.hostname === "localhost") {
    connectAuthEmulator(auth, "http://127.0.0.1:4001");
    connectFirestoreEmulator(firestoreDb, "127.0.0.1", 4002);
}

export async function signInWithGoogle() {
    try {
        let provider = new GoogleAuthProvider();
        let { user } = await signInWithPopup(auth, provider);
        return user;
    } catch (e: any) {
        console.warn("There was an error at signInWithGoogle", e);
        await signOut(auth);
        return e.code as string;
    }
}
