import prisma from "../lib/prisma.js";

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
      const where = {};
      if (role) where.role = role.toUpperCase();
      if (isActive !== undefined) where.isActive = isActive === "true";
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profileImage: true,
            bio: true,
            location: true,
            preferredLanguage: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
            updatedAt: true,
            coursesEnrolled: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: Number.parseInt(limit),
        }),
        prisma.user.count({ where }),
      ]);

      // Transform the data to match the expected format
      const transformedUsers = users.map((user) => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
        coursesEnrolled: user.coursesEnrolled.map(
          (enrollment) => enrollment.course
        ),
      }));

      res.json({
        users: transformedUsers,
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
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          profileImage: true,
          bio: true,
          location: true,
          preferredLanguage: true,
          screenReader: true,
          highContrast: true,
          largeText: true,
          audioDescriptions: true,
          signLanguage: true,
          brailleSupport: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          coursesEnrolled: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                  instructor: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
          coursesCompleted: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  thumbnailUrl: true,
                },
              },
            },
          },
          achievements: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Transform the data to match the expected format
      const transformedUser = {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
        accessibilityPreferences: {
          screenReader: user.screenReader,
          highContrast: user.highContrast,
          largeText: user.largeText,
          audioDescriptions: user.audioDescriptions,
          signLanguage: user.signLanguage,
          brailleSupport: user.brailleSupport,
        },
        coursesEnrolled: user.coursesEnrolled.map(
          (enrollment) => enrollment.course
        ),
      };

      res.json({ user: transformedUser });
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

      const validRoles = ["STUDENT", "TEACHER", "PARENT", "ADMIN"];
      const upperRole = role?.toUpperCase();

      if (!validRoles.includes(upperRole)) {
        return res.status(400).json({
          message: "Invalid role specified",
        });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: upperRole },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          profileImage: true,
          bio: true,
          location: true,
          preferredLanguage: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        message: "User role updated successfully",
        user: {
          ...user,
          fullName: `${user.firstName} ${user.lastName}`,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "User not found",
        });
      }
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

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, isActive: true },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !user.isActive },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          isActive: true,
        },
      });

      res.json({
        message: `User ${
          updatedUser.isActive ? "activated" : "deactivated"
        } successfully`,
        user: updatedUser,
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

      const [user, enrollments, completions, achievements] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            createdAt: true,
            lastLogin: true,
          },
        }),
        prisma.courseEnrollment.findMany({
          where: { studentId: userId },
        }),
        prisma.courseCompletion.findMany({
          where: { studentId: userId },
        }),
        prisma.achievement.findMany({
          where: { userId: userId },
        }),
      ]);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const averageProgress =
        enrollments.length > 0
          ? Math.round(
              (enrollments.reduce(
                (sum, enrollment) => sum + enrollment.progress,
                0
              ) /
                enrollments.length) *
                100
            )
          : 0;

      const stats = {
        totalCoursesEnrolled: enrollments.length,
        totalCoursesCompleted: completions.length,
        totalAchievements: achievements.length,
        averageProgress,
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
      const { title, description, icon } = req.body;
      const userId = req.params.id;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const achievement = await prisma.achievement.create({
        data: {
          title,
          description,
          icon,
          userId,
        },
      });

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
      const [
        totalUsers,
        activeUsers,
        totalCourses,
        publishedCourses,
        userRoles,
        courseCategories,
        recentRegistrations,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.course.count(),
        prisma.course.count({ where: { isPublished: true } }),
        prisma.user.groupBy({
          by: ["role"],
          _count: { role: true },
        }),
        prisma.course.groupBy({
          by: ["category"],
          _count: { category: true },
        }),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            },
          },
        }),
      ]);

      const analytics = {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          recentRegistrations,
          roleDistribution: userRoles.map((role) => ({
            _id: role.role,
            count: role._count.role,
          })),
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          draft: totalCourses - publishedCourses,
          categoryDistribution: courseCategories.map((category) => ({
            _id: category.category,
            count: category._count.category,
          })),
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
