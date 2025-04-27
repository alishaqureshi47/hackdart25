import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/firebase";

interface UserContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  setUserId: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const storedUserId = localStorage.getItem("userId");

      if (storedUserId) {
        try {
          // Attempt to fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", storedUserId));
          if (userDoc.exists()) {
            setUserId(storedUserId);
          } else {
            throw new Error("User not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          handleSignOut();
        }
      } else {
        handleSignOut();
      }
    };

    const handleSignOut = () => {
      // Clear local storage and sign out the user
      localStorage.removeItem("userId");
      signOut()
        .then(() => {
          router.push("/login"); // Redirect to login page
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    };

    checkUser();
  }, [db, router]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
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