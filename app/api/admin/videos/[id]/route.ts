import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVideosCollection, getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getSessionFromRequest } from "@/lib/auth-server";

// Validation schema for video update
const updateVideoSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  vimeoUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.includes("vimeo.com") || url.includes("player.vimeo.com"),
      "Please enter a valid Vimeo URL"
    )
    .optional(),
  category: z.enum(["horizontal", "vertical"]).optional(),
});

// GET - Fetch single video by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const videos = await getVideosCollection();
    const video = await videos.findOne({ _id: new ObjectId(id) });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ video }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

// PUT - Update a video by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

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

    const body = await request.json();

    // Validate input
    const validationResult = updateVideoSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    const videos = await getVideosCollection();

    const result = await videos.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Video updated successfully", video: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a video by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

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

    const videos = await getVideosCollection();
    const result = await videos.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Video deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
