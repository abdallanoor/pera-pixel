import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getVideosCollection, getUsersCollection, Video } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getSessionFromRequest } from "@/lib/auth-server";

// Validation schema for video
const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  vimeoUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.includes("vimeo.com") || url.includes("player.vimeo.com"),
      "Please enter a valid Vimeo URL"
    ),
  category: z.enum(["horizontal", "vertical"]),
});

// GET - Fetch all videos (authenticated)
export async function GET(request: NextRequest) {
  try {
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
    const allVideos = await videos
      .find({})
      .sort({ category: 1, order: 1 })
      .toArray();

    return NextResponse.json({ videos: allVideos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST - Create a new video (authenticated)
export async function POST(request: NextRequest) {
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
    const validationResult = videoSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, vimeoUrl, category } = validationResult.data;

    const videos = await getVideosCollection();

    // Get the highest order for this category
    const lastVideo = await videos
      .find({ category })
      .sort({ order: -1 })
      .limit(1)
      .toArray();

    const nextOrder = lastVideo.length > 0 ? lastVideo[0].order + 1 : 0;

    // Create the video
    const now = new Date();
    const newVideo: Video = {
      title,
      vimeoUrl,
      category,
      order: nextOrder,
      createdAt: now,
      updatedAt: now,
    };

    const result = await videos.insertOne(
      newVideo as Video & { _id: ObjectId }
    );

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: "Failed to create video" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Video created successfully",
        video: { ...newVideo, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
