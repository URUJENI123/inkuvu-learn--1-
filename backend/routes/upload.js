import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { auth, teacherAuth } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File type configurations
const fileTypes = {
  image: {
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: "images",
  },
  video: {
    extensions: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"],
    maxSize: 100 * 1024 * 1024, // 100MB
    folder: "videos",
  },
  audio: {
    extensions: [".mp3", ".wav", ".ogg", ".m4a", ".aac"],
    maxSize: 20 * 1024 * 1024, // 20MB
    folder: "audio",
  },
  document: {
    extensions: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: "documents",
  },
  braille: {
    extensions: [".brf", ".brl", ".txt"],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: "braille",
  },
  tactile: {
    extensions: [".svg", ".png", ".jpg", ".pdf"],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: "tactile",
  },
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for temporary file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  const fileType = req.body.fileType || "document";
  const config = fileTypes[fileType];

  if (!config) {
    return cb(new Error("Invalid file type specified"), false);
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!config.extensions.includes(ext)) {
    return cb(
      new Error(
        `Invalid file extension. Allowed: ${config.extensions.join(", ")}`
      ),
      false
    );
  }

  cb(null, true);
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max (will be checked per file type)
  },
  fileFilter: fileFilter,
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      ...options,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Helper function to delete temporary file
const deleteTempFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting temp file:", error);
  }
};

// @route   POST /api/upload/single
// @desc    Upload a single file
// @access  Private (Teacher/Admin)
router.post("/single", teacherAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const {
      fileType = "document",
      folder = "general",
      accessibility = {},
    } = req.body;
    const config = fileTypes[fileType];

    if (!config) {
      deleteTempFile(req.file.path);
      return res.status(400).json({ message: "Invalid file type" });
    }

    // Check file size
    if (req.file.size > config.maxSize) {
      deleteTempFile(req.file.path);
      return res.status(400).json({
        message: `File too large. Maximum size for ${fileType} files is ${
          config.maxSize / (1024 * 1024)
        }MB`,
      });
    }

    // Upload to Cloudinary
    const cloudinaryOptions = {
      folder: `inkuvu-learn/${config.folder}/${folder}`,
      public_id: `${Date.now()}-${path.parse(req.file.originalname).name}`,
      resource_type:
        fileType === "video"
          ? "video"
          : fileType === "audio"
          ? "video"
          : "auto",
    };

    // Add accessibility transformations for images
    if (fileType === "image") {
      cloudinaryOptions.transformation = [
        { quality: "auto", fetch_format: "auto" },
        { width: 1200, height: 800, crop: "limit" },
      ];

      // High contrast version for accessibility
      if (accessibility.highContrast) {
        cloudinaryOptions.transformation.push({ effect: "contrast:50" });
      }
    }

    const uploadResult = await uploadToCloudinary(
      req.file.path,
      cloudinaryOptions
    );

    // Delete temporary file
    deleteTempFile(req.file.path);

    // Prepare response data
    const fileData = {
      id: uploadResult.public_id,
      url: uploadResult.secure_url,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: fileType,
      mimeType: req.file.mimetype,
      size: req.file.size,
      dimensions:
        uploadResult.width && uploadResult.height
          ? { width: uploadResult.width, height: uploadResult.height }
          : null,
      duration: uploadResult.duration || null,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
      accessibility: accessibility,
      cloudinaryData: {
        publicId: uploadResult.public_id,
        version: uploadResult.version,
        format: uploadResult.format,
      },
    };

    res.json({
      message: "File uploaded successfully",
      file: fileData,
    });
  } catch (error) {
    // Clean up temp file on error
    if (req.file) {
      deleteTempFile(req.file.path);
    }

    console.error("Upload error:", error);
    res.status(500).json({
      message: "File upload failed",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Upload error",
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private (Teacher/Admin)
router.post(
  "/multiple",
  teacherAuth,
  upload.array("files", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const {
        fileType = "document",
        folder = "general",
        accessibility = {},
      } = req.body;
      const config = fileTypes[fileType];

      if (!config) {
        // Clean up temp files
        req.files.forEach((file) => deleteTempFile(file.path));
        return res.status(400).json({ message: "Invalid file type" });
      }

      const uploadPromises = req.files.map(async (file) => {
        try {
          // Check file size
          if (file.size > config.maxSize) {
            deleteTempFile(file.path);
            throw new Error(`File ${file.originalname} is too large`);
          }

          // Upload to Cloudinary
          const cloudinaryOptions = {
            folder: `inkuvu-learn/${config.folder}/${folder}`,
            public_id: `${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}-${path.parse(file.originalname).name}`,
            resource_type:
              fileType === "video"
                ? "video"
                : fileType === "audio"
                ? "video"
                : "auto",
          };

          const uploadResult = await uploadToCloudinary(
            file.path,
            cloudinaryOptions
          );

          // Delete temporary file
          deleteTempFile(file.path);

          return {
            id: uploadResult.public_id,
            url: uploadResult.secure_url,
            originalName: file.originalname,
            fileName: file.filename,
            fileType: fileType,
            mimeType: file.mimetype,
            size: file.size,
            dimensions:
              uploadResult.width && uploadResult.height
                ? { width: uploadResult.width, height: uploadResult.height }
                : null,
            duration: uploadResult.duration || null,
            uploadedBy: req.user.id,
            uploadedAt: new Date(),
            accessibility: accessibility,
            cloudinaryData: {
              publicId: uploadResult.public_id,
              version: uploadResult.version,
              format: uploadResult.format,
            },
          };
        } catch (error) {
          deleteTempFile(file.path);
          throw error;
        }
      });

      const uploadResults = await Promise.allSettled(uploadPromises);

      const successful = [];
      const failed = [];

      uploadResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successful.push(result.value);
        } else {
          failed.push({
            fileName: req.files[index].originalname,
            error: result.reason.message,
          });
        }
      });

      res.json({
        message: `${successful.length} files uploaded successfully${
          failed.length > 0 ? `, ${failed.length} failed` : ""
        }`,
        successful,
        failed,
        totalUploaded: successful.length,
        totalFailed: failed.length,
      });
    } catch (error) {
      // Clean up temp files on error
      if (req.files) {
        req.files.forEach((file) => deleteTempFile(file.path));
      }

      console.error("Multiple upload error:", error);
      res.status(500).json({
        message: "Multiple file upload failed",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Upload error",
      });
    }
  }
);

