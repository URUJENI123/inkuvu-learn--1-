import express from "express";
import Joi from "joi";
import Course from "../model/Course.js";
import User from "../model/User.js";
import { auth, adminAuth, teacherAuth } from "../middleware/auth.js";
import {
  validate,
  validateQuery,
  paginationSchema,
  searchSchema,
} from "../utils/validation.js";

const router = express.Router();

// Validation schemas
const createCourseSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
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
  level: Joi.string().valid("beginner", "intermediate", "advanced").required(),
  language: Joi.string().valid("en", "fr", "rw").default("en"),
  thumbnailUrl: Joi.string().uri().optional(),
  accessibilityFeatures: Joi.object({
    audioDescriptions: Joi.boolean().default(false),
    signLanguage: Joi.boolean().default(false),
    brailleSupport: Joi.boolean().default(false),
    tactileDiagrams: Joi.boolean().default(false),
    closedCaptions: Joi.boolean().default(false),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().min(10).max(2000).optional(),
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
  level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  language: Joi.string().valid("en", "fr", "rw").optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  accessibilityFeatures: Joi.object({
    audioDescriptions: Joi.boolean(),
    signLanguage: Joi.boolean(),
    brailleSupport: Joi.boolean(),
    tactileDiagrams: Joi.boolean(),
    closedCaptions: Joi.boolean(),
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional(),
});

const addLessonSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1000).optional(),
  videoUrl: Joi.string().uri().optional(),
  duration: Joi.number().min(1).optional(),
  resources: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        url: Joi.string().uri().required(),
        type: Joi.string()
          .valid("pdf", "audio", "braille", "tactile", "sign-language")
          .required(),
      })
    )
    .optional(),
  quiz: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).min(2).max(6).required(),
        correctAnswer: Joi.number().min(0).required(),
        explanation: Joi.string().optional(),
      })
    )
    .optional(),
  order: Joi.number().min(1).required(),
});

const ratingSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().max(500).optional(),
});

