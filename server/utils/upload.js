/**
 * upload.js
 *
 * Custom multer storage engine that streams files directly to Cloudinary v2.
 * No extra packages needed — only uses "multer" and "cloudinary" (already installed).
 *
 * Supported file types:
 *   - Images  : jpg, jpeg, png, gif, webp  → resource_type: "image"
 *   - Videos  : mp4, webm, ogg, mov, avi   → resource_type: "video"
 *   - PDFs    : application/pdf            → resource_type: "raw"
 *
 * After middleware runs:
 *   req.file.path     → Cloudinary HTTPS secure URL
 *   req.file.filename → Cloudinary public_id
 *   req.file.size     → file size in bytes
 *
 * For multiple files (e.g. PDF attachments alongside a video):
 *   req.files.video[0].path
 *   req.files.pdf[0].path   (if using uploadVideoWithPdf.fields([...]))
 */

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const FOLDER = process.env.FOLDER_NAME || "edtech";

// ─── Core helper: buffer → Cloudinary ────────────────────────────────────────

function bufferToStream(buffer) {
  const r = new Readable();
  r.push(buffer);
  r.push(null);
  return r;
}

function uploadBufferToCloudinary(buffer, folder, resourceType, extraOptions = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, use_filename: true, unique_filename: true, ...extraOptions },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    bufferToStream(buffer).pipe(stream);
  });
}

// ─── Determine resource_type from MIME ───────────────────────────────────────

function getResourceType(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype === "application/pdf") return "raw";
  return "auto";
}

function getSubfolder(mimetype) {
  if (mimetype.startsWith("image/")) return "images";
  if (mimetype.startsWith("video/")) return "videos";
  if (mimetype === "application/pdf") return "pdfs";
  return "uploads";
}

// ─── Custom multer storage engine ────────────────────────────────────────────

function makeCloudinaryStorage(subfolder, resourceType) {
  return {
    _handleFile(req, file, cb) {
      const chunks = [];
      file.stream.on("data", (chunk) => chunks.push(chunk));
      file.stream.on("error", cb);
      file.stream.on("end", async () => {
        try {
          const buffer = Buffer.concat(chunks);
          // Allow per-file dynamic subfolder/type (pass "auto" to detect)
          const folder   = `${FOLDER}/${subfolder === "auto" ? getSubfolder(file.mimetype) : subfolder}`;
          const resType  = resourceType === "auto" ? getResourceType(file.mimetype) : resourceType;

          const isPdf = file.mimetype === "application/pdf";
          const extraOptions = isPdf ? {
            public_id: file.originalname.replace(/\.[^/.]+$/, ""),
            format: "pdf",
            pages: true,
          } : {}
          const result = await uploadBufferToCloudinary(buffer, folder, resType, extraOptions);
          cb(null, {
            path:     result.secure_url,  // ← full Cloudinary HTTPS URL
            filename: result.public_id,   // ← Cloudinary public_id (for deletion)
            size:     result.bytes,
          });
        } catch (err) {
          cb(err);
        }
      });
    },
    _removeFile(_req, _file, cb) {
      cb(null); // call cloudinary.uploader.destroy(publicId) explicitly if needed
    },
  };
}

// ─── File filters ─────────────────────────────────────────────────────────────

const imageFilter = (req, file, cb) => {
  file.mimetype.startsWith("image/")
    ? cb(null, true)
    : cb(new Error("Only image files are allowed (jpg, png, gif, webp)"), false);
};

const videoFilter = (req, file, cb) => {
  file.mimetype.startsWith("video/")
    ? cb(null, true)
    : cb(new Error("Only video files are allowed (mp4, webm, mov, avi)"), false);
};

const pdfFilter = (req, file, cb) => {
  file.mimetype === "application/pdf"
    ? cb(null, true)
    : cb(new Error("Only PDF files are allowed"), false);
};

// Accepts image + video + pdf
const anyFilter = (req, file, cb) => {
  const ok =
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/") ||
    file.mimetype === "application/pdf";
  ok ? cb(null, true) : cb(new Error(`File type not allowed: ${file.mimetype}`), false);
};

// ─── Multer instances ─────────────────────────────────────────────────────────

/** For course thumbnails & profile pictures */
const uploadImage = multer({
  storage: makeCloudinaryStorage("images", "image"),
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/** For lecture videos */
const uploadVideo = multer({
  storage: makeCloudinaryStorage("videos", "video"),
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB (Cloudinary free plan max)
});

/** For PDF resources/attachments */
const uploadPdf = multer({
  storage: makeCloudinaryStorage("pdfs", "raw"),
  fileFilter: pdfFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

/**
 * For subsection creation/edit:
 * Accepts BOTH a video ("video" field) AND a PDF ("pdf" field) in one request.
 * Usage in route: uploadVideoWithPdf.fields([{ name: "video", maxCount: 1 }, { name: "pdf", maxCount: 1 }])
 */
const uploadVideoWithPdf = multer({
  storage: makeCloudinaryStorage("auto", "auto"),
  fileFilter: anyFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Default export (auto-detect type) kept for any other routes
const upload = multer({
  storage: makeCloudinaryStorage("auto", "auto"),
  fileFilter: anyFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

module.exports = upload;
module.exports.uploadImage = uploadImage;
module.exports.uploadVideo = uploadVideo;
module.exports.uploadPdf   = uploadPdf;
module.exports.uploadVideoWithPdf = uploadVideoWithPdf;
