/**
 * Normalize a MinIO storage URL.
 *
 * During early development, images were saved with localhost:9000 as the base,
 * e.g. http://localhost:9000/inkdapper/products/...
 * These URLs are inaccessible from browsers in production.
 *
 * This utility rewrites such URLs to the public storage domain so that both
 * newly-uploaded images and any legacy database records display correctly.
 */
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL?.replace(/\/$/, '');

export const storageUrl = (url) => {
  if (!url) return url;
  if (STORAGE_URL) {
    // Replace any http(s)://localhost:<port>/ prefix with the public storage domain
    return url.replace(/^https?:\/\/localhost:\d+\//, `${STORAGE_URL}/`);
  }
  return url;
};
