import { MongoClient, Db, ObjectId } from "mongodb";

// Video document type
export interface Video {
  _id?: ObjectId;
  title: string;
  vimeoUrl: string;
  category: "horizontal" | "vertical";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// User (dashboard user) document type
export interface User {
  _id?: ObjectId;
  username: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for video input (without _id and timestamps)
export type VideoInput = Omit<Video, "_id" | "createdAt" | "updatedAt">;

// Type for user input (without _id, passwordHash, and timestamps)
export type UserInput = Omit<
  User,
  "_id" | "passwordHash" | "createdAt" | "updatedAt"
> & {
  password: string;
};

// Global variable to cache the MongoDB client
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  // Create a new MongoDB client
  const client = new MongoClient(MONGODB_URI);

  // Connect to the database
  await client.connect();

  // Get the database (uses the database name from the connection string)
  const db = client.db();

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Helper function to get collections
export async function getVideosCollection() {
  const { db } = await connectToDatabase();
  return db.collection<Video>("videos");
}

export async function getUsersCollection() {
  const { db } = await connectToDatabase();
  return db.collection<User>("users");
}

// Export ObjectId for use in other files
export { ObjectId };
