import express from "express";
import Joi from "joi";
import User from "../model/User.js";
import Course from "../model/Course.js";
import { auth, adminAuth } from "../middleware/auth.js";
import {
  validate,
  validateQuery,
  paginationSchema,
} from "../utils/validation.js";

const router = express.Router();

// Validation schemas
const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(100).optional(),
  preferredLanguage: Joi.string().valid("en", "fr", "rw").optional(),
  accessibilityPreferences: Joi.object({
    screenReader: Joi.boolean(),
    highContrast: Joi.boolean(),
    largeText: Joi.boolean(),
    audioDescriptions: Joi.boolean(),
    signLanguage: Joi.boolean(),
    brailleSupport: Joi.boolean(),
  }).optional(),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("student", "teacher", "parent", "admin").required(),
});

const addAchievementSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(300).required(),
  icon: Joi.string().max(50).optional(),
});

const userSearchSchema = Joi.object({
  q: Joi.string().min(1).max(100).optional(),
  role: Joi.string().valid("student", "teacher", "parent", "admin").optional(),
  isActive: Joi.boolean().optional(),
  preferredLanguage: Joi.string().valid("en", "fr", "rw").optional(),
  sortBy: Joi.string()
    .valid("createdAt", "lastLogin", "firstName", "coursesCompleted")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

// @route   GET /api/users
// @desc    Get all users with filtering and pagination (Admin only)
// @access  Private (Admin)
router.get(
  "/",
  adminAuth,
  validateQuery(paginationSchema.concat(userSearchSchema)),
  async (req, res) => {
    try {
      const {
        page,
        limit,
        q,
        role,
        isActive,
        preferredLanguage,
        sortBy,
        sortOrder,
      } = req.query;

      // Build filter object
      const filter = {};

      if (q) {
        filter.$or = [
          { firstName: { $regex: q, $options: "i" } },
          { lastName: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ];
      }

      if (role) filter.role = role;
      if (typeof isActive === "boolean") filter.isActive = isActive;
      if (preferredLanguage) filter.preferredLanguage = preferredLanguage;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Execute query
      const users = await User.find(filter)
        .select("-password")
        .populate("coursesEnrolled", "title")
        .populate("coursesCompleted.courseId", "title")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean();

      // Get total count for pagination
      const total = await User.countDocuments(filter);

      // Add computed statistics
      const usersWithStats = users.map((user) => ({
        ...user,
        totalCoursesEnrolled: user.coursesEnrolled?.length || 0,
        totalCoursesCompleted: user.coursesCompleted?.length || 0,
        totalAchievements: user.achievements?.length || 0,
        accountAge: Math.floor(
          (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
        ), // days
      }));

      res.json({
        users: usersWithStats,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
        summary: {
          totalUsers: total,
          activeUsers: await User.countDocuments({ ...filter, isActive: true }),
          inactiveUsers: await User.countDocuments({
            ...filter,
            isActive: false,
          }),
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        message: "Server error while fetching users",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// @route   GET /api/users/stats
// @desc    Get user statistics and analytics (Admin only)
// @access  Private (Admin)
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    // Role distribution
    const roleStats = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Language preferences
    const languageStats = await User.aggregate([
      { $group: { _id: "$preferredLanguage", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrends = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Most active users (by course completions)
    const mostActiveUsers = await User.find({ isActive: true })
      .select("firstName lastName email coursesCompleted")
      .sort({ "coursesCompleted.length": -1 })
      .limit(10)
      .lean();

    // Accessibility preferences usage
    const accessibilityStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          screenReader: "$accessibilityPreferences.screenReader",
          highContrast: "$accessibilityPreferences.highContrast",
          largeText: "$accessibilityPreferences.largeText",
          audioDescriptions: "$accessibilityPreferences.audioDescriptions",
          signLanguage: "$accessibilityPreferences.signLanguage",
          brailleSupport: "$accessibilityPreferences.brailleSupport",
        },
      },
      {
        $group: {
          _id: null,
          screenReader: { $sum: { $cond: ["$screenReader", 1, 0] } },
          highContrast: { $sum: { $cond: ["$highContrast", 1, 0] } },
          largeText: { $sum: { $cond: ["$largeText", 1, 0] } },
          audioDescriptions: { $sum: { $cond: ["$audioDescriptions", 1, 0] } },
          signLanguage: { $sum: { $cond: ["$signLanguage", 1, 0] } },
          brailleSupport: { $sum: { $cond: ["$brailleSupport", 1, 0] } },
        },
      },
    ]);

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        activationRate:
          totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0,
      },
      roleDistribution: roleStats,
      languagePreferences: languageStats,
      registrationTrends,
      mostActiveUsers: mostActiveUsers.map((user) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        completedCourses: user.coursesCompleted?.length || 0,
      })),
      accessibilityUsage: accessibilityStats[0] || {},
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      message: "Server error while fetching user statistics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin or own profile)
router.get("/:id", auth, async (req, res) => {
  try {
    // Check if user can access this profile
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("coursesEnrolled", "title thumbnailUrl category level")
      .populate(
        "coursesCompleted.courseId",
        "title thumbnailUrl category level"
      );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get additional statistics
    const enrolledCoursesProgress = await Course.find({
      "enrolledStudents.student": req.params.id,
    }).select("title enrolledStudents.$");

    const userProgress = enrolledCoursesProgress.map((course) => {
      const enrollment = course.enrolledStudents.find(
        (e) => e.student.toString() === req.params.id
      );
      return {
        courseId: course._id,
        courseTitle: course.title,
        progress: enrollment?.progress || 0,
        completedLessons: enrollment?.completedLessons || [],
        enrolledAt: enrollment?.enrolledAt,
      };
    });

    res.json({
      user: {
        ...user.toJSON(),
        totalCoursesEnrolled: user.coursesEnrolled.length,
        totalCoursesCompleted: user.coursesCompleted.length,
        totalAchievements: user.achievements.length,
        accountAge: Math.floor(
          (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
        ),
        currentProgress: userProgress,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({
      message: "Server error while fetching user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Admin or own profile)
router.put("/:id", auth, validate(updateUserSchema), async (req, res) => {
  try {
    // Check if user can update this profile
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile updated successfully",
      user: updatedUser.toJSON(),
    });
  } catch (error) {
    console.error("Update user error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({
      message: "Server error while updating user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put(
  "/:id/role",
  adminAuth,
  validate(updateRoleSchema),
  async (req, res) => {
    try {
      const { role } = req.body;

      // Prevent admin from changing their own role
      if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "Cannot change your own role" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: `User role updated to ${role}`,
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      console.error("Update user role error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      res.status(500).json({
        message: "Server error while updating user role",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// @route   PUT /api/users/:id/status
// @desc    Activate/Deactivate user (Admin only)
// @access  Private (Admin)
router.put("/:id/status", adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive must be a boolean value" });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === req.params.id && !isActive) {
      return res
        .status(400)
        .json({ message: "Cannot deactivate your own account" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `User account ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({
      message: "Server error while updating user status",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   POST /api/users/:id/achievements
// @desc    Add achievement to user
// @access  Private (Admin or Teacher)
router.post(
  "/:id/achievements",
  auth,
  validate(addAchievementSchema),
  async (req, res) => {
    try {
      // Check permissions
      if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return res
          .status(403)
          .json({ message: "Access denied. Admin or teacher role required." });
      }

      const { title, description, icon = "award" } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if achievement already exists
      const existingAchievement = user.achievements.find(
        (achievement) => achievement.title === title
      );

      if (existingAchievement) {
        return res
          .status(400)
          .json({ message: "User already has this achievement" });
      }

      // Add achievement
      const newAchievement = {
        title,
        description,
        icon,
        earnedAt: new Date(),
      };

      user.achievements.push(newAchievement);
      await user.save();

      res.status(201).json({
        message: "Achievement added successfully",
        achievement: newAchievement,
      });
    } catch (error) {
      console.error("Add achievement error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      res.status(500).json({
        message: "Server error while adding achievement",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// @route   GET /api/users/:id/progress
// @desc    Get user's learning progress
// @access  Private (Admin, Teacher, or own profile)
router.get("/:id/progress", auth, async (req, res) => {
  try {
    // Check permissions
    if (
      req.user.role !== "admin" &&
      req.user.role !== "teacher" &&
      req.user.id !== req.params.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id).select(
      "coursesEnrolled coursesCompleted"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get detailed progress for enrolled courses
    const enrolledCourses = await Course.find({
      "enrolledStudents.student": req.params.id,
    })
      .select("title category level lessons enrolledStudents")
      .populate("instructor", "firstName lastName");

    const progressData = enrolledCourses.map((course) => {
      const enrollment = course.enrolledStudents.find(
        (e) => e.student.toString() === req.params.id
      );
      return {
        courseId: course._id,
        title: course.title,
        category: course.category,
        level: course.level,
        instructor: course.instructor,
        totalLessons: course.lessons.length,
        completedLessons: enrollment?.completedLessons?.length || 0,
        progress: enrollment?.progress || 0,
        enrolledAt: enrollment?.enrolledAt,
        lastActivity: enrollment?.lastActivity || enrollment?.enrolledAt,
      };
    });

    // Get completed courses
    const completedCourses = await Course.find({
      _id: { $in: user.coursesCompleted.map((c) => c.courseId) },
    })
      .select("title category level")
      .populate("instructor", "firstName lastName");

    const completedCoursesData = completedCourses.map((course) => {
      const completion = user.coursesCompleted.find(
        (c) => c.courseId.toString() === course._id.toString()
      );
      return {
        courseId: course._id,
        title: course.title,
        category: course.category,
        level: course.level,
        instructor: course.instructor,
        completedAt: completion?.completedAt,
        score: completion?.score,
      };
    });

    // Calculate overall statistics
    const totalEnrolled = progressData.length;
    const totalCompleted = completedCoursesData.length;
    const averageProgress =
      totalEnrolled > 0
        ? progressData.reduce((sum, course) => sum + course.progress, 0) /
          totalEnrolled
        : 0;

    res.json({
      userId: req.params.id,
      overview: {
        totalEnrolled,
        totalCompleted,
        averageProgress: Math.round(averageProgress),
        completionRate:
          totalEnrolled > 0
            ? Math.round((totalCompleted / totalEnrolled) * 100)
            : 0,
      },
      enrolledCourses: progressData,
      completedCourses: completedCoursesData,
    });
  } catch (error) {
    console.error("Get user progress error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({
      message: "Server error while fetching user progress",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user account (Admin only)
// @access  Private (Admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user from all course enrollments
    await Course.updateMany(
      { "enrolledStudents.student": req.params.id },
      { $pull: { enrolledStudents: { student: req.params.id } } }
    );

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User account deleted successfully",
      deletedUser: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    res.status(500).json({
      message: "Server error while deleting user",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

export default router;
