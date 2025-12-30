import { getVideosCollection } from "@/lib/mongodb";
import { VideosClient } from "./videos-client";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const collection = await getVideosCollection();
  const videos = await collection.find({}).sort({ order: 1 }).toArray();

  // Serialize MongoDB documents for Client Component
  const serializedVideos = videos.map((v) => ({
    _id: v._id.toString(),
    title: v.title,
    vimeoUrl: v.vimeoUrl,
    category: v.category,
    order: v.order,
    // Add other fields if needed by the interface, but the Client interface only asks for these
  }));

  return <VideosClient initialVideos={serializedVideos} />;
}
