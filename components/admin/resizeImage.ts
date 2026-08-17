"use client";

/**
 * Downscales + re-encodes an uploaded image entirely client-side before it
 * ever hits the network — this site's static export serves images unoptimized
 * (next.config.ts: images.unoptimized), so whatever gets committed here is
 * exactly what ships to visitors.
 */
export async function resizeImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.82,
): Promise<{ dataBase64: string; contentType: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas_unsupported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // JPEG has no alpha channel — canvas fills transparent pixels with opaque
  // black when flattening to it, so a transparent source (a cutout PNG/WebP)
  // must stay on a format that keeps transparency, or the "transparent"
  // background silently becomes a solid black background in the output.
  const preserveAlpha = file.type === "image/png" || file.type === "image/webp";
  const outputType = preserveAlpha ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, preserveAlpha ? undefined : quality),
  );
  if (!blob) throw new Error("encode_failed");

  const dataBase64 = await blobToBase64(blob);
  return { dataBase64, contentType: outputType };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("read_failed"));
    reader.readAsDataURL(blob);
  });
}
