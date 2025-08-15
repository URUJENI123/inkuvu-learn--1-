import Course from "../models/Course.js";
import User from "../models/User.js";

const courseController = {
  // Create a new course
  createCourse: async (req, res) => {
    try {
      const courseData = {
        ...req.body,
        instructor: req.user.id,
      };

      const course = new Course(courseData);
      await course.save();

      await course.populate("instructor", "firstName lastName email");

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
      const filter = { isPublished: true };

      if (category) filter.category = category;
      if (level) filter.level = level;
      if (language) filter.language = language;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

      const courses = await Course.find(filter)
        .populate("instructor", "firstName lastName profileImage")
        .sort(sort)
        .skip(skip)
        .limit(Number.parseInt(limit));

      const total = await Course.countDocuments(filter);

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
      const course = await Course.findById(req.params.id)
        .populate("instructor", "firstName lastName profileImage bio")
        .populate("reviews.user", "firstName lastName profileImage");

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if user is enrolled (if authenticated)
      let isEnrolled = false;
      if (req.user) {
        const user = await User.findById(req.user.id);
        isEnrolled = user.coursesEnrolled.includes(course._id);
      }

      res.json({
        course,
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
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if user is instructor or admin
      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "Not authorized to update this course",
        });
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("instructor", "firstName lastName email");

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
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if user is instructor or admin
      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "Not authorized to delete this course",
        });
      }

      await Course.findByIdAndDelete(req.params.id);

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
      const course = await Course.findById(req.params.id);
      const user = await User.findById(req.user.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if already enrolled
      if (user.coursesEnrolled.includes(course._id)) {
        return res.status(400).json({
          message: "Already enrolled in this course",
        });
      }

      // Add course to user's enrolled courses
      user.coursesEnrolled.push(course._id);
      await user.save();

      // Increment enrollment count
      course.enrollmentCount += 1;
      await course.save();

      res.json({
        message: "Successfully enrolled in course",
        course: {
          id: course._id,
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
      const user = await User.findById(req.user.id).populate({
        path: "coursesEnrolled",
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      });

      res.json({
        courses: user.coursesEnrolled,
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

      const user = await User.findById(req.user.id);

      // Check if enrolled
      if (!user.coursesEnrolled.includes(courseId)) {
        return res.status(403).json({
          message: "Not enrolled in this course",
        });
      }

      // Find or create progress entry
      let progressEntry = user.coursesCompleted.find(
        (entry) => entry.courseId.toString() === courseId
      );

      if (!progressEntry) {
        progressEntry = {
          courseId,
          completedLessons: [],
          completionPercentage: 0,
          completedAt: null,
        };
        user.coursesCompleted.push(progressEntry);
      }

      // Update lesson completion
      if (completed && !progressEntry.completedLessons.includes(lessonId)) {
        progressEntry.completedLessons.push(lessonId);
      } else if (!completed) {
        progressEntry.completedLessons = progressEntry.completedLessons.filter(
          (id) => id.toString() !== lessonId
        );
      }

      // Calculate completion percentage
      const course = await Course.findById(courseId);
      const totalLessons = course.lessons.length;
      progressEntry.completionPercentage = Math.round(
        (progressEntry.completedLessons.length / totalLessons) * 100
      );

      // Mark as completed if 100%
      if (
        progressEntry.completionPercentage === 100 &&
        !progressEntry.completedAt
      ) {
        progressEntry.completedAt = new Date();
      }

      await user.save();

      res.json({
        message: "Progress updated successfully",
        progress: progressEntry,
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
      const { rating, comment } = req.body;
      const courseId = req.params.id;

      const course = await Course.findById(courseId);
      const user = await User.findById(req.user.id);

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // Check if enrolled
      if (!user.coursesEnrolled.includes(courseId)) {
        return res.status(403).json({
          message: "Must be enrolled to review this course",
        });
      }

      // Check if already reviewed
      const existingReview = course.reviews.find(
        (review) => review.user.toString() === req.user.id
      );
      if (existingReview) {
        return res.status(400).json({
          message: "You have already reviewed this course",
        });
      }

      // Add review
      course.reviews.push({
        user: req.user.id,
        rating,
        comment,
      });

      // Update average rating
      const totalRating = course.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      course.averageRating = totalRating / course.reviews.length;

      await course.save();
      await course.populate("reviews.user", "firstName lastName profileImage");

      res.json({
        message: "Review added successfully",
        review: course.reviews[course.reviews.length - 1],
        averageRating: course.averageRating,
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
