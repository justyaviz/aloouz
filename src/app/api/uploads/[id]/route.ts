import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UploadRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: UploadRouteContext) {
  const { id } = await params;

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: {
      bytes: true,
      filename: true,
      mimeType: true,
      size: true,
    },
  });

  if (!asset) {
    return new Response("Not found", { status: 404 });
  }

  const safeFilename = asset.filename.replace(/["\\\r\n]/g, "");

  return new Response(asset.bytes, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${safeFilename}"`,
      "Content-Length": asset.size.toString(),
      "Content-Type": asset.mimeType,
    },
  });
}
