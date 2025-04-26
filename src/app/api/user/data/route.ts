import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from '@/lib/mongodb';

// GET endpoint to fetch user data
export async function GET() {
    if (!clientPromise) {
        console.error('MongoDB client promise is not available');
        return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "quipp");
        
        // Find by email since we might not have userId in session yet
        const user = await db.collection("users").findOne({ "userData.email": session.user.email });
        
        if (user) {
        return NextResponse.json({ userData: user.userData });
        } else {
        return NextResponse.json({ userData: null });
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

// POST endpoint to save user data
export async function POST(request: NextRequest) {
    if (!clientPromise) {
        console.error('MongoDB client promise is not available');
        return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    try {
        const data = await request.json();
        
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "quipp");
        
        const userData = {
        email: data.email || session.user.email,
        name: data.name || null
        };
        
        const result = await db.collection("users").updateOne(
        { "userData.email": session.user.email },
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
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving user data:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}