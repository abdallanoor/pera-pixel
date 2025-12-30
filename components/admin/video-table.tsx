"use client";

import { useState, useEffect, useId } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface Video {
  _id: string;
  title: string;
  vimeoUrl: string;
  category: "horizontal" | "vertical";
  order: number;
}

interface VideoTableProps {
  videos: Video[];
  onReorder: (videos: Video[]) => void;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
}

function SortableRow({
  video,
  onEdit,
  onDelete,
}: {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (video: Video) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[50px]">
        <button
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-muted rounded-full"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} className="text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{video.title}</TableCell>
      <TableCell>
        <a
          href={video.vimeoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline truncate max-w-[300px] block"
        >
          {video.vimeoUrl}
        </a>
      </TableCell>
      <TableCell>
        <Badge
          className="capitalize"
          variant={video.category === "horizontal" ? "default" : "secondary"}
        >
          {video.category}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal size={18} />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(video)}>
              <Pencil size={16} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(video)}
              variant="destructive"
            >
              <Trash2 size={16} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function VideoTable({
  videos,
  onReorder,
  onEdit,
  onDelete,
}: VideoTableProps) {
  const [items, setItems] = useState(videos);
  const id = useId();

  useEffect(() => {
    setItems(videos);
  }, [videos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((v) => v._id === active.id);
      const newIndex = items.findIndex((v) => v._id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setItems(newItems);
      onReorder(newItems);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No videos found. Add your first video to get started.
      </div>
    );
  }

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Vimeo URL</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={items.map((v) => v._id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((video) => (
                <SortableRow
                  key={video._id}
                  video={video}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </div>
    </DndContext>
  );
}
