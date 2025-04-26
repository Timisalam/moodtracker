import { useEffect, useRef, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { projectFireStore } from "../firebase/config";

export const useCollection = (collectionName, _query, _orderBy) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    const queryRef = useRef(_query).current;
    const orderByRef = useRef(_orderBy).current;

    useEffect(() => {
        let ref = collection(projectFireStore, collectionName);

        if (queryRef) {
            ref = query(ref, where(...queryRef)); 
        }

        if (orderByRef) {
            ref = query(ref, orderBy(...orderByRef)); 
        }

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

        return () => unsubscribe();
    }, [collectionName, queryRef, orderByRef]);

    return { documents, error };
};
