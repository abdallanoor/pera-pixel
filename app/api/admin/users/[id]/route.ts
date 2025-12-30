import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection, ObjectId } from "@/lib/mongodb";
import { getSessionFromRequest } from "@/lib/auth-server";

// PUT method removed as per requirements (delete only)

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

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

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
