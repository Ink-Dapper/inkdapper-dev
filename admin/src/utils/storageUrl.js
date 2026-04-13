/**
 * Transforms a MinIO localhost URL into a backend-proxied URL
 * so browsers can load images without needing direct MinIO access.
 *
 * URL flow:
 *   http://localhost:9000/inkdapper/products/uuid.jpg
 *   → /api/storage/file?key=products%2Fuuid.jpg  (dev, via Vite proxy)
 *   → https://api.inkdapper.com/api/storage/file?key=products%2Fuuid.jpg  (production)
 */
const BACKEND_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'https://api.inkdapper.com');

export const imageProxyUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url; // local previews pass through
  const match = url.match(/\/inkdapper\/(.+)$/);
  if (match) {
    return `${BACKEND_URL}/api/storage/file?key=${encodeURIComponent(match[1])}`;
  }
  return url; // already a valid URL (e.g. from CDN)
};
