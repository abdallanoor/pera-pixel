import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUsersCollection } from "@/lib/mongodb";
import { hashPassword, getSessionFromRequest } from "@/lib/auth-server";

// Validation schema for registration
const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if initial setup is allowed or if user is authenticated
    const session = await getSessionFromRequest(request);

    // Check if any users exist
    const users = await getUsersCollection();
    const existingUsersCount = await users.countDocuments();

    // Allow registration only if:
    // 1. No users exist yet (Initial Setup)
    // 2. A logged-in user is creating a new account
    if (existingUsersCount > 0 && !session) {
      return NextResponse.json(
        { error: "You must be logged in to create new accounts" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
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

    // Check if username already exists
    const existingUser = await users.findOne({
      username: username,
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this username already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the user
    const now = new Date();
    const result = await users.insertOne({
      username: username,
      passwordHash,
      name: username, // default name
      createdAt: now,
      updatedAt: now,
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
