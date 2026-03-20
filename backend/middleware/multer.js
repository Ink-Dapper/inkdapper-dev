import multer from "multer";

// Use memory storage so file buffers are available for direct upload to MinIO.
// Files land on req.file.buffer / req.files[field][0].buffer.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Only image files are allowed"), false);
    }
  },
});

export default upload;