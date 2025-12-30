"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";

interface VideoFormData {
  title: string;
  vimeoUrl: string;
  category: "horizontal" | "vertical";
}

interface VideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VideoFormData) => Promise<void>;
  initialData?: VideoFormData;
  mode: "add" | "edit";
}

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

export function VideoDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: VideoDialogProps) {
  const [formData, setFormData] = useState<VideoFormData>(
    initialData || { title: "", vimeoUrl: "", category: "horizontal" }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Sync form data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({ title: "", vimeoUrl: "", category: "horizontal" });
      }
      setErrors({});
    }
  }, [open, initialData]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const result = videoSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
      handleOpenChange(false);
    } catch {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Video" : "Edit Video"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new video to your portfolio."
              : "Update the video details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Video title"
              value={formData.title}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vimeoUrl">Vimeo URL</Label>
            <Input
              id="vimeoUrl"
              name="vimeoUrl"
              placeholder="https://player.vimeo.com/video/..."
              value={formData.vimeoUrl}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.vimeoUrl && (
              <p className="text-sm text-destructive">{errors.vimeoUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <NativeSelect
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isLoading}
              className="h-11"
            >
              <NativeSelectOption value="horizontal" className="bg-background">
                Horizontal
              </NativeSelectOption>
              <NativeSelectOption value="vertical" className="bg-background">
                Vertical
              </NativeSelectOption>
            </NativeSelect>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button className="rounded-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : mode === "add" ? (
                "Add Video"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
