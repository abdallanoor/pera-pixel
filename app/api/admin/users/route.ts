import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUsersCollection, User } from "@/lib/mongodb";
import { hashPassword, getSessionFromRequest } from "@/lib/auth-server";
import { ObjectId } from "mongodb";

// Validation schema for creating a user
const createUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"), // Min length consideration?
});

export async function GET(request: NextRequest) {
  try {
    // Verify auth
    const session = await getSessionFromRequest(request);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.userId),
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    // Return users without passwordHash
    const users = await usersCollection
      .find({})
      .sort({ createdAt: -1 })
      .project({ passwordHash: 0 })
      .toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const session = await getSessionFromRequest(request);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      _id: new ObjectId(session.userId),
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    const body = await request.json();

    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const newUser: User = {
      username,
      passwordHash: hashedPassword,
      name: username, // Default name to username since we removed name field from input
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
