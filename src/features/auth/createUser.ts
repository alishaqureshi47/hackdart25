import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Import the Firestore database instance

/**
 * Stores user data (email and name) in Firebase.
 * @param {string} userId - The unique identifier for the user.
 * @param {string} email - The user's email address.
 * @param {string} name - The user's name.
 * @returns {Promise<void>} - A promise that resolves when the user data is stored.
 */
export async function createUser(email: string, name: string): Promise<string> {
  try {
	const usersCollection = collection(db, "users"); // Reference to the "users" collection
	const docRef = await addDoc(usersCollection, { email, name }); // Add a new document with the specified fields
	console.log("User data successfully stored in Firebase with ID:", docRef.id);
	return docRef.id; // Return the generated document ID
  } catch (error) {
	console.error("Error storing user data in Firebase:", error);
	throw error;
  }
}