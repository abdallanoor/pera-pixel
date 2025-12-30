"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoDialog } from "@/components/admin/video-dialog";
import { VideoTable } from "@/components/admin/video-table";
import { Save, Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Video {
  _id: string;
  title: string;
  vimeoUrl: string;
  category: "horizontal" | "vertical";
  order: number;
}

interface VideoFormData {
  title: string;
  vimeoUrl: string;
  category: "horizontal" | "vertical";
}

interface VideosClientProps {
  initialVideos: Video[];
}

export function VideosClient({ initialVideos }: VideosClientProps) {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [activeTab, setActiveTab] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  // Sync state with props if they change (e.g. after server re-render)
  useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Reorder state
  const [pendingReorder, setPendingReorder] = useState<Video[] | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Delete confirmation
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter videos by category, taking pending reorder into account
  const filteredVideos = (pendingReorder || videos).filter(
    (v) => v.category === activeTab
  );

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

  // Handle add/edit video
  const handleAddVideo = () => {
    setEditingVideo(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleSubmitVideo = async (formData: VideoFormData) => {
    try {
      if (dialogMode === "add") {
        const response = await fetch("/api/admin/videos", {
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
          throw new Error(data.error || "Failed to create video");
        }

        const data = await response.json();
        // Optimistic update: Add new video to state
        setVideos((prev) => [...prev, data.video]);

        toast.success("Video added successfully");
      } else if (editingVideo) {
        const response = await fetch(`/api/admin/videos/${editingVideo._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          if (response.status === 401) {
            await handleUnauthorized();
            return;
          }
          const data = await response.json();
          throw new Error(data.error || "Failed to update video");
        }

        // Optimistic update using formData immediately
        setVideos((prev) =>
          prev.map((v) =>
            v._id === editingVideo._id ? { ...v, ...formData } : v
          )
        );

        toast.success("Video updated successfully");
      }

      setPendingReorder(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  };

  // Handle delete
  const handleDeleteVideo = async (video: Video) => {
    setDeletingVideo(video);
  };

  const confirmDelete = async () => {
    if (!deletingVideo) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/videos/${deletingVideo._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
          return;
        }
        const data = await response.json();
        throw new Error(data.error || "Failed to delete video");
      }

      // Optimistic update
      setVideos((prev) => prev.filter((v) => v._id !== deletingVideo._id));

      toast.success("Video deleted successfully");
      setPendingReorder(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete video"
      );
    } finally {
      setIsDeleting(false);
      setDeletingVideo(null);
    }
  };

  // Helper to check if order has changed
  const isOrderChanged = (newOrder: Video[]) => {
    const currentVideos = videos.filter((v) => v.category === activeTab);
    if (newOrder.length !== currentVideos.length) return true;

    for (let i = 0; i < newOrder.length; i++) {
      if (newOrder[i]._id !== currentVideos[i]._id) return true;
    }
    return false;
  };

  // Handle reorder
  const handleReorder = (reorderedVideos: Video[]) => {
    if (isOrderChanged(reorderedVideos)) {
      setPendingReorder(reorderedVideos);
    } else {
      setPendingReorder(null);
    }
  };

  const saveOrder = async () => {
    if (!pendingReorder) return;

    setIsSavingOrder(true);
    try {
      const response = await fetch("/api/admin/videos/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videos: pendingReorder.map((v) => ({ id: v._id, order: v.order })),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          await handleUnauthorized();
          return;
        }
        throw new Error("Failed to save order");
      }

      // Optimistic update already happened via pendingReorder, but sync final state
      // Actually, we should wait for router.refresh to sync back the source of truth
      // But we can update local state to reflect 'committed' order
      setVideos((prev) => {
        const updated = [...prev];
        pendingReorder.forEach((reordered) => {
          const index = updated.findIndex((v) => v._id === reordered._id);
          if (index !== -1) {
            updated[index] = { ...updated[index], order: reordered.order };
          }
        });
        return updated.sort((a, b) => a.order - b.order);
      });

      toast.success("Order saved successfully");
      router.refresh();
      setPendingReorder(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save order"
      );
    } finally {
      setIsSavingOrder(false);
    }
  };

  const cancelReorder = () => {
    setPendingReorder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Portfolio Videos
          </h1>
          <p className="text-muted-foreground">
            Manage your portfolio videos. Drag to reorder.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          {pendingReorder && (
            <>
              <Button
                variant="outline"
                onClick={cancelReorder}
                disabled={isSavingOrder}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                className="rounded-full"
                onClick={saveOrder}
                disabled={isSavingOrder}
              >
                {isSavingOrder ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save />
                    Save Order
                  </>
                )}
              </Button>
            </>
          )}
          <Button className="rounded-full" onClick={handleAddVideo}>
            <PlusCircle />
            Add Video
          </Button>
        </div>
      </div>

      {/* Tabs for category */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "horizontal" | "vertical")}
      >
        <TabsList>
          <TabsTrigger value="horizontal">
            Horizontal (
            {videos.filter((v) => v.category === "horizontal").length})
          </TabsTrigger>
          <TabsTrigger value="vertical">
            Vertical ({videos.filter((v) => v.category === "vertical").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="horizontal" className="mt-4">
          <VideoTable
            videos={filteredVideos}
            onReorder={handleReorder}
            onEdit={handleEditVideo}
            onDelete={handleDeleteVideo}
          />
        </TabsContent>

        <TabsContent value="vertical" className="mt-4">
          <VideoTable
            videos={filteredVideos}
            onReorder={handleReorder}
            onEdit={handleEditVideo}
            onDelete={handleDeleteVideo}
          />
        </TabsContent>
      </Tabs>

      {/* Video Dialog */}
      <VideoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitVideo}
        initialData={
          editingVideo
            ? {
                title: editingVideo.title,
                vimeoUrl: editingVideo.vimeoUrl,
                category: editingVideo.category,
              }
            : undefined
        }
        mode={dialogMode}
      />

      {/* Delete Confirmation Dialog */}
      {deletingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Delete Video</h2>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete &quot;{deletingVideo.title}&quot;?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                className="rounded-full"
                variant="outline"
                onClick={() => setDeletingVideo(null)}
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
