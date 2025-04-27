import { db } from "@/firebase/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export const getUserId = async (email: string): Promise<string> => {
  if (!email) {
    throw new Error("Email parameter is required.");
  }

  try {
    // Create a reference to the users collection
    const usersCollectionRef = collection(db, "users");
    
    // Build the query properly
    const userQuery = query(
      usersCollectionRef,
      where("email", "==", email),
      limit(1)
    );
    
    // Execute the query
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error(`No user found for the email: ${email}`);
    }

    // Extract and return the user ID
    const userDoc = userSnapshot.docs[0];
    return userDoc.id;
  } catch (error: any) {
    throw new Error(`Error retrieving user ID: ${error.message}`);
  }
};