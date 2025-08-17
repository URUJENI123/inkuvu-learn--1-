import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  });
};

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, role, preferredLanguage } =
        req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists with this email",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: role?.toUpperCase() || "STUDENT",
          preferredLanguage: preferredLanguage?.toUpperCase() || "EN",
        },
      });

      // Generate token
      const token = generateToken(user.id);

      // Return user data
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          fullName: `${user.firstName} ${user.lastName}`,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        message: "Server error during registration",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(400).json({
          message: "Account is deactivated. Please contact support.",
        });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials",
        });
      }

      // Update last login
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Generate token
      const token = generateToken(user.id);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          profileImage: user.profileImage,
          fullName: `${user.firstName} ${user.lastName}`,
          lastLogin: updatedUser.lastLogin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Server error during login",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Get current user
  getMe: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          coursesEnrolled: {
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

      res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          bio: user.bio,
          location: user.location,
          preferredLanguage: user.preferredLanguage,
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
          coursesCompleted: user.coursesCompleted,
          achievements: user.achievements,
          fullName: `${user.firstName} ${user.lastName}`,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        message: "Server error",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const allowedUpdates = [
        "firstName",
        "lastName",
        "bio",
        "location",
        "preferredLanguage",
      ];

      const updates = {};
      const accessibilityUpdates = {};

      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          if (key === "preferredLanguage") {
            updates[key] = req.body[key]?.toUpperCase();
          } else {
            updates[key] = req.body[key];
          }
        } else if (key === "accessibilityPreferences" && req.body[key]) {
          Object.assign(accessibilityUpdates, req.body[key]);
        }
      });

      // Merge accessibility preferences into main updates
      Object.assign(updates, accessibilityUpdates);

      // Update user profile
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: updates,
      });

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          bio: user.bio,
          location: user.location,
          preferredLanguage: user.preferredLanguage,
          accessibilityPreferences: {
            screenReader: user.screenReader,
            highContrast: user.highContrast,
            largeText: user.largeText,
            audioDescriptions: user.audioDescriptions,
            signLanguage: user.signLanguage,
            brailleSupport: user.brailleSupport,
          },
          fullName: `${user.firstName} ${user.lastName}`,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        message: "Server error during profile update",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Change user password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
      });

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        message: "Server error during password change",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Refresh JWT token
  refreshToken: async (req, res) => {
    try {
      // Generate new token
      const token = generateToken(req.user.id);

      res.json({
        message: "Token refreshed successfully",
        token,
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        message: "Server error during token refresh",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      res.json({
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        message: "Server error during logout",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  },
};

export default authController;
