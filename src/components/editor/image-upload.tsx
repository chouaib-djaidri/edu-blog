import { createImageUpload } from "novel";
import { toast } from "sonner";
import WrongSonner from "../sonners/wrong-sonner";

export const createNovelImageUpload = () => {
  const onUpload = (file: File) => {
    const promise = fetch("/api/upload-image", {
      method: "POST",
      headers: {
        "content-type": file?.type || "application/octet-stream",
        "x-vercel-filename": file?.name,
        "x-folder-path": "blog-covers",
      },
      body: file,
    });

    return new Promise((resolve, reject) => {
      toast.promise(
        promise
          .then(async (res) => {
            if (res.status === 200) {
              const { url } = (await res.json()) as { url: string };
              const image = new Image();
              image.src = url;
              image.onload = () => {
                resolve(url);
              };
              image.onerror = () => {
                resolve(url);
              };
            } else {
              const errorData = await res.json();
              throw new Error(errorData.error || "Error uploading image");
            }
          })
          .catch((error) => {
            throw error;
          }),
        {
          loading: "Uploading image...",
          success: "Image uploaded successfully.",
          error: (e) => {
            reject(e);
            return e.message || "Failed to upload image";
          },
        }
      );
    });
  };
  return createImageUpload({
    onUpload,
    validateFn: (file) => {
      if (!file.type.includes("image/")) {
        toast.custom((id) => (
          <WrongSonner id={id} title={"File type not supported."} />
        ));
        return false;
      }
      if (file.size / 1024 / 1024 > 20) {
        toast.custom((id) => (
          <WrongSonner id={id} title={"File size too big (max 20MB)."} />
        ));
        return false;
      }
      return true;
    },
  });
};

export const uploadFn = createNovelImageUpload();
