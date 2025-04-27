import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

/**
 * Stores user data (email, name, and profile picture) in Firebase if it doesn't already exist.
 * @param {string} email - The user's email address.
 * @param {string} name - The user's name.
 * @param {string} profilePicture - The user's profile picture URL.
 * @returns {Promise<string>} - A promise that resolves with the user document ID.
 */
export async function createUser(email: string, name: string, profilePicture: string): Promise<string> {
  try {
    const usersCollection = collection(db, "users"); // Reference to the "users" collection

    // Query to check if a user with the same email already exists
    const userQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      // If a user with the same email exists, return the existing document ID
      const existingUser = querySnapshot.docs[0];
      console.log("User already exists with ID:", existingUser.id);
      return existingUser.id;
    }

    // If no user with the same email exists, add a new document
    const docRef = await addDoc(usersCollection, { email, name, profilePicture });
    console.log("User data successfully stored in Firebase with ID:", docRef.id);
    return docRef.id; // Return the generated document ID
  } catch (error) {
    console.error("Error storing user data in Firebase:", error);
    throw error;
  }
}