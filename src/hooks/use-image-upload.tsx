"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  defaultPreview?: string;
}

export function useImageUpload({
  onUpload,
  onDelete,
  defaultPreview,
}: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultPreview || null
  );
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (defaultPreview !== previewUrl) {
      setPreviewUrl(defaultPreview || null);
    }
  }, [defaultPreview, previewUrl]);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setFileName(selectedFile.name);
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        previewRef.current = url;
        onUpload?.(selectedFile);
      }
    },
    [onUpload]
  );

  const handleRemove = useCallback(() => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    onDelete?.();
    previewRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onDelete, previewUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current && previewRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  return {
    previewUrl,
    setPreviewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  };
}