// @route   GET /api/courses
// @desc    Get all courses with filtering and pagination
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

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      // Execute query
      const courses = await Course.find(filter)
        .populate("instructor", "firstName lastName profileImage")
        .populate("createdBy", "firstName lastName")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const total = await Course.countDocuments(filter);

      // Add computed fields
      const coursesWithStats = courses.map((course) => ({
        ...course,
        totalEnrolled: course.enrolledStudents?.length || 0,
        averageRating: course.ratings?.length
          ? (
              course.ratings.reduce((sum, r) => sum + r.rating, 0) /
              course.ratings.length
            ).toFixed(1)
          : 0,
        totalLessons: course.lessons?.length || 0,
      }));

      res.json({
        courses: coursesWithStats,
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
      console.error("Get courses error:", error);
      res.status(500).json({
        message: "Server error while fetching courses",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "firstName lastName profileImage bio")
      .populate("createdBy", "firstName lastName")
      .populate("ratings.user", "firstName lastName profileImage");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if course is published or user has access
    if (
      !course.isPublished &&
      (!req.user ||
        (req.user.role !== "admin" &&
          req.user.id !== course.createdBy.toString()))
    ) {
      return res.status(403).json({ message: "Course not available" });
    }

    res.json({
      course: {
        ...course.toJSON(),
        totalEnrolled: course.enrolledStudents.length,
        averageRating: course.averageRating,
        totalLessons: course.lessons.length,
      },
    });
  } catch (error) {
    console.error("Get course error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({
      message: "Server error while fetching course",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Teacher/Admin)
router.post(
  "/",
  teacherAuth,
  validate(createCourseSchema),
  async (req, res) => {
    try {
      const courseData = {
        ...req.body,
        instructor: req.user.id,
        createdBy: req.user.id,
      };

      const course = new Course(courseData);
      await course.save();

      await course.populate("instructor", "firstName lastName profileImage");

      res.status(201).json({
        message: "Course created successfully",
        course: course.toJSON(),
      });
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({
        message: "Server error while creating course",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Course creator/Admin)
router.put("/:id", auth, validate(updateCourseSchema), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check permissions
    if (
      req.user.role !== "admin" &&
      req.user.id !== course.createdBy.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this course" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("instructor", "firstName lastName profileImage");

    res.json({
      message: "Course updated successfully",
      course: updatedCourse.toJSON(),
    });
  } catch (error) {
    console.error("Update course error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({
      message: "Server error while updating course",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({
      message: "Server error while deleting course",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.isPublished) {
      return res
        .status(400)
        .json({ message: "Course is not available for enrollment" });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.some(
      (enrollment) => enrollment.student.toString() === req.user.id
    );

    if (alreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Add enrollment
    course.enrolledStudents.push({
      student: req.user.id,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: [],
    });

    await course.save();

    // Add to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { coursesEnrolled: course._id },
    });

    res.json({
      message: "Successfully enrolled in course",
      enrollment: {
        courseId: course._id,
        courseTitle: course.title,
        enrolledAt: new Date(),
        progress: 0,
      },
    });
  } catch (error) {
    console.error("Enroll course error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({
      message: "Server error while enrolling in course",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   PUT /api/courses/:id/progress
// @desc    Update course progress
// @access  Private
router.put("/:id/progress", auth, async (req, res) => {
  try {
    const { lessonIndex, completed } = req.body;

    if (typeof lessonIndex !== "number" || typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid progress data" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find user's enrollment
    const enrollment = course.enrolledStudents.find(
      (e) => e.student.toString() === req.user.id
    );

    if (!enrollment) {
      return res.status(400).json({ message: "Not enrolled in this course" });
    }

    // Update completed lessons
    if (completed && !enrollment.completedLessons.includes(lessonIndex)) {
      enrollment.completedLessons.push(lessonIndex);
    } else if (
      !completed &&
      enrollment.completedLessons.includes(lessonIndex)
    ) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (l) => l !== lessonIndex
      );
    }

    // Calculate progress percentage
    const totalLessons = course.lessons.length;
    enrollment.progress =
      totalLessons > 0
        ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
        : 0;

    await course.save();

    // If course is completed, add to user's completed courses
    if (enrollment.progress === 100) {
      const user = await User.findById(req.user.id);
      const alreadyCompleted = user.coursesCompleted.some(
        (c) => c.courseId.toString() === course._id.toString()
      );

      if (!alreadyCompleted) {
        user.coursesCompleted.push({
          courseId: course._id,
          completedAt: new Date(),
          score: 100, // You might want to calculate this based on quiz scores
        });

        // Add achievement
        user.achievements.push({
          title: "Course Completed",
          description: `Completed ${course.title}`,
          earnedAt: new Date(),
          icon: "graduation-cap",
        });

        await user.save();
      }
    }

    res.json({
      message: "Progress updated successfully",
      progress: {
        courseId: course._id,
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        isCompleted: enrollment.progress === 100,
      },
    });
  } catch (error) {
    console.error("Update progress error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({
      message: "Server error while updating progress",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   POST /api/courses/:id/rate
// @desc    Rate and review a course
// @access  Private
router.post("/:id/rate", auth, validate(ratingSchema), async (req, res) => {
  try {
    const { rating, review } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is enrolled
    const isEnrolled = course.enrolledStudents.some(
      (e) => e.student.toString() === req.user.id
    );

    if (!isEnrolled) {
      return res
        .status(400)
        .json({ message: "Must be enrolled to rate this course" });
    }

    // Check if user already rated
    const existingRatingIndex = course.ratings.findIndex(
      (r) => r.user.toString() === req.user.id
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      course.ratings[existingRatingIndex] = {
        user: req.user.id,
        rating,
        review,
        createdAt: new Date(),
      };
    } else {
      // Add new rating
      course.ratings.push({
        user: req.user.id,
        rating,
        review,
        createdAt: new Date(),
      });
    }

    await course.save();

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
    console.error("Rate course error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({
      message: "Server error while rating course",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   POST /api/courses/:id/lessons
// @desc    Add lesson to course
// @access  Private (Course creator/Admin)
router.post(
  "/:id/lessons",
  auth,
  validate(addLessonSchema),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check permissions
      if (
        req.user.role !== "admin" &&
        req.user.id !== course.createdBy.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to add lessons to this course" });
      }

      course.lessons.push(req.body);
      await course.save();

      res.status(201).json({
        message: "Lesson added successfully",
        lesson: course.lessons[course.lessons.length - 1],
      });
    } catch (error) {
      console.error("Add lesson error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid course ID" });
      }
      res.status(500).json({
        message: "Server error while adding lesson",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

export default router;
