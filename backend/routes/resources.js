import express from "express";
import Joi from "joi";
import Resource from "../model/Resource.js";
import { auth, adminAuth, teacherAuth } from "../middleware/auth.js";
import {
  validate,
  validateQuery,
  paginationSchema,
  searchSchema,
} from "../utils/validation.js";

const router = express.Router();

// Validation schemas
const createResourceSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(1000).required(),
  type: Joi.string()
    .valid(
      "braille",
      "audio",
      "video",
      "tactile",
      "sign-language",
      "text",
      "interactive"
    )
    .required(),
  category: Joi.string()
    .valid(
      "mathematics",
      "science",
      "language",
      "social-studies",
      "arts",
      "technology",
      "life-skills"
    )
    .required(),
  level: Joi.string().valid("primary", "secondary", "tertiary").required(),
  language: Joi.string().valid("en", "fr", "rw").default("en"),
  fileUrl: Joi.string().uri().required(),
  thumbnailUrl: Joi.string().uri().optional(),
  fileSize: Joi.number().min(0).optional(),
  duration: Joi.number().min(0).optional(),
  accessibilityFeatures: Joi.object({
    screenReaderCompatible: Joi.boolean().default(false),
    highContrast: Joi.boolean().default(false),
    audioDescriptions: Joi.boolean().default(false),
    signLanguage: Joi.boolean().default(false),
    brailleReady: Joi.boolean().default(false),
    tactileElements: Joi.boolean().default(false),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

const updateResourceSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  type: Joi.string()
    .valid(
      "braille",
      "audio",
      "video",
      "tactile",
      "sign-language",
      "text",
      "interactive"
    )
    .optional(),
  category: Joi.string()
    .valid(
      "mathematics",
      "science",
      "language",
      "social-studies",
      "arts",
      "technology",
      "life-skills"
    )
    .optional(),
  level: Joi.string().valid("primary", "secondary", "tertiary").optional(),
  language: Joi.string().valid("en", "fr", "rw").optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  duration: Joi.number().min(0).optional(),
  accessibilityFeatures: Joi.object({
    screenReaderCompatible: Joi.boolean(),
    highContrast: Joi.boolean(),
    audioDescriptions: Joi.boolean(),
    signLanguage: Joi.boolean(),
    brailleReady: Joi.boolean(),
    tactileElements: Joi.boolean(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional(),
});

const rateResourceSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().max(500).optional(),
});

// @route   GET /api/resources
// @desc    Get all resources with filtering and pagination
// @access  Public
router.get(
  "/",
  validateQuery(paginationSchema.concat(searchSchema)),
  async (req, res) => {
    try {
      const { page, limit, sort, order, q, category, level, language, type } =
        req.query;

      // Build filter object
      const filter = { isPublished: true };

      if (q) {
        filter.$or = [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { tags: { $in: [new RegExp(q, "i")] } },
        ];
      }

      if (category) filter.category = category;
      if (level) filter.level = level;
      if (language) filter.language = language;
      if (type) filter.type = type;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      // Execute query
      const resources = await Resource.find(filter)
        .populate("uploadedBy", "firstName lastName")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const total = await Resource.countDocuments(filter);

      // Add computed fields
      const resourcesWithStats = resources.map((resource) => ({
        ...resource,
        averageRating: resource.ratings?.length
          ? (
              resource.ratings.reduce((sum, r) => sum + r.rating, 0) /
              resource.ratings.length
            ).toFixed(1)
          : 0,
        totalRatings: resource.ratings?.length || 0,
      }));

      res.json({
        resources: resourcesWithStats,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get resources error:", error);
      res.status(500).json({
        message: "Server error while fetching resources",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Private (Teacher/Admin)
router.post(
  "/",
  teacherAuth,
  validate(createResourceSchema),
  async (req, res) => {
    try {
      const resourceData = {
        ...req.body,
        uploadedBy: req.user.id,
      };

      const resource = new Resource(resourceData);
      await resource.save();

      await resource.populate("uploadedBy", "firstName lastName");

      res.status(201).json({
        message: "Resource created successfully",
        resource: resource.toJSON(),
      });
    } catch (error) {
      console.error("Create resource error:", error);
      res.status(500).json({
        message: "Server error while creating resource",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// @route   GET /api/resources/:id
// @desc    Get single resource by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("uploadedBy", "firstName lastName profileImage")
      .populate("ratings.user", "firstName lastName profileImage");

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if resource is published or user has access
    if (
      !resource.isPublished &&
      (!req.user ||
        (req.user.role !== "admin" &&
          req.user.id !== resource.uploadedBy.toString()))
    ) {
      return res.status(403).json({ message: "Resource not available" });
    }

    // Increment download count if this is a download request
    if (req.query.download === "true") {
      resource.downloadCount += 1;
      await resource.save();
    }

    res.json({
      resource: {
        ...resource.toJSON(),
        averageRating: resource.averageRating,
        totalRatings: resource.ratings.length,
      },
    });
  } catch (error) {
    console.error("Get resource error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    res.status(500).json({
      message: "Server error while fetching resource",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   PUT /api/resources/:id
// @desc    Update resource
// @access  Private (Resource creator/Admin)
router.put("/:id", auth, validate(updateResourceSchema), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      req.user.id !== resource.uploadedBy.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this resource" });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("uploadedBy", "firstName lastName");

    res.json({
      message: "Resource updated successfully",
      resource: updatedResource.toJSON(),
    });
  } catch (error) {
    console.error("Update resource error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    res.status(500).json({
      message: "Server error while updating resource",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Private (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid resource ID" });
    }
    res.status(500).json({
      message: "Server error while deleting resource",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   POST /api/resources/:id/rate
// @desc    Rate and review a resource
// @access  Private
router.post(
  "/:id/rate",
  auth,
  validate(rateResourceSchema),
  async (req, res) => {
    try {
      const { rating, review } = req.body;

      const resource = await Resource.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // Check if user already rated
      const existingRatingIndex = resource.ratings.findIndex(
        (r) => r.user.toString() === req.user.id
      );

      if (existingRatingIndex !== -1) {
        // Update existing rating
        resource.ratings[existingRatingIndex] = {
          user: req.user.id,
          rating,
          review,
          createdAt: new Date(),
        };
      } else {
        // Add new rating
        resource.ratings.push({
          user: req.user.id,
          rating,
          review,
          createdAt: new Date(),
        });
      }

      await resource.save();

      res.json({
        message: "Rating submitted successfully",
        rating: {
          rating,
          review,
          user: {
            id: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
          },
          createdAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Rate resource error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      res.status(500).json({
        message: "Server error while rating resource",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

export default router;
