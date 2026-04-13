import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import { getStorageStats, deleteFile, getPublicUrl } from '../services/storageService.js';
import { minioClient, BUCKET_NAME } from '../config/minio.js';

const storageRouter = express.Router();

const isConnectionError = (err) =>
  err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.message?.includes('connect');

// GET /api/storage/health
storageRouter.get('/health', adminAuth, async (_req, res) => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
    res.json({
      success: true,
      status: 'connected',
      bucket: BUCKET_NAME,
      endpoint: `${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}`,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      bucketExists,
      consoleUrl: process.env.MINIO_CONSOLE_URL || null,
    });
  } catch (error) {
    res.json({
      success: false,
      status: 'disconnected',
      minioDown: true,
      endpoint: `${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}`,
      message: isConnectionError(error)
        ? `Cannot reach MinIO at ${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || 9000}`
        : error.message,
    });
  }
});

// GET /api/storage/file?key=profile/uuid.jpg
// Public — no auth needed (bucket has public-read policy).
// Proxies the object from MinIO so the browser never needs to reach MinIO directly.
const MIME_MAP = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' };
storageRouter.get('/file', async (req, res) => {
  const { key } = req.query;
  if (!key || key.includes('..') || key.startsWith('/')) return res.status(400).end();
  try {
    const stream = await minioClient.getObject(BUCKET_NAME, key);
    const ext = key.split('.').pop().toLowerCase();
    res.setHeader('Content-Type', MIME_MAP[ext] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    stream.on('error', (err) => {
      console.error('[storage/file] stream error:', err.message);
      if (!res.headersSent) res.status(500).end();
    });
    stream.pipe(res);
  } catch (err) {
    console.error('[storage/file] error for key', key, ':', err.message);
    res.status(404).end();
  }
});

// GET /api/storage/browse?prefix=products/
// File-explorer style listing — returns virtual folders + files at the given prefix level
storageRouter.get('/browse', adminAuth, async (req, res) => {
  try {
    const prefix = req.query.prefix || '';
    const folders = [];
    const files = [];

    await new Promise((resolve, reject) => {
      // recursive=false so MinIO returns common prefixes (virtual dirs) + objects at this level
      const stream = minioClient.listObjects(BUCKET_NAME, prefix, false);

      stream.on('data', (obj) => {
        if (obj.prefix) {
          // virtual folder
          const name = obj.prefix.replace(prefix, '').replace(/\/$/, '');
          folders.push({ prefix: obj.prefix, name });
        } else {
          // actual file
          const name = obj.name.replace(prefix, '');
          files.push({
            name: obj.name,       // full object key
            displayName: name,    // just the filename portion
            size: obj.size,
            lastModified: obj.lastModified,
            url: getPublicUrl(obj.name),
          });
        }
      });

      stream.on('end', resolve);
      stream.on('error', reject);
    });

    res.json({ success: true, prefix, bucket: BUCKET_NAME, folders, files });
  } catch (error) {
    if (isConnectionError(error)) {
      return res.json({ success: false, minioDown: true, message: 'MinIO is not reachable' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/storage/stats
storageRouter.get('/stats', adminAuth, async (_req, res) => {
  try {
    const stats = await getStorageStats();
    res.json({ success: true, stats });
  } catch (error) {
    if (isConnectionError(error)) {
      return res.json({ success: false, minioDown: true, message: 'MinIO is not reachable' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/storage/delete
storageRouter.delete('/delete', adminAuth, async (req, res) => {
  try {
    const { objectName } = req.body;
    if (!objectName) {
      return res.status(400).json({ success: false, message: 'objectName is required' });
    }
    await deleteFile(objectName);
    res.json({ success: true, message: `'${objectName}' deleted successfully` });
  } catch (error) {
    if (isConnectionError(error)) {
      return res.json({ success: false, minioDown: true, message: 'MinIO is not reachable' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

export default storageRouter;
