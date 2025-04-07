import { useEffect, useRef, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { projectFireStore } from "../firebase/config";

export const useCollection = (collectionName, _query, _orderBy) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    // Use refs to avoid infinite loop
    const queryRef = useRef(_query).current;
    const orderByRef = useRef(_orderBy).current;

    useEffect(() => {
        // Start with the collection reference
        let ref = collection(projectFireStore, collectionName);

        // Apply query if provided
        if (queryRef) {
            ref = query(ref, where(...queryRef)); // Use `query` to apply filters
        }

        // Apply ordering if provided
        if (orderByRef) {
            ref = query(ref, orderBy(...orderByRef)); // Use `query` to apply ordering
        }

        // Fetch data with `onSnapshot` listener
        const unsubscribe = onSnapshot(ref, (snapshot) => {
            let results = [];
            snapshot.docs.forEach((doc) => {
                results.push({ ...doc.data(), id: doc.id });
            });

            setDocuments(results);
            setError(null);
        }, (error) => {
            console.log(error);
            setError("Could not fetch data");
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [collectionName, queryRef, orderByRef]);

    return { documents, error };
};
