export const PRODUCT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export const PRODUCT_IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

const productImageTypeSet = new Set<string>(PRODUCT_IMAGE_ACCEPTED_TYPES);

export function buildProductImageUrl(assetId: string) {
  return `/api/uploads/${assetId}`;
}

export function isAcceptedProductImageType(mimeType: string) {
  return productImageTypeSet.has(mimeType);
}

export function resolveProductImageUrl(
  imageAssetId?: string | null,
  imageUrl?: string | null,
) {
  if (imageAssetId) {
    return buildProductImageUrl(imageAssetId);
  }

  return imageUrl ?? undefined;
}
