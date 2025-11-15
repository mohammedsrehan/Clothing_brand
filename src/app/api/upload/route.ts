import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadImage = (file: File) =>
      new Promise<string>((resolve, reject) => {
        file.arrayBuffer().then((buffer) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
              transformation: [
                { quality: "auto", fetch_format: "auto" }, // compression
                { width: 1500, crop: "limit" }, // prevent massive images
              ],
            },
            (error, result) => {
              if (error || !result) {
                console.error("Cloudinary Upload Error:", error);
                return reject("Cloudinary upload failed");
              }
              resolve(result.secure_url);
            }
          );

          uploadStream.end(Buffer.from(buffer));
        });
      });

    let imageUrls = [];

    try {
      imageUrls = await Promise.all(files.map(uploadImage));
    } catch (uploadErr) {
      console.error("One or more uploads failed:", uploadErr);
      return NextResponse.json(
        { error: "One or more images failed to upload" },
        { status: 500 }
      );
    }

    return NextResponse.json({ urls: imageUrls }, { status: 200 });
  } catch (err) {
    console.error("Unexpected Upload Error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}