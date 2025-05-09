import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCRxgvCN1wg4YA3MzpccYru7MASEY8JHhs",
    authDomain: "screentimetracker-d74f9.firebaseapp.com",
    projectId: "screentimetracker-d74f9",
    storageBucket: "screentimetracker-d74f9.firebasestorage.app",
    messagingSenderId: "685099745581",
    appId: "1:685099745581:web:074c53cc0aeabde78153a4"
};

const app = initializeApp(firebaseConfig);

const projectFireStore = getFirestore(app);
const projectAuth = getAuth(app);

const timestamp = Timestamp;

export { projectFireStore, projectAuth, timestamp };
