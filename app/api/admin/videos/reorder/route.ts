import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVideosCollection, getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getSessionFromRequest } from "@/lib/auth-server";

// Validation schema for reorder
const reorderSchema = z.object({
  videos: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    })
  ),
});

// PATCH - Reorder videos
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify authentication and user existence
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(session.userId) });

    if (!user) {
      return NextResponse.json(
        { error: "User not found or account deleted" },
        { status: 401 }
      );
    }

    // Validate input
    const validationResult = reorderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { videos: videoUpdates } = validationResult.data;

    const videos = await getVideosCollection();

    // Update each video's order using bulk operations
    const bulkOps = videoUpdates.map((update) => ({
      updateOne: {
        filter: { _id: new ObjectId(update.id) },
        update: { $set: { order: update.order, updatedAt: new Date() } },
      },
    }));

    const result = await videos.bulkWrite(bulkOps);

    return NextResponse.json(
      {
        success: true,
        message: "Videos reordered successfully",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering videos:", error);
    return NextResponse.json(
      { error: "Failed to reorder videos" },
      { status: 500 }
    );
  }
}
