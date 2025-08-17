import prisma from "../lib/prisma.js";

const courseController = {
  // Create a new course
  createCourse: async (req, res) => {
    try {
      const courseData = {
        ...req.body,
        instructorId: req.user.id,
        createdById: req.user.id,
        category: req.body.category?.toUpperCase(),
        level: req.body.level?.toUpperCase(),
        language: req.body.language?.toUpperCase() || "EN",
      };

      const course = await prisma.course.create({
        data: courseData,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({
        message: "Server error during course creation",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Get all courses with filtering and pagination
  getAllCourses: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        level,
        language,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Build filter object
      const where = { isPublished: true };

      if (category) where.category = category.toUpperCase();
      if (level) where.level = level.toUpperCase();
      if (language) where.language = language.toUpperCase();
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { tags: { has: search } },
        ];
      }

      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
            _count: {
              select: {
                enrollments: true,
                ratings: true,
              },
            },
          },
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take: Number.parseInt(limit),
        }),
        prisma.course.count({ where }),
      ]);

      res.json({
        courses,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / Number.parseInt(limit)),
          totalCourses: total,
          hasNext: skip + courses.length < total,
          hasPrev: Number.parseInt(page) > 1,
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
  },

  // Get single course by ID
  getCourseById: async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              bio: true,
            },
          },
          lessons: {
            include: {
              resources: true,
              quizzes: true,
            },
            orderBy: { order: "asc" },
          },
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              enrollments: true,
              ratings: true,
            },
          },
        },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if user is enrolled (if authenticated)
      let isEnrolled = false;
      if (req.user) {
        const enrollment = await prisma.courseEnrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: req.user.id,
              courseId: course.id,
            },
          },
        });
        isEnrolled = !!enrollment;
      }

      // Calculate average rating
      const averageRating =
        course.ratings.length > 0
          ? course.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            course.ratings.length
          : 0;

      res.json({
        course: {
          ...course,
          averageRating: Number.parseFloat(averageRating.toFixed(1)),
          totalEnrolled: course._count.enrollments,
        },
        isEnrolled,
      });
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({
        message: "Server error while fetching course",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Update course
  updateCourse: async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if user is instructor or admin
      if (course.instructorId !== req.user.id && req.user.role !== "ADMIN") {
        return res.status(403).json({
          message: "Not authorized to update this course",
        });
      }

      const updateData = { ...req.body };
      if (updateData.category)
        updateData.category = updateData.category.toUpperCase();
      if (updateData.level) updateData.level = updateData.level.toUpperCase();
      if (updateData.language)
        updateData.language = updateData.language.toUpperCase();

      const updatedCourse = await prisma.course.update({
        where: { id: req.params.id },
        data: updateData,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Update course error:", error);
      res.status(500).json({
        message: "Server error during course update",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Delete course
  deleteCourse: async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if user is instructor or admin
      if (course.instructorId !== req.user.id && req.user.role !== "ADMIN") {
        return res.status(403).json({
          message: "Not authorized to delete this course",
        });
      }

      await prisma.course.delete({
        where: { id: req.params.id },
      });

      res.json({
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(500).json({
        message: "Server error during course deletion",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Enroll in course
  enrollInCourse: async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.courseEnrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: req.user.id,
            courseId: req.params.id,
          },
        },
      });

      if (existingEnrollment) {
        return res.status(400).json({
          message: "Already enrolled in this course",
        });
      }

      // Create enrollment
      await prisma.courseEnrollment.create({
        data: {
          studentId: req.user.id,
          courseId: req.params.id,
          progress: 0,
          completedLessons: [],
        },
      });

      res.json({
        message: "Successfully enrolled in course",
        course: {
          id: course.id,
          title: course.title,
          thumbnailUrl: course.thumbnailUrl,
        },
      });
    } catch (error) {
      console.error("Enroll course error:", error);
      res.status(500).json({
        message: "Server error during enrollment",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Get user's enrolled courses
  getEnrolledCourses: async (req, res) => {
    try {
      const enrollments = await prisma.courseEnrollment.findMany({
        where: { studentId: req.user.id },
        include: {
          course: {
            include: {
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
      });

      const courses = enrollments.map((enrollment) => ({
        ...enrollment.course,
        enrollmentProgress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
      }));

      res.json({
        courses,
      });
    } catch (error) {
      console.error("Get enrolled courses error:", error);
      res.status(500).json({
        message: "Server error while fetching enrolled courses",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Update course progress
  updateProgress: async (req, res) => {
    try {
      const { lessonId, completed } = req.body;
      const courseId = req.params.id;

      // Check if enrolled
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: req.user.id,
            courseId: courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "Not enrolled in this course",
        });
      }

      // Get course to calculate progress
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { lessons: true },
      });

      let completedLessons = [...enrollment.completedLessons];

      // Update lesson completion
      if (completed && !completedLessons.includes(Number.parseInt(lessonId))) {
        completedLessons.push(Number.parseInt(lessonId));
      } else if (!completed) {
        completedLessons = completedLessons.filter(
          (id) => id !== Number.parseInt(lessonId)
        );
      }

      // Calculate completion percentage
      const totalLessons = course.lessons.length;
      const progress =
        totalLessons > 0 ? completedLessons.length / totalLessons : 0;

      // Update enrollment
      const updatedEnrollment = await prisma.courseEnrollment.update({
        where: {
          studentId_courseId: {
            studentId: req.user.id,
            courseId: courseId,
          },
        },
        data: {
          completedLessons,
          progress,
        },
      });

      // Create completion record if 100%
      if (progress === 1) {
        await prisma.courseCompletion.upsert({
          where: {
            studentId_courseId: {
              studentId: req.user.id,
              courseId: courseId,
            },
          },
          update: {},
          create: {
            studentId: req.user.id,
            courseId: courseId,
            score: null,
          },
        });
      }

      res.json({
        message: "Progress updated successfully",
        progress: {
          courseId,
          completedLessons,
          completionPercentage: Math.round(progress * 100),
          completedAt: progress === 1 ? new Date() : null,
        },
      });
    } catch (error) {
      console.error("Update progress error:", error);
      res.status(500).json({
        message: "Server error during progress update",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Add course review
  addReview: async (req, res) => {
    try {
      const { rating, review } = req.body;
      const courseId = req.params.id;

      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if enrolled
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: req.user.id,
            courseId: courseId,
          },
        },
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "Must be enrolled to review this course",
        });
      }

      // Check if already reviewed
      const existingReview = await prisma.courseRating.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId: courseId,
          },
        },
      });

      if (existingReview) {
        return res.status(400).json({
          message: "You have already reviewed this course",
        });
      }

      // Add review
      const newReview = await prisma.courseRating.create({
        data: {
          userId: req.user.id,
          courseId: courseId,
          rating: Number.parseInt(rating),
          review,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      });

      // Calculate new average rating
      const allRatings = await prisma.courseRating.findMany({
        where: { courseId },
      });
      const averageRating =
        allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

      res.json({
        message: "Review added successfully",
        review: newReview,
        averageRating: Number.parseFloat(averageRating.toFixed(1)),
      });
    } catch (error) {
      console.error("Add review error:", error);
      res.status(500).json({
        message: "Server error while adding review",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },
};

export default courseController;
