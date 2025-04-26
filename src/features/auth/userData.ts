import clientPromise from '@/lib/mongodb';

export type UserData = {
  email: string;
  name: string | null;
}

export async function storeUserData(userId: string, email: string, name: string | null): Promise<boolean> {
  console.log("storeUserData called with:", { userId, email, name });
  
  if (!userId) {
    console.error("Cannot store user data: userId is missing");
    return false;
  }

  if (!email) {
    console.error("Cannot store user data: email is missing");
    return false;
  }

  try {
    if (!clientPromise) {
      console.error('MongoDB client promise is not available');
      return false;
    }
    
    const client = await clientPromise;
    console.log("MongoDB client connected");
    
    const db = client.db(process.env.MONGODB_DB || 'quipp');
    console.log("Using database:", process.env.MONGODB_DB || 'quipp');
    
    const usersCollection = db.collection('users');
    
    // Create the userData object
    const userData: UserData = {
      email,
      name
    };
    
    // To avoid type issues, store userId as a field rather than _id
    const result = await usersCollection.updateOne(
      { userId: userId },
      { 
        $set: {
          userData,
          lastUpdated: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log(`User data stored successfully for ${email}`);
    console.log("MongoDB result:", JSON.stringify(result, null, 2));
    return result.acknowledged;
  } catch (error) {
    console.error('Error storing user data in MongoDB:', error);
    return false;
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  console.log("getUserData called for userId:", userId);
  
  if (!userId) {
    console.error("Cannot get user data: userId is missing");
    return null;
  }

  try {
    if (!clientPromise) {
      console.error('MongoDB client promise is not available');
      return null;
    }
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'quipp');
    
    // Find by userId field, not _id
    const user = await db.collection('users').findOne({ userId: userId });
    console.log("MongoDB getUserData result:", user ? "Data found" : "No data found");
    
    return user?.userData || null;
  } catch (error) {
    console.error('Error retrieving user data from MongoDB:', error);
    return null;
  }
}