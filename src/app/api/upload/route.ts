import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'products' }, // Optional: organize your files in a specific folder
          (error, result) => {
            if (error) {
              reject(error);
              console.log(error);
                return;
            }
            resolve(result?.secure_url);
          }
        ).end(buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    return NextResponse.json({ urls: imageUrls }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}