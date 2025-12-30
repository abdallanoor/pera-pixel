"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserDialog } from "@/components/admin/user-dialog";
import { UserTable } from "@/components/admin/user-table";
import { Loader2, UserPlus2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  username: string;
  createdAt: string;
}

interface UserFormData {
  username: string;
  password?: string;
}

interface UsersClientProps {
  initialUsers: User[];
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Sync with prop updates
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Delete confirmation
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle unauthorized
  const handleUnauthorized = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    }
    router.push("/admin/login");
    toast.error("Session expired or user not found. Please log in again.");
  };

  // Handle add user
  const handleAddUser = () => {
    setDialogOpen(true);
  };

  const handleSubmitUser = async (formData: UserFormData) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
          return;
        }
        const data = await response.json();
        throw new Error(data.error || "Failed to create user");
      }

      toast.success("User added successfully");

      router.refresh(); // Refresh server data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  };

  // Handle delete
  const handleDeleteUser = async (user: User) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${deletingUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
          return;
        }
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");

      router.refresh(); // Refresh server data
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsDeleting(false);
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage admin users with access to the dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-full" onClick={handleAddUser}>
            <UserPlus2 />
            Add User
          </Button>
        </div>
      </div>

      <UserTable users={users} onDelete={handleDeleteUser} />

      {/* User Dialog */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitUser}
        mode="add"
      />

      {/* Delete Confirmation Dialog */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Delete User</h2>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete user &quot;{deletingUser.username}
              &quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                className="rounded-full"
                variant="outline"
                onClick={() => setDeletingUser(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full"
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
