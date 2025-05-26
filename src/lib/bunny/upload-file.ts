"use server";
import "server-only";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (path: string, file: Buffer) => {
  try {
    const uploadFileUrl = new URL(
      `/${process.env.BUNNYCDN_STORAGE_ZONE}/${path}`,
      `https://${process.env.BUNNY_STORAGE_API_HOST}`
    );
    const response = await fetch(uploadFileUrl, {
      method: "PUT",
      headers: {
        AccessKey: process.env.BUNNYCDN_API_KEY!,
        "Content-Type": "application/octet-stream",
      },
      body: file,
      cache: "no-store",
      next: { revalidate: 0 },
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const handleUploadFile = async (
  file: File,
  path: string
): Promise<string | false> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extension = "";
    if (file.name && file.name.includes(".")) {
      extension = file.name.split(".").pop()?.toLowerCase() || "";
    } else {
      return false;
    }
    const filename = `${uuidv4()}.${extension}`;
    const fullPath = `${path}/${filename}`;
    const isUploaded = await uploadFile(fullPath, buffer);
    return isUploaded ? filename : false;
  } catch {
    return false;
  }
};
