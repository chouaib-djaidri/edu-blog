"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

export function UploadImageWithDrag({
  className,
  error,
  mimeTypes = ["image/jpeg", "image/png"],
  isPending,
  onUpload,
  onDelete,
  defaultPreview,
  size = "base",
}: {
  className?: string;
  error?: string;
  mimeTypes?: string[];
  isPending?: boolean;
  onUpload?: (url: File) => void;
  onDelete?: () => void;
  defaultPreview?: string;
  size?: "base" | "sm";
}) {
  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload({
    onUpload,
    onDelete,
    defaultPreview,
  });
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const fakeEvent = {
          target: {
            files: [file],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(fakeEvent);
      }
    },
    [handleFileChange]
  );

  return (
    <div className={cn("w-full aspect-[3/2] relative", className)}>
      <Input
        type="file"
        accept={mimeTypes?.join(",")}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {!previewUrl || error ? (
        <div
          onClick={handleThumbnailClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted/75 upload",
            isDragging && "border-primary/50 bg-primary/5",
            error &&
              "bg-destructive/10 border-destructive/50 hover:bg-destructive/15"
          )}
        >
          <ImagePlus
            className={cn("size-12", { "size-10": size === "sm" })}
            strokeWidth={1}
          />
          <div className="text-center">
            <p
              className={cn("text-sm font-medium", {
                "text-xs": size === "sm",
              })}
            >
              Click to select
            </p>
            <p
              className={cn("text-xs text-muted-foreground", {
                "text-[0.625rem] leading-[1.2]": size === "sm",
              })}
            >
              or drop image here
            </p>
          </div>
        </div>
      ) : (
        <div className={cn("relative h-full w-full", !isPending && "group")}>
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-xl",
              error && "ring-2 ring-destructive"
            )}
          >
            <Image
              src={previewUrl}
              alt="Preview"
              width={600}
              height={600}
              className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 z-20">
              <Button
                type="button"
                size="icon"
                onClick={handleThumbnailClick}
                className="h-9 w-9"
              >
                <Upload className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={handleRemove}
                className="h-9 w-9"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
          {fileName && (
            <div className="text-xs absolute bottom-2 w-full transition-opacity px-2 opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2 bg-foreground/60 text-white rounded-xl px-2 py-1">
                <span className="truncate">{fileName}</span>
              </div>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="absolute bottom-0 left-0 w-full flex justify-center p-2">
          <p className="text-xs font-medium bg-destructive text-white rounded-md px-2 py-1">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
