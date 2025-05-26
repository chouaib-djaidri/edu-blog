import { handleUploadFile } from "@/lib/bunny/upload-file";
import { getBunnyUrl } from "@/lib/paths";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const file = await request.blob();
    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "No file provided or empty file" },
        { status: 400 }
      );
    }
    const fileName = request.headers.get("x-vercel-filename") || "image.png";
    const folderPath = request.headers.get("x-folder-path") || "images";
    const fileObj = new File([file], fileName, {
      type: request.headers.get("content-type") || "application/octet-stream",
    });
    const result = await handleUploadFile(fileObj, folderPath);
    if (!result) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }
    const cdnUrl = getBunnyUrl(`${folderPath}/${result}`);
    return NextResponse.json({ url: cdnUrl }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
