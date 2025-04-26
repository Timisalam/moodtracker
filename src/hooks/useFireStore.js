import { useReducer, useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { projectFireStore } from "../firebase/config";

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null,
};

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case "IS_PENDING":
            return { success: false, isPending: true, error: null, document: null };
        case "ERROR":
            return { success: false, isPending: false, error: action.payload, document: null };
        case "ADDED_DOCUMENT":
            return { success: true, isPending: false, error: null, document: action.payload };
        default:
            return state;
    }
};

export const useFirestore = (collectionName) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState);
    const [isCancelled, setIsCancelled] = useState(false);

    const ref = collection(projectFireStore, collectionName);

    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action);
        }
    };

    const addDocument = async (doc) => {
        dispatch({ type: "IS_PENDING" });

        try {
            const createdAt = serverTimestamp();
            const addedDocument = await addDoc(ref, { ...doc, createdAt });
            dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDocument });
        } catch (err) {
            dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
        }
    };

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { addDocument, response };
};
