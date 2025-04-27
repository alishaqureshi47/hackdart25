"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface UserContextType {
    userId: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchUserId = async () => {
            // Check localStorage for userId
            const storedUserId = localStorage.getItem("userId");
            if (storedUserId) {
                setUserId(storedUserId);
                return;
            }

            // Get email from session
            const email = session?.user?.email;
            if (!email) return;

            try {
                // Query Firebase for userId using email
                const usersCollection = collection(db, "users");
                const q = query(usersCollection, where("email", "==", email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const fetchedUserId = userDoc.id;

                    // Save userId to state and localStorage
                    setUserId(fetchedUserId);
                    localStorage.setItem("userId", fetchedUserId);
                }
            } catch (error) {
                console.error("Error fetching userId from Firebase:", error);
            }
        };

        fetchUserId();
    }, [session]);

    return (
        <UserContext.Provider value={{ userId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};