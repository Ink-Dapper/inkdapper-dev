/**
 * All MinIO image URLs are served through the Express backend proxy
 * (/api/storage/file?key=…) so the browser never needs direct MinIO access.
 *
 * URL flow:
 *   http://localhost:9000/inkdapper/products/uuid.jpg
 *   → /api/storage/file?key=products%2Fuuid.jpg          (dev, via Vite proxy)
 *   → https://api.inkdapper.com/api/storage/file?key=…   (production)
 *
 * This is more reliable than a storage.inkdapper.com reverse proxy because
 * the backend can always reach MinIO at localhost:9000 internally.
 */
// In dev, use '' so requests go to /api/... and are proxied by Vite → localhost:4000.
// In production, use the full API domain.
const BACKEND_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'https://api.inkdapper.com');

/**
 * Extract the MinIO object key from any stored URL and return a
 * backend-proxied URL. Passes through data: and blob: URLs unchanged.
 */
const extractKeyAndProxy = (url) => {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  // Matches http://localhost:9000/inkdapper/key  OR  https://storage.inkdapper.com/inkdapper/key
  const match = url.match(/\/inkdapper\/(.+)$/);
  if (match) {
    return `${BACKEND_URL}/api/storage/file?key=${encodeURIComponent(match[1])}`;
  }
  return url; // already a plain external URL — use as-is
};

/** Used for all product / banner / general MinIO images. */
export const storageUrl = extractKeyAndProxy;

/** Used for avatar / profile images (same proxy, kept as separate export for clarity). */
export const avatarProxyUrl = extractKeyAndProxy;
