import { Input } from "@/components/ui/input";
import { useImageUpload } from "@/hooks/use-image-upload";
import { cn } from "@/lib/utils";
import { Trash, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

export function UploadAvatarWithDrag({
  className,
  error,
  mimeTypes = ["image/jpeg", "image/png"],
  isPending,
  onUpload,
  onDelete,
  defaultPreview,
  fallBack = "U",
}: {
  className?: string;
  error?: string;
  mimeTypes?: string[];
  isPending?: boolean;
  onUpload?: (url: File) => void;
  onDelete?: () => void;
  defaultPreview?: string;
  size?: "base" | "sm";
  fallBack?: string;
}) {
  const {
    previewUrl,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload({
    onUpload,
    onDelete,
    defaultPreview,
  });
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

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
    <div className={cn("w-full aspect-square relative bg-muted", className)}>
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
            "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-full bg-foreground text-background text-3xl font-normal transition-colors upload uppercase relative",
            error && "ring-2 ring-red-600"
          )}
        >
          <div
            className={
              "size-7 rounded-full bg-foreground border-3 border-background absolute -end-1 -bottom-1 flex justify-center items-center"
            }
          >
            <Upload className="size-3" strokeWidth={2.5} />
          </div>
          {fallBack}
        </div>
      ) : (
        <div className={cn("relative h-full w-full", !isPending && "group")}>
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-full bg-muted",
              error && "ring-2 ring-destructive"
            )}
          >
            <Image
              src={previewUrl}
              alt="Preview"
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 z-20">
            <div
              className={
                "size-7 rounded-full bg-foreground border-3 border-background absolute -end-1 -bottom-1 flex justify-center items-center text-white"
              }
              onClick={handleThumbnailClick}
            >
              <Upload className="size-3" strokeWidth={2.5} />
            </div>
            <div
              className={
                "size-7 rounded-full bg-foreground text-white border-3 border-background absolute -start-1 -bottom-1 flex justify-center items-center"
              }
              onClick={handleRemove}
            >
              <Trash className="size-3" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
