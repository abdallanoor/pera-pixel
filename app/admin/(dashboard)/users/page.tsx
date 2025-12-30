import { getUsersCollection } from "@/lib/mongodb";
import { UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const collection = await getUsersCollection();
  // Fetch users, sorting by newest first
  const users = await collection.find({}).sort({ createdAt: -1 }).toArray();

  // Serialize for client component
  const serializedUsers = users.map((u) => ({
    _id: u._id.toString(),
    username: u.username,
    createdAt: u.createdAt.toISOString(),
  }));

  return <UsersClient initialUsers={serializedUsers} />;
}
