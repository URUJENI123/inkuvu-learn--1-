import User from "../model/User.js";
import Course from "../model/Course.js";

const userController = {
  // Get all users (admin only)
  getAllUsers: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
        isActive,
      } = req.query;

      // Build filter object
      const filter = {};
      if (role) filter.role = role;
      if (isActive !== undefined) filter.isActive = isActive === "true";
      if (search) {
        filter.$or = [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

      const users = await User.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(Number.parseInt(limit))
        .populate("coursesEnrolled", "title");

      const total = await User.countDocuments(filter);

      res.json({
        users,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / Number.parseInt(limit)),
          totalUsers: total,
          hasNext: skip + users.length < total,
          hasPrev: Number.parseInt(page) > 1,
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
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .populate("coursesEnrolled", "title thumbnailUrl instructor")
        .populate("coursesCompleted.courseId", "title thumbnailUrl");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({ user });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        message: "Server error while fetching user",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Update user role (admin only)
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.params.id;

      if (!["student", "teacher", "parent", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role specified",
        });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({
        message: "Server error during role update",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Deactivate/activate user (admin only)
  toggleUserStatus: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.isActive = !user.isActive;
      await user.save();

      res.json({
        message: `User ${
          user.isActive ? "activated" : "deactivated"
        } successfully`,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error("Toggle user status error:", error);
      res.status(500).json({
        message: "Server error during status update",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Get user statistics
  getUserStats: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId)
        .populate("coursesEnrolled")
        .populate("coursesCompleted.courseId");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const stats = {
        totalCoursesEnrolled: user.coursesEnrolled.length,
        totalCoursesCompleted: user.coursesCompleted.filter(
          (course) => course.completionPercentage === 100
        ).length,
        totalAchievements: user.achievements.length,
        averageProgress:
          user.coursesCompleted.length > 0
            ? Math.round(
                user.coursesCompleted.reduce(
                  (sum, course) => sum + course.completionPercentage,
                  0
                ) / user.coursesCompleted.length
              )
            : 0,
        joinDate: user.createdAt,
        lastLogin: user.lastLogin,
      };

      res.json({ stats });
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
  },

  // Add achievement to user
  addAchievement: async (req, res) => {
    try {
      const { title, description, icon, type } = req.body;
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const achievement = {
        title,
        description,
        icon,
        type,
        earnedAt: new Date(),
      };

      user.achievements.push(achievement);
      await user.save();

      res.json({
        message: "Achievement added successfully",
        achievement,
      });
    } catch (error) {
      console.error("Add achievement error:", error);
      res.status(500).json({
        message: "Server error while adding achievement",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Get platform analytics (admin only)
  getPlatformAnalytics: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const totalCourses = await Course.countDocuments();
      const publishedCourses = await Course.countDocuments({
        isPublished: true,
      });

      // User role distribution
      const userRoles = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]);

      // Course category distribution
      const courseCategories = await Course.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);

      // Recent registrations (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentRegistrations = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });

      const analytics = {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          recentRegistrations,
          roleDistribution: userRoles,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          draft: totalCourses - publishedCourses,
          categoryDistribution: courseCategories,
        },
      };

      res.json({ analytics });
    } catch (error) {
      console.error("Get analytics error:", error);
      res.status(500).json({
        message: "Server error while fetching analytics",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },
};

export default userController;
