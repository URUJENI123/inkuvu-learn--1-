import path from "path";
import fs from "fs";

// File validation utilities
const validateFileType = (filename, allowedExtensions) => {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
};

const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

// Generate accessibility metadata for files
const generateAccessibilityMetadata = (
  fileType,
  originalName,
  accessibility = {}
) => {
  const metadata = {
    screenReaderCompatible: false,
    hasAltText: false,
    hasTranscript: false,
    hasClosedCaptions: false,
    isBrailleReady: false,
    hasAudioDescription: false,
    isHighContrast: false,
    ...accessibility,
  };

  // Set defaults based on file type
  switch (fileType) {
    case "braille":
      metadata.screenReaderCompatible = true;
      metadata.isBrailleReady = true;
      break;
    case "audio":
      metadata.hasTranscript = accessibility.hasTranscript || false;
      break;
    case "video":
      metadata.hasClosedCaptions = accessibility.hasClosedCaptions || false;
      metadata.hasAudioDescription = accessibility.hasAudioDescription || false;
      break;
    case "image":
      metadata.hasAltText = accessibility.hasAltText || false;
      metadata.isHighContrast = accessibility.isHighContrast || false;
      break;
    case "document":
      metadata.screenReaderCompatible = true;
      break;
  }

  return metadata;
};

// Create file thumbnail based on type
const getFileThumbnail = (fileType, url) => {
  const thumbnails = {
    pdf: "/icons/pdf-icon.png",
    doc: "/icons/doc-icon.png",
    docx: "/icons/doc-icon.png",
    txt: "/icons/txt-icon.png",
    mp3: "/icons/audio-icon.png",
    wav: "/icons/audio-icon.png",
    mp4: "/icons/video-icon.png",
    avi: "/icons/video-icon.png",
    brf: "/icons/braille-icon.png",
    brl: "/icons/braille-icon.png",
  };

  const ext = path.extname(url).toLowerCase().substring(1);
  return thumbnails[ext] || "/icons/file-icon.png";
};

// Generate file metadata
const generateFileMetadata = (file, uploadResult, accessibility = {}) => {
  return {
    id: uploadResult.public_id,
    originalName: file.originalname,
    fileName: file.filename,
    url: uploadResult.secure_url,
    thumbnailUrl:
      uploadResult.eager?.[0]?.secure_url ||
      getFileThumbnail(file.mimetype, file.originalname),
    fileType: getFileTypeFromMime(file.mimetype),
    mimeType: file.mimetype,
    size: file.size,
    formattedSize: formatFileSize(file.size),
    dimensions:
      uploadResult.width && uploadResult.height
        ? { width: uploadResult.width, height: uploadResult.height }
        : null,
    duration: uploadResult.duration || null,
    accessibility: generateAccessibilityMetadata(
      getFileTypeFromMime(file.mimetype),
      file.originalname,
      accessibility
    ),
    cloudinary: {
      publicId: uploadResult.public_id,
      version: uploadResult.version,
      format: uploadResult.format,
      resourceType: uploadResult.resource_type,
    },
    uploadedAt: new Date(),
  };
};

// Get file type from MIME type
const getFileTypeFromMime = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf") return "document";
  if (mimeType.includes("document") || mimeType.includes("text"))
    return "document";
  return "document";
};

// Clean up temporary files
const cleanupTempFiles = (files) => {
  if (!Array.isArray(files)) {
    files = [files];
  }

  files.forEach((file) => {
    if (file && file.path) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (error) {
        console.error("Error cleaning up temp file:", error);
      }
    }
  });
};

export default {
  validateFileType,
  getFileSize,
  formatFileSize,
  generateAccessibilityMetadata,
  getFileThumbnail,
  generateFileMetadata,
  getFileTypeFromMime,
  cleanupTempFiles,
};
