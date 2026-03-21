import { minioClient, BUCKET_NAME } from '../config/minio.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

/**
 * Upload a file buffer to MinIO.
 * @param {Buffer} fileBuffer  - File data as a Buffer (from multer memoryStorage)
 * @param {string} originalName - Original filename (used to extract extension)
 * @param {string} mimeType    - MIME type, e.g. "image/jpeg"
 * @param {string} folder      - Logical folder prefix, e.g. "products" or "banners"
 * @returns {Promise<string>}  - Public URL of the uploaded object
 */
const uploadFile = async (fileBuffer, originalName, mimeType, folder = 'uploads') => {
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  const objectName = `${folder}/${uuidv4()}${ext}`;

  await minioClient.putObject(
    BUCKET_NAME,
    objectName,
    fileBuffer,
    fileBuffer.length,
    { 'Content-Type': mimeType }
  );

  return getPublicUrl(objectName);
};

/**
 * Delete a file from MinIO by its public URL or object name.
 * Failures are logged but not thrown — deletion should not block the caller.
 * @param {string} fileUrl - Full URL or bare object name
 */
const deleteFile = async (fileUrl) => {
  try {
    const objectName = extractObjectName(fileUrl);
    if (objectName) {
      await minioClient.removeObject(BUCKET_NAME, objectName);
      console.log(`MinIO: Deleted '${objectName}'`);
    }
  } catch (error) {
    console.error('MinIO delete error:', error.message);
  }
};

/**
 * Build the public URL for a stored object.
 * Uses MINIO_PUBLIC_URL (CDN / reverse-proxy) when configured; falls back
 * to direct MinIO endpoint access.
 * @param {string} objectName
 * @returns {string}
 */
const getPublicUrl = (objectName) => {
  if (process.env.MINIO_PUBLIC_URL) {
    // Strip trailing slash to avoid double slashes in URL
    const base = process.env.MINIO_PUBLIC_URL.replace(/\/$/, '');
    return `${base}/${BUCKET_NAME}/${objectName}`;
  }

  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';

  // Warn once in production if MINIO_PUBLIC_URL is not set and endpoint is localhost.
  // This means image URLs will contain "localhost" and won't be accessible from browsers.
  if (process.env.NODE_ENV === 'production' && (endpoint === 'localhost' || endpoint === '127.0.0.1')) {
    if (!getPublicUrl._warnedOnce) {
      getPublicUrl._warnedOnce = true;
      console.error(
        '[MinIO] CRITICAL: MINIO_PUBLIC_URL is not set and MINIO_ENDPOINT is localhost. ' +
        'Product images will be saved with a localhost URL and will NOT be visible to users. ' +
        'Set MINIO_PUBLIC_URL=https://storage.inkdapper.com in backend/.env on the VPS.'
      );
    }
  }

  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  const port = process.env.MINIO_PORT || '9000';
  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${objectName}`;
};

/**
 * Generate a time-limited presigned GET URL for a private object.
 * @param {string} objectName
 * @param {number} expirySeconds - Default 1 hour
 * @returns {Promise<string>}
 */
const getPresignedUrl = async (objectName, expirySeconds = 3600) => {
  return minioClient.presignedGetObject(BUCKET_NAME, objectName, expirySeconds);
};

/**
 * Extract the object name (key) from a full MinIO URL.
 * @param {string} url
 * @returns {string|null}
 */
const extractObjectName = (url) => {
  if (!url) return null;
  if (!url.startsWith('http')) return url; // already an object name

  try {
    const urlObj = new URL(url);
    const prefix = `/${BUCKET_NAME}/`;
    const idx = urlObj.pathname.indexOf(prefix);
    if (idx !== -1) return urlObj.pathname.slice(idx + prefix.length);
    return urlObj.pathname.replace(/^\//, ''); // fallback: strip leading /
  } catch {
    return null;
  }
};

/**
 * Retrieve storage statistics for the bucket, broken down by top-level folder.
 * @returns {Promise<{bucket, totalObjects, totalSize, totalSizeMB, byFolder}>}
 */
const getStorageStats = async () => {
  let totalSize = 0;
  let totalCount = 0;
  const byFolder = {};

  return new Promise((resolve, reject) => {
    const stream = minioClient.listObjects(BUCKET_NAME, '', true);

    stream.on('data', (obj) => {
      totalSize += obj.size;
      totalCount++;
      const folder = obj.name.split('/')[0] || 'root';
      if (!byFolder[folder]) byFolder[folder] = { count: 0, size: 0 };
      byFolder[folder].count++;
      byFolder[folder].size += obj.size;
    });

    stream.on('end', () => {
      resolve({
        bucket: BUCKET_NAME,
        totalObjects: totalCount,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        byFolder,
      });
    });

    stream.on('error', reject);
  });
};

export {
  uploadFile,
  deleteFile,
  getPublicUrl,
  getPresignedUrl,
  extractObjectName,
  getStorageStats,
};
