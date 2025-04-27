import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Import the Firestore database instance
import { signOut } from "next-auth/react"; // Import the signOut function from next-auth

/**
 * Deletes a user document from Firebase and signs the user out.
 * @param {string} email - The user's email address (used to identify the document).
 * @param {any} router - The Next.js router instance for navigation.
 * @returns {Promise<void>} - A promise that resolves when the user is deleted and signed out.
 */
export async function deleteUser(email: string): Promise<void> {
  if (!email) {
    console.error("Email is required to delete user.");
    return;
  } else {
    try {
      const usersCollection = collection(db, "users"); // Reference to the "users" collection
      const q = query(usersCollection, where("email", "==", email)); // Query to find the user document by email
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Delete all matching documents (should typically be one)
        for (const docSnapshot of querySnapshot.docs) {
          await deleteDoc(docSnapshot.ref);
        }
        console.log("User document successfully deleted from Firebase.");
      } else {
        console.error("No user document found with the provided email.");
      }

      // Sign the user out and navigate to the home page
      await signOut();
    } catch (error) {
      console.error("Error deleting user document:", error);
      throw error;
    }
  }
}