// @route   DELETE /api/upload/:publicId
// @desc    Delete a file from Cloudinary
// @access  Private (Admin or file owner)
router.delete("/:publicId", auth, async (req, res) => {
  try {
    const { publicId } = req.params;

    // In a real application, you'd check if the user owns this file or is an admin
    // For now, we'll allow any authenticated user to delete

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({
        message: "File deleted successfully",
        publicId: publicId,
      });
    } else {
      res.status(404).json({
        message: "File not found or already deleted",
      });
    }
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      message: "Failed to delete file",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Delete error",
    });
  }
});

// @route   GET /api/upload/signed-url
// @desc    Get signed URL for direct upload to Cloudinary
// @access  Private (Teacher/Admin)
router.get("/signed-url", teacherAuth, async (req, res) => {
  try {
    const { fileType = "document", folder = "general" } = req.query;
    const config = fileTypes[fileType];

    if (!config) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp: timestamp,
      folder: `inkuvu-learn/${config.folder}/${folder}`,
      resource_type:
        fileType === "video"
          ? "video"
          : fileType === "audio"
          ? "video"
          : "auto",
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: params.folder,
      resourceType: params.resource_type,
    });
  } catch (error) {
    console.error("Signed URL error:", error);
    res.status(500).json({
      message: "Failed to generate signed URL",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Signed URL error",
    });
  }
});

// @route   POST /api/upload/profile-image
// @desc    Upload profile image
// @access  Private
router.post(
  "/profile-image",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      // Validate image file
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        deleteTempFile(req.file.path);
        return res
          .status(400)
          .json({
            message: "Invalid image format. Allowed: JPEG, PNG, GIF, WebP",
          });
      }

      // Check file size (2MB max for profile images)
      if (req.file.size > 2 * 1024 * 1024) {
        deleteTempFile(req.file.path);
        return res
          .status(400)
          .json({ message: "Image too large. Maximum size is 2MB" });
      }

      // Upload to Cloudinary with transformations
      const uploadResult = await uploadToCloudinary(req.file.path, {
        folder: "inkuvu-learn/profiles",
        public_id: `profile-${req.user.id}-${Date.now()}`,
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });

      // Delete temporary file
      deleteTempFile(req.file.path);

      // Update user profile image in database
      const { default: User } = await import("../models/User.js");
      await User.findByIdAndUpdate(req.user.id, {
        profileImage: uploadResult.secure_url,
      });

      res.json({
        message: "Profile image uploaded successfully",
        profileImage: uploadResult.secure_url,
        cloudinaryData: {
          publicId: uploadResult.public_id,
          version: uploadResult.version,
        },
      });
    } catch (error) {
      // Clean up temp file on error
      if (req.file) {
        deleteTempFile(req.file.path);
      }

      console.error("Profile image upload error:", error);
      res.status(500).json({
        message: "Profile image upload failed",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Upload error",
      });
    }
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large" });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files" });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field" });
    }
  }

  if (error.message.includes("Invalid file")) {
    return res.status(400).json({ message: error.message });
  }

  res.status(500).json({
    message: "Upload error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
  });
});

export default router;
