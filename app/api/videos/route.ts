import { NextResponse } from "next/server";
import { getVideosCollection } from "@/lib/mongodb";

// GET - Fetch all videos for public portfolio (no auth required)
export async function GET() {
  try {
    const videos = await getVideosCollection();
    const allVideos = await videos.find({}).sort({ order: 1 }).toArray();

    // Separate videos by category
    const horizontalVideos = allVideos
      .filter((v) => v.category === "horizontal")
      .map((v) => ({ src: v.vimeoUrl, title: v.title }));

    const verticalVideos = allVideos
      .filter((v) => v.category === "vertical")
      .map((v) => ({ src: v.vimeoUrl, title: v.title }));

    return NextResponse.json(
      { horizontalVideos, verticalVideos },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching videos for portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